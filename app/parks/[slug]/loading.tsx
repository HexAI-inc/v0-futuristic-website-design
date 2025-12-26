import { Skeleton } from "@/components/ui/skeleton"

export default function ParkDetailLoading() {
  return (
    <main className="min-h-screen">
      {/* Slideshow Hero Skeleton */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-10 w-32 mx-auto rounded-full" />
          <Skeleton className="h-16 md:h-24 w-3/4 mx-auto" />
          <Skeleton className="h-8 md:h-12 w-1/2 mx-auto" />
        </div>
      </section>

      {/* Features Skeleton */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4 p-6 border rounded-xl">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Skeleton */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className={`w-full rounded-xl ${i % 2 === 0 ? 'h-64' : 'h-96'}`} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
