"use client";

import Link from "next/link";
import { UserProfile } from "@/components/auth/user-profile";
import { ModeToggle } from "./ui/mode-toggle";
import { ChefHat } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export function SiteHeader() {
  const { data: session } = useSession();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90">
          <ChefHat className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">FridgeAI</h1>
        </Link>

        {/* Navigation */}
        {session && (
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/recipes"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              My Recipes
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Profile
            </Link>
          </nav>
        )}

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <UserProfile />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
