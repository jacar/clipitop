export function TrustedBy() {
  const brands = ["TechStartup Co", "CreatorStudio", "FoodDelivery", "FashionBrand", "MusicLabel", "FitnessClub"]

  return (
    <section className="border-y border-border bg-muted/30 px-4 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Usado por creadores y empresas de todo el mundo
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {brands.map((brand) => (
            <div key={brand} className="text-lg font-semibold text-muted-foreground/50">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
