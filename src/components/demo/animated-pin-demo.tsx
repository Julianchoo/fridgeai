"use client";
import React from "react";
import { PinContainer } from "../ui/3d-pin";
import { Clock, BookOpen, Users } from "lucide-react";

export function AnimatedPinDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <PinContainer
        title="Save Time & Money"
        href="#"
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem]">
          <div className="flex justify-center mb-4">
            <Clock className="h-12 w-12 text-primary" />
          </div>
          <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
            Save Time & Money
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500">
              No more wondering what to cook. Use what you have and reduce food waste.
            </span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500" />
        </div>
      </PinContainer>

      <PinContainer
        title="Detailed Recipes"
        href="#"
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem]">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
            Detailed Recipes
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500">
              Get complete recipes with ingredients, instructions, nutritional info, and difficulty levels.
            </span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500" />
        </div>
      </PinContainer>

      <PinContainer
        title="Easy Sharing"
        href="#"
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem]">
          <div className="flex justify-center mb-4">
            <Users className="h-12 w-12 text-primary" />
          </div>
          <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
            Easy Sharing
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500">
              Share your favorite recipes with friends and family via link, email, or PDF.
            </span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500" />
        </div>
      </PinContainer>
    </div>
  );
}