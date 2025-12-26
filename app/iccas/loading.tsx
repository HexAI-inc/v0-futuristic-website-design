import { Skeleton } from "@/components/ui/skeleton"

export default function ICCAsLoading() {
  return (
    <main className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-16 md:h-24 w-3/4 mx-auto" />
          <Skeleton className="h-8 md:h-12 w-1/2 mx-auto" />
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
