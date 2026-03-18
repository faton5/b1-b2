import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function GalleryPage() {
  const images = [
    { id: 1, url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800", prompt: "A futuristic city with flying cars and neon lights, digital art." },
    { id: 2, url: "https://images.unsplash.com/photo-1698205462529-652a2ae5b863?auto=format&fit=crop&q=80&w=800", prompt: "A cute robotic dog made of glass, highly detailed." },
    { id: 3, url: "https://images.unsplash.com/photo-1682687982185-531d09ec56fc?auto=format&fit=crop&q=80&w=800", prompt: "An ancient forest glowing with bioluminescence at night." },
    { id: 4, url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800", prompt: "Earth viewed from space with a glowing grid network." },
    { id: 5, url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800", prompt: "A magical library floating in the clouds." },
    { id: 6, url: "https://images.unsplash.com/photo-1678119020942-03d7cd1db7dc?auto=format&fit=crop&q=80&w=800", prompt: "A hyper-realistic portrait of an astronaut." },
  ]

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Galerie IA</h1>
      <p className="text-muted-foreground mb-8">Découvrez des exemples d'images générées par intelligence artificielle avec leurs requêtes (prompts) associées.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <Card key={img.id} className="overflow-hidden bg-card hover:shadow-lg transition-shadow">
            <div className="relative h-64 w-full">
              <Image 
                src={img.url} 
                alt={img.prompt} 
                fill 
                className="object-cover"
                unoptimized
              />
            </div>
            <CardContent className="p-4">
              <p className="text-sm font-medium italic">"{img.prompt}"</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
