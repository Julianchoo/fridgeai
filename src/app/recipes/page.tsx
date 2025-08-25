"use client";

import { useSession } from "@/lib/auth-client";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Plus, Search, Filter, Clock, ChefHat, Users, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: Array<{ name: string; amount: string; notes?: string }>;
  instructions: string[];
  nutritionalInfo: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    servings: number;
  };
  cookingTime: string;
  difficulty: string;
  cuisine: string;
  originalImageUrl: string;
  finishedDishImageUrl: string | null;
  createdAt: string;
}

export default function RecipesPage() {
  const { data: session, isPending } = useSession();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cuisine, setCuisine] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's recipes on component mount
  useEffect(() => {
    if (session) {
      fetchRecipes();
    }
  }, [session]);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/recipes", {
        method: "GET",
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes || []);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <UserProfile />
        </div>
      </div>
    );
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleGenerateRecipe = async () => {
    if (!selectedFile || isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      // Step 1: Upload the image
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }
      
      const uploadData = await uploadResponse.json();
      
      // Step 2: Generate recipe
      const recipeResponse = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadData.url,
          cuisine: cuisine.trim(),
          cookingTime: cookingTime.trim(),
        }),
        credentials: "include",
      });
      
      if (!recipeResponse.ok) {
        throw new Error("Failed to generate recipe");
      }
      
      await recipeResponse.json();
      
      // Refresh recipes list
      await fetchRecipes();
      
      // Clear form
      setSelectedFile(null);
      setCuisine("");
      setCookingTime("");
      
      // Reset file input
      const fileInput = document.getElementById("fridge-photo") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
    } catch (error) {
      console.error("Error generating recipe:", error);
      alert("Failed to generate recipe. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Filter recipes based on search term
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Recipes</h1>
            <p className="text-muted-foreground">
              Create new recipes from your fridge photos
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Welcome, {session.user.name}!
          </div>
        </div>

        {/* Add New Recipe Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Recipe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Fridge Photo</label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="fridge-photo"
                />
                <label
                  htmlFor="fridge-photo"
                  className="cursor-pointer space-y-2 block"
                >
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {selectedFile ? selectedFile.name : "Click to upload fridge photo"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cuisine Style (Optional)</label>
                <Input
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  placeholder="Italian, Asian, Mexican, comfort food..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Maximum Cooking Time (Optional)</label>
                <Input
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  placeholder="30 minutes, quick meal, under 1 hour..."
                />
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateRecipe}
              disabled={!selectedFile || isGenerating}
              className="w-full sm:w-auto"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Recipe...
                </>
              ) : (
                "Generate Recipe"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search recipes..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Recipes Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Recipes ({filteredRecipes.length})</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredRecipes.length === 0 ? (
            /* Empty State */
            <Card>
              <CardContent className="p-12 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <ChefHat className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {recipes.length === 0 ? "No recipes yet" : "No recipes match your search"}
                  </h3>
                  <p className="text-muted-foreground">
                    {recipes.length === 0 
                      ? "Upload your first fridge photo to get started with AI-generated recipes"
                      : "Try adjusting your search terms"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Recipes Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="relative h-48 bg-muted">
                    {recipe.finishedDishImageUrl ? (
                      <Image
                        src={recipe.finishedDishImageUrl}
                        alt={recipe.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ChefHat className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{recipe.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {recipe.description}
                      </p>
                      
                      {/* Recipe Metadata */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {recipe.cookingTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <ChefHat className="h-3 w-3" />
                          {recipe.difficulty}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {recipe.nutritionalInfo.servings} servings
                        </div>
                      </div>
                      
                      {/* Cuisine and Calories */}
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {recipe.cuisine}
                        </span>
                        <span className="text-xs font-medium">
                          {recipe.nutritionalInfo.calories} cal/serving
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}