"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  contentTypes: z.array(z.string()).min(1, {
    message: "Please select at least one content type.",
  }),
  genres: z.array(z.string()).min(1, {
    message: "Please select at least one genre.",
  }),
  contentRating: z.string({
    required_error: "Please select your preferred content rating.",
  }),
  releaseTimeframe: z.string({
    required_error: "Please select your preferred release timeframe.",
  }),
  popularityPreference: z.number().min(0).max(100),
  discoveryMode: z.boolean().default(false),
  updateFrequency: z.string({
    required_error: "Please select how often you'd like to receive recommendations.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function PreferencesForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: Partial<FormValues> = {
    contentTypes: ["movies", "tv"],
    genres: [],
    contentRating: "all",
    releaseTimeframe: "any",
    popularityPreference: 50,
    discoveryMode: false,
    updateFrequency: "weekly",
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log(data)
    toast({
      title: "Preferences Updated",
      description: "Your recommendation preferences have been saved successfully.",
    })

    setIsSubmitting(false)
  }

  const contentTypes = [
    { id: "movies", label: "Movies" },
    { id: "tv", label: "TV Shows" },
    { id: "books", label: "Books" },
    { id: "music", label: "Music" },
    { id: "podcasts", label: "Podcasts" },
  ]

  const genres = [
    { id: "action", label: "Action" },
    { id: "adventure", label: "Adventure" },
    { id: "comedy", label: "Comedy" },
    { id: "drama", label: "Drama" },
    { id: "fantasy", label: "Fantasy" },
    { id: "horror", label: "Horror" },
    { id: "mystery", label: "Mystery" },
    { id: "romance", label: "Romance" },
    { id: "sci-fi", label: "Sci-Fi" },
    { id: "thriller", label: "Thriller" },
    { id: "documentary", label: "Documentary" },
  ]

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Recommendation Preferences</CardTitle>
        <CardDescription>Customize how our recommendation engine works for you</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="filters">Filters</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                <FormField
                  control={form.control}
                  name="contentTypes"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Content Types</FormLabel>
                        <FormDescription>Select the types of content you're interested in</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {contentTypes.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="contentTypes"
                            render={({ field }) => {
                              return (
                                <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item.id])
                                          : field.onChange(field.value?.filter((value) => value !== item.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{item.label}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="genres"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Genres</FormLabel>
                        <FormDescription>Select the genres you enjoy</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {genres.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="genres"
                            render={({ field }) => {
                              return (
                                <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item.id])
                                          : field.onChange(field.value?.filter((value) => value !== item.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{item.label}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="filters" className="space-y-6">
                <FormField
                  control={form.control}
                  name="contentRating"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Content Rating</FormLabel>
                      <FormDescription>Select your preferred content rating</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="all" />
                            </FormControl>
                            <FormLabel className="font-normal">All Ratings</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="family" />
                            </FormControl>
                            <FormLabel className="font-normal">Family Friendly Only</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="mature" />
                            </FormControl>
                            <FormLabel className="font-normal">Mature Content</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="releaseTimeframe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Release Timeframe</FormLabel>
                      <FormDescription>Choose how recent you want the content to be</FormDescription>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a timeframe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="any">Any Time</SelectItem>
                          <SelectItem value="new">New Releases Only</SelectItem>
                          <SelectItem value="recent">Last 5 Years</SelectItem>
                          <SelectItem value="classic">Classics (10+ Years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="popularityPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Popularity vs. Obscurity</FormLabel>
                      <FormDescription>
                        Adjust how much you want to see popular vs. lesser-known content
                      </FormDescription>
                      <FormControl>
                        <div className="space-y-4">
                          <Slider
                            defaultValue={[field.value]}
                            max={100}
                            step={1}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Hidden Gems</span>
                            <span>Balanced</span>
                            <span>Popular Hits</span>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <FormField
                  control={form.control}
                  name="discoveryMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Discovery Mode</FormLabel>
                        <FormDescription>
                          Occasionally recommend content outside your usual preferences to help you discover new
                          interests
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="updateFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recommendation Frequency</FormLabel>
                      <FormDescription>How often would you like to receive new recommendations?</FormDescription>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving preferences...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Your preferences help us tailor recommendations just for you
      </CardFooter>
    </Card>
  )
}

