"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { ChefHat, Camera, Sparkles } from "lucide-react";
import { HeroHighlightDemo } from "@/components/demo/hero-highlight-demo";
import { FileUploadDemo } from "@/components/demo/file-upload-demo";
import { AnimatedPinDemo } from "@/components/demo/animated-pin-demo";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="py-16">
        <HeroHighlightDemo />
        <div className="container mx-auto px-4 text-center mt-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload a photo of your fridge and let AI create personalized recipes 
              with the ingredients you already have. No more food waste, just great meals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/recipes">Start Cooking</Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/recipes">Get Started</Link>
                </Button>
              )}
              <Button variant="outline" size="lg" className="text-lg px-8">
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* File Upload Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Upload Your Fridge Photo</h2>
          <p className="text-muted-foreground">Take a photo and let AI work its magic</p>
        </div>
        <FileUploadDemo />
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              How FridgeAI Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">1. Snap Your Fridge</h3>
                <p className="text-muted-foreground">
                  Take a photo of your fridge contents and upload it to FridgeAI
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">2. AI Magic</h3>
                <p className="text-muted-foreground">
                  Our AI identifies ingredients and creates a personalized recipe with your preferences
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-primary/10">
                    <ChefHat className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">3. Start Cooking</h3>
                <p className="text-muted-foreground">
                  Get detailed instructions, nutritional info, and a beautiful dish photo
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose FridgeAI?
            </h2>
            
            <div className="flex justify-center">
              <AnimatedPinDemo />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">
              Ready to Transform Your Cooking?
            </h2>
            <p className="text-lg opacity-90">
              Join thousands of home cooks who are reducing food waste and discovering new recipes every day.
            </p>
            <Button 
              asChild 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8"
            >
              {session ? (
                <Link href="/recipes">Create Your First Recipe</Link>
              ) : (
                <Link href="/recipes">Get Started Free</Link>
              )}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
