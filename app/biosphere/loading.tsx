import { Skeleton } from "@/components/ui/skeleton"

export default function BiosphereLoading() {
  return (
    <main className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-16 md:h-24 w-3/4 mx-auto" />
          <Skeleton className="h-8 md:h-12 w-1/2 mx-auto" />
          <div className="flex justify-center gap-8 pt-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-10 w-24 mx-auto" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zones Skeleton */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[500px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
