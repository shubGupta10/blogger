'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, Sparkles, Tag } from 'lucide-react';
import { cn } from "@/lib/utils";
import ChooseCategories from './ChooseCategories';
import { useMyContext } from '@/context/ContextProvider';
import { Badge } from "@/components/ui/badge";

export default function ChooseCategoryComponent() {
  const { user } = useMyContext();
  const multipleCategories = user?.recommendedCategory || [];
  const isNewUser = !multipleCategories.length;

  return (
    <Card className={cn(
      "w-full ",
      "bg-white dark:bg-gray-900/50",
      "border border-gray-100 dark:border-gray-800",
      "shadow-lg backdrop-blur-sm",
      "transition-all duration-300"
    )}>
      <CardHeader className="pb-2 space-y-4 sm:space-y-0 sm:flex sm:items-start sm:gap-4">
        <div className="relative flex-shrink-0">
          <Sparkles className="h-8 w-8 text-blue-500 dark:text-blue-400" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
            <span className={cn(
              "bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300",
              "bg-clip-text text-transparent"
            )}>
              {isNewUser ? 'Personalize Your Feed' : 'Your Blog Preferences'}
            </span>
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">
            {isNewUser
              ? 'Select topics that interest you to get started'
              : 'Customize your reading experience'}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {isNewUser ? (
          <div className="prose prose-gray dark:prose-invert">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Choose topics that interest you and we'll curate a personalized feed
              of high-quality content just for you.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-blue-500" />
              <span className="text-sm sm:text-md font-medium text-gray-700 dark:text-gray-300">
                Your Selected Categories
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {multipleCategories.map((category: string) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {isNewUser && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Pro tip
              </span>
              <span className="hidden sm:inline">Select 5+ categories for the best experience</span>
              <span className="sm:hidden">Select 5+ categories</span>
            </div>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className={cn(
                  "group relative overflow-hidden w-full sm:w-auto sm:ml-auto",
                  "bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100",
                  "text-white dark:text-black",
                  "transition-all duration-300"
                )}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="text-sm sm:text-base">{isNewUser ? 'Get Started' : 'Update Preferences'}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-4xl h-[90vh]">
              <ChooseCategories />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}