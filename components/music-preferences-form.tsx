"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Music, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Slider } from "@/components/ui/slider"
// import { Toast } from "@/components/ui/toast"

const formSchema = z.object({
  genresPositive: z.array(z.string()).min(1, {
    message: "Please select at least one genre.",
  }),
  genresNegative: z.array(z.string()).min(1, {
    message: "Please select at least one genre.",
  }),
  favoriteArtists: z.string().min(3, {
    message: "Please enter at least one artist.",
  }),
  tempoPreference: z.number().min(0).max(100),
  moodPreference: z.array(z.string()).min(1, {
    message: "Please select at least one mood.",
  }),
  instrumentalVocal: z.number().min(0).max(100),
})

type FormValues = z.infer<typeof formSchema>

export default function MusicPreferencesForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: Partial<FormValues> = {
    genresPositive: [],
    genresNegative: [],
    favoriteArtists: "",
    tempoPreference: 50,
    moodPreference: [],
    instrumentalVocal: 50,
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(data: FormValues) {
    try {
      console.log('Form submitted with data:', data);
      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      localStorage.setItem("preferences", JSON.stringify(data));
      const ls = localStorage.getItem('preferences');
      console.log('Preferences saved:', ls);
      
      // Show success message or redirect
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Error saving preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const musicGenres = [
    { id: "rock", label: "Rock" },
    { id: "pop", label: "Pop" },
    { id: "hip-hop", label: "Hip Hop" },
    { id: "rnb", label: "R&B" },
    { id: "jazz", label: "Jazz" },
    { id: "classical", label: "Classical" },
    { id: "electronic", label: "Electronic" },
    { id: "country", label: "Country" },
    { id: "folk", label: "Folk" },
    { id: "metal", label: "Metal" },
    { id: "blues", label: "Blues" },
    { id: "reggae", label: "Reggae" },
    { id: "indie", label: "Indie" },
    { id: "latin", label: "Latin" },
    { id: "kpop", label: "K-Pop" },
  ]

  // const musicMoods = [
  //   { id: "energetic", label: "Energetic" },
  //   { id: "relaxing", label: "Relaxing" },
  //   { id: "happy", label: "Happy" },
  //   { id: "melancholic", label: "Melancholic" },
  //   { id: "romantic", label: "Romantic" },
  //   { id: "focus", label: "Focus" },
  //   { id: "workout", label: "Workout" },
  //   { id: "party", label: "Party" },
  //   { id: "chill", label: "Chill" },
  //   { id: "nostalgic", label: "Nostalgic" },
  // ]

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Music Preferences
        </CardTitle>
        <CardDescription>Tell us about your music taste to get personalized recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(form.getValues());
            }} 
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="genresPositive"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Music Genres You Like</FormLabel>
                    <FormDescription>Select the genres you enjoy listening to</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {musicGenres.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="genresPositive"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genresNegative"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Music Genres You Dislike</FormLabel>
                    <FormDescription>Select the genres you enjoy listening to</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {musicGenres.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="genresNegative"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving preferences...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Music Preferences
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        {"We'll use your preferences to create a personalized music experience"}
      </CardFooter>
    </Card>
  )
}

