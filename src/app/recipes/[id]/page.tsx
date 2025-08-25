"use client";

import { useSession } from "@/lib/auth-client";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, ChefHat, Users, Share2, Printer, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

export default function RecipeDetailPage() {
  const { data: session, isPending } = useSession();
  const params = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !params.id) return;
    
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/recipes/${params.id}`, {
          method: "GET",
          credentials: "include",
        });
        
        if (response.ok) {
          const data = await response.json();
          setRecipe(data.recipe);
        } else {
          setError("Recipe not found");
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setError("Failed to load recipe");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecipe();
  }, [session, params.id]);

  const handleShare = async () => {
    if (!recipe) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share failed:", error);
      }
    } else {
      // Fallback: copy link to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isPending || isLoading) {
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

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold">Recipe Not Found</h1>
          <p className="text-muted-foreground">{error || "This recipe doesn't exist or you don't have access to it."}</p>
          <Button asChild>
            <Link href="/recipes">← Back to Recipes</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/recipes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Recipe Header */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Dish Image */}
            <div className="lg:w-1/2">
              <div className="relative h-80 lg:h-96 bg-muted rounded-lg overflow-hidden">
                {recipe.finishedDishImageUrl ? (
                  <Image
                    src={recipe.finishedDishImageUrl}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ChefHat className="h-20 w-20 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Recipe Info */}
            <div className="lg:w-1/2 space-y-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
                <p className="text-lg text-muted-foreground">{recipe.description}</p>
              </div>

              {/* Recipe Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Cooking Time</p>
                    <p className="text-sm text-muted-foreground">{recipe.cookingTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Difficulty</p>
                    <p className="text-sm text-muted-foreground">{recipe.difficulty}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Servings</p>
                    <p className="text-sm text-muted-foreground">{recipe.nutritionalInfo.servings}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Cuisine</p>
                    <p className="text-sm text-muted-foreground">{recipe.cuisine}</p>
                  </div>
                </div>
              </div>

              {/* Nutritional Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Nutritional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Calories:</span> {recipe.nutritionalInfo.calories} per serving
                    </div>
                    <div>
                      <span className="font-medium">Protein:</span> {recipe.nutritionalInfo.protein}
                    </div>
                    <div>
                      <span className="font-medium">Carbs:</span> {recipe.nutritionalInfo.carbs}
                    </div>
                    <div>
                      <span className="font-medium">Fat:</span> {recipe.nutritionalInfo.fat}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Fiber:</span> {recipe.nutritionalInfo.fiber}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between items-start">
                    <span className="font-medium">{ingredient.name}</span>
                    <span className="text-muted-foreground text-sm ml-2">{ingredient.amount}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Original Fridge Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Original Fridge Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-48 bg-muted rounded-lg overflow-hidden">
              <Image
                src={recipe.originalImageUrl}
                alt="Original fridge photo"
                fill
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}