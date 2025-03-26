import MusicPreferencesForm from "@/components/music-preferences-form"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Music Preferences</h1>
      <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
        {"Tell us what you like to listen to and we'll create personalized music recommendations just for you."}
      </p>
      <div className="flex justify-center">
        <MusicPreferencesForm />
      </div>
    </main>
  )
}

