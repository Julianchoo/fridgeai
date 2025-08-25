import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { recipes } from "@/lib/schema";
import { put } from "@vercel/blob";
import { eq, desc } from "drizzle-orm";

// Schema for structured recipe generation
const RecipeSchema = z.object({
  title: z.string().describe("A catchy name for the recipe"),
  description: z.string().describe("Brief description of the dish"),
  ingredients: z.array(z.object({
    name: z.string().describe("Ingredient name"),
    amount: z.string().describe("Amount needed (e.g., '2 cups', '1 lb', '3 cloves')"),
    notes: z.string().optional().describe("Any special notes about the ingredient")
  })).describe("List of ingredients with portions"),
  instructions: z.array(z.string()).describe("Step-by-step cooking instructions"),
  cookingTime: z.string().describe("Total cooking time estimate"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).describe("Difficulty level"),
  nutritionalInfo: z.object({
    calories: z.number().describe("Estimated calories per serving"),
    protein: z.string().describe("Protein content (e.g., '25g')"),
    carbs: z.string().describe("Carbohydrate content (e.g., '30g')"),
    fat: z.string().describe("Fat content (e.g., '15g')"),
    fiber: z.string().describe("Fiber content (e.g., '8g')"),
    servings: z.number().describe("Number of servings this recipe makes")
  }).describe("Nutritional information per serving")
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { imageUrl, cuisine, cookingTime } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Step 1: Analyze the fridge image with OpenAI Vision
    const ingredientsAnalysis = await generateText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this fridge photo and identify all visible food ingredients. List each ingredient you can clearly see, focusing on fresh produce, proteins, dairy, condiments, and pantry items. Be specific but realistic - only list items you can actually see."
            },
            {
              type: "image",
              image: imageUrl
            }
          ]
        }
      ]
    });

    // Step 2: Generate a structured recipe based on ingredients and preferences
    const recipePrompt = `Based on the following ingredients identified from a fridge photo: ${ingredientsAnalysis.text}

User preferences:
- Cuisine style: ${cuisine || "Any cuisine"}
- Cooking time preference: ${cookingTime || "No specific time limit"}

Create a delicious, practical recipe using primarily the ingredients available. You can suggest common pantry staples (salt, pepper, oil, etc.) that most kitchens have. The recipe should be:
- Realistic and achievable with the available ingredients
- Include proper portions for each ingredient
- Have clear step-by-step instructions
- Include accurate nutritional information
- Match the user's cuisine and time preferences when possible

Make it appealing and something someone would actually want to cook!`;

    const recipe = await generateObject({
      model: openai("gpt-4o"),
      prompt: recipePrompt,
      schema: RecipeSchema,
    });

    // Step 3: Generate an appetizing image of the finished dish using OpenAI's REST API
    const dishImagePrompt = `A professional, appetizing food photograph of ${recipe.object.title}. The dish should look delicious, well-plated, and restaurant-quality. Bright, natural lighting, shallow depth of field, garnished beautifully. Food photography style, high resolution, mouth-watering presentation.`;

    let dishImageUrl: string | null = null;
    try {
      const imageResponse = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: dishImagePrompt,
          size: "1024x1024",
          quality: "standard",
          n: 1,
        }),
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        dishImageUrl = imageData.data[0]?.url;
      }
    } catch (error) {
      console.error("Error generating dish image:", error);
      // Continue without image if generation fails
    }

    // Step 4: Store the generated dish image in Vercel Blob
    let storedDishImageUrl = dishImageUrl;
    if (dishImageUrl) {
      try {
        const imageBuffer = await fetch(dishImageUrl).then(res => res.arrayBuffer());
        const blob = await put(
          `dish-${session.user.id}-${Date.now()}-${recipe.object.title.replace(/[^a-zA-Z0-9]/g, '-')}.png`,
          imageBuffer,
          {
            access: "public",
            contentType: "image/png"
          }
        );
        storedDishImageUrl = blob.url;
      } catch (error) {
        console.error("Error storing dish image:", error);
        // Continue with OpenAI URL if blob storage fails
      }
    }

    // Step 5: Save recipe to database
    const [savedRecipe] = await db.insert(recipes).values({
      userId: session.user.id,
      title: recipe.object.title,
      description: recipe.object.description,
      ingredients: recipe.object.ingredients,
      instructions: recipe.object.instructions,
      nutritionalInfo: recipe.object.nutritionalInfo,
      cookingTime: recipe.object.cookingTime,
      difficulty: recipe.object.difficulty,
      cuisine: cuisine || "Mixed",
      originalImageUrl: imageUrl,
      finishedDishImageUrl: storedDishImageUrl || null,
    }).returning();

    return NextResponse.json({
      success: true,
      recipe: savedRecipe,
      generatedData: recipe.object
    });

  } catch (error) {
    console.error("Recipe generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user's recipes
    const userRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.userId, session.user.id))
      .orderBy(desc(recipes.createdAt));

    return NextResponse.json({
      recipes: userRecipes
    });

  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}