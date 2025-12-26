import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Skeleton */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-16 md:h-24 w-3/4 mx-auto" />
          <Skeleton className="h-8 md:h-12 w-1/2 mx-auto" />
          <Skeleton className="h-14 w-40 mx-auto rounded-full" />
        </div>
      </section>

      {/* Stats Skeleton */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
