"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Eye, MousePointer, TrendingUp, Globe, Smartphone, Monitor } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analíticas</h1>
        <p className="mt-1 text-muted-foreground">Monitorea el rendimiento de tus biolinks</p>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Visitas (7 días)</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <div className="flex items-center gap-1 text-xs text-primary">
              <TrendingUp className="h-3 w-3" />
              +18.2%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clics totales</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <div className="flex items-center gap-1 text-xs text-primary">
              <TrendingUp className="h-3 w-3" />
              +12.5%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">CTR Promedio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43.3%</div>
            <div className="flex items-center gap-1 text-xs text-primary">
              <TrendingUp className="h-3 w-3" />
              +5.2%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Países únicos</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="text-xs text-muted-foreground">Visitantes globales</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts placeholder */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visitas por día</CardTitle>
            <CardDescription>Últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-end justify-between gap-2">
              {[65, 45, 78, 52, 89, 67, 94].map((value, i) => (
                <div key={i} className="flex-1">
                  <div
                    className="w-full rounded-t-sm bg-primary transition-all hover:bg-primary/80"
                    style={{ height: `${value}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Lun</span>
              <span>Mar</span>
              <span>Mié</span>
              <span>Jue</span>
              <span>Vie</span>
              <span>Sáb</span>
              <span>Dom</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enlaces más populares</CardTitle>
            <CardDescription>Por número de clics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Mi curso online", clicks: 456, percent: 100 },
                { name: "Canal de YouTube", clicks: 324, percent: 71 },
                { name: "Instagram", clicks: 234, percent: 51 },
                { name: "Tienda online", clicks: 156, percent: 34 },
                { name: "Contacto", clicks: 64, percent: 14 },
              ].map((link) => (
                <div key={link.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{link.name}</span>
                    <span className="text-muted-foreground">{link.clicks} clics</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${link.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dispositivos</CardTitle>
            <CardDescription>Distribución de visitantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <span>Móvil</span>
                </div>
                <span className="font-medium">68%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <span>Escritorio</span>
                </div>
                <span className="font-medium">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <circle cx="12" cy="18" r="1" />
                  </svg>
                  <span>Tablet</span>
                </div>
                <span className="font-medium">4%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Países principales</CardTitle>
            <CardDescription>Top 5 por visitas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { country: "México", visits: 892, flag: "🇲🇽" },
                { country: "España", visits: 654, flag: "🇪🇸" },
                { country: "Argentina", visits: 432, flag: "🇦🇷" },
                { country: "Colombia", visits: 321, flag: "🇨🇴" },
                { country: "Chile", visits: 234, flag: "🇨🇱" },
              ].map((item) => (
                <div key={item.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.flag}</span>
                    <span>{item.country}</span>
                  </div>
                  <span className="font-medium">{item.visits}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
