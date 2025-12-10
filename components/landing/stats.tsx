const stats = [
  { value: "50K+", label: "Creadores activos" },
  { value: "2M+", label: "Clics mensuales" },
  { value: "99.9%", label: "Uptime garantizado" },
  { value: "4.9/5", label: "Calificación usuarios" },
]

export function Stats() {
  return (
    <section className="border-y border-border bg-primary px-4 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-primary-foreground">{stat.value}</div>
              <div className="mt-1 text-sm text-primary-foreground/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
