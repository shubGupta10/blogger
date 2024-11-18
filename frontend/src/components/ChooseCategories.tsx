'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Check, Tags } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMutation } from '@apollo/client'
import { AddCategoriesToUserDocument, AddCategoriesToUserMutation, AddCategoriesToUserMutationVariables } from '@/gql/graphql'
import Loader from './Loader'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ChooseCategories() {
  const router = useRouter()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [addCategoriesToUser, { loading, error }] = useMutation<
    AddCategoriesToUserMutation,
    AddCategoriesToUserMutationVariables
  >(AddCategoriesToUserDocument)

  const categories = {
    'Tech & Programming': [
      'technology', 'programming', 'web-development', 'mobile-development', 
      'data-science', 'artificial-intelligence', 'cloud-computing', 'devops', 
      'cybersecurity'
    ],
    'Health & Wellness': [
      'health', 'fitness', 'nutrition', 'mental-health', 'sports'
    ],
    'Lifestyle': [
      'lifestyle', 'fashion', 'beauty', 'travel', 'food', 'recipes', 'parenting', 
      'relationships'
    ],
    'Finance': [
      'finance', 'investing', 'personal-finance', 'real-estate'
    ],
    'Science & Education': [
      'education', 'science', 'astronomy', 'physics', 'chemistry', 'biology'
    ],
    'Entertainment': [
      'entertainment', 'movies', 'music', 'tv-shows', 'books', 'gaming'
    ],
    'Arts & Culture': [
      'art', 'photography'
    ],
    'News & Society': [
      'politics', 'world-news', 'history', 'environment', 'nature', 'animals'
    ],
    'Business': [
      'business', 'marketing', 'entrepreneurship', 'startups'
    ],
    'Personal Growth': [
      'productivity', 'self-improvement', 'spirituality', 'philosophy'
    ]
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const saveCategories = async () => {
    try {
      const response = await addCategoriesToUser({
        variables: { categories: selectedCategories }
      })
      router.push("/pages/publicBlogs")
      toast.success("Your preferences saved");
    } catch (err) {
      toast.error("Something went wrong, Please try again!");
      console.error("Error saving categories:", err)
    }
  }

  if (loading) return <Loader />
  if (error) return <p>Error saving categories</p>

  return (
    <Card className="w-full max-w-4xl mx-auto border-none  shadow-none">
      <CardHeader className="text-center pb-2">
     
        <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Tags className="h-8 w-8" />
          Personalize Your Feed
        </CardTitle>
        <CardDescription className="text-lg">
          Choose categories that match your interests
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <ScrollArea className="h-[50vh] pr-4">
          <div className="space-y-6">
            {Object.entries(categories).map(([section, items]) => (
              <div key={section} className="space-y-3">
                <h3 className="text-lg font-semibold text-muted-foreground">{section}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {items.map((category) => {
                    const isSelected = selectedCategories.includes(category)
                    return (
                      <Button
                        key={category}
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "h-auto py-2 px-3 justify-start text-left space-x-2 w-full",
                          isSelected && "bg-primary text-primary-foreground shadow-inner"
                        )}
                        onClick={() => toggleCategory(category)}
                      >
                        <Check className={cn(
                          "h-4 w-4 shrink-0 opacity-0 transition-opacity",
                          isSelected && "opacity-100"
                        )} />
                        <span className="text-xs sm:text-sm font-medium leading-tight line-clamp-2">
                          {category.split('-').join(' ')}
                        </span>
                      </Button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 pb-6">
        <Button 
          onClick={saveCategories}
          className="w-full sm:w-auto"
          size="lg"
        >
          Save Preferences
        </Button>
        <div className="flex flex-wrap gap-2 justify-center">
          {selectedCategories.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}