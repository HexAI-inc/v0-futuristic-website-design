import { Skeleton } from "@/components/ui/skeleton"

export default function ParksLoading() {
  return (
    <main className="min-h-screen pt-16">
      <div className="container mx-auto max-w-7xl px-4 py-20">
        {/* Header Skeleton */}
        <div className="text-center mb-16 space-y-4">
          <Skeleton className="h-12 w-3/4 md:w-1/2 mx-auto" />
          <Skeleton className="h-6 w-full md:w-2/3 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>

        {/* Filter Skeleton */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* Parks Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-4 pt-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
