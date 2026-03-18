import Image from "next/image"

const images = [
  {
    id: 1,
    src: "https://images.pexels.com/photos/18069698/pexels-photo-18069698/free-photo-of-futuriste-neon-lumiere-technologie.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "Portrait futuriste néon",
    description: "Visage généré par IA avec jeux de lumières néon.",
  },
  {
    id: 2,
    src: "https://images.pexels.com/photos/17878355/pexels-photo-17878355/free-photo-of-femme-intelligence-artificielle-futuriste-portrait.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "Avatar cybernétique",
    description: "Personnage mi-humain mi-machine dans un univers digital.",
  },
  {
    id: 3,
    src: "https://images.pexels.com/photos/18069699/pexels-photo-18069699/free-photo-of-futuriste-neon-lumiere-technologie.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "Ville générée par IA",
    description: "Skyline nocturne avec architecture impossible.",
  },
  {
    id: 4,
    src: "https://images.pexels.com/photos/18069511/pexels-photo-18069511/free-photo-of-intelligence-artificielle-puce-technologie-cybersecurite.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "Puce quantique",
    description: "Macro d’un processeur imaginaire ultra-détaillé.",
  },
  {
    id: 5,
    src: "https://images.pexels.com/photos/18069510/pexels-photo-18069510/free-photo-of-intelligence-artificielle-puce-technologie-cybersecurite.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "Réseau neuronal",
    description: "Visualisation artistique de circuits et connexions.",
  },
  {
    id: 6,
    src: "https://images.pexels.com/photos/17483873/pexels-photo-17483873/free-photo-of-futuriste-lumiere-technologie-ordinateur-portable.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "Studio créatif IA",
    description: "Artiste numérique entouré d’écrans génératifs.",
  },
  {
    id: 7,
    src: "https://images.pexels.com/photos/16665617/pexels-photo-16665617/free-photo-of-ville-lumiere-rue-nuit.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "Rue rétro-futuriste",
    description: "Scène de rue stylisée façon film de science-fiction.",
  },
  {
    id: 8,
    src: "https://images.pexels.com/photos/20498519/pexels-photo-20498519/free-photo-of-lumineux-neon-technologie-futuriste.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "Paysage abstrait IA",
    description: "Montagnes lumineuses aux couleurs surréalistes.",
  },
  {
    id: 9,
    src: "https://images.pexels.com/photos/17483869/pexels-photo-17483869/free-photo-of-futuriste-technologie-ordinateur-portable-ia.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "Interface holographique",
    description: "Dashboard transparent inspiré par les films SF.",
  },
  {
    id: 10,
    src: "https://images.pexels.com/photos/20503219/pexels-photo-20503219/free-photo-of-homme-technologie-futuriste-ia.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "Explorateur virtuel",
    description: "Personnage plongé dans un monde généré par IA.",
  },
  {
    id: 11,
    src: "https://images.pexels.com/photos/18169478/pexels-photo-18169478/free-photo-of-intelligence-artificielle-technologie-homme-portrait.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "Double numérique",
    description: "Portrait humain fusionné avec des motifs algorithmiques.",
  },
  {
    id: 12,
    src: "https://images.pexels.com/photos/18169477/pexels-photo-18169477/free-photo-of-intelligence-artificielle-technologie-femme-portrait.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "Muse générative",
    description: "Figure féminine stylisée par un modèle de diffusion.",
  },
]

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <header className="space-y-3 md:space-y-4 mb-8 md:mb-12">
          <p className="inline-flex items-center rounded-full bg-slate-800/70 border border-slate-700 px-3 py-1 text-xs font-medium text-slate-200">
            Galerie IA
          </p>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-50">
              Galerie d&apos;images générées par l&apos;IA
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-2xl">
              Une sélection d&apos;illustrations, portraits et paysages futuristes inspirés par l&apos;intelligence
              artificielle. Utilise cette galerie comme source d&apos;inspiration pour tes projets ou tes modules.
            </p>
          </div>
        </header>

        <main className="space-y-8">
          <section>
            <div className="grid gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <article
                  key={image.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/90 shadow-lg shadow-slate-950/60"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-4">
                    <h2 className="text-sm md:text-base font-semibold text-slate-50 drop-shadow">
                      {image.title}
                    </h2>
                    <p className="mt-1 text-xs md:text-[13px] text-slate-200/80 line-clamp-2">
                      {image.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

