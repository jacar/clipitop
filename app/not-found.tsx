import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-foreground">404</h1>
                <h2 className="mt-4 text-2xl font-semibold text-foreground">Página no encontrada</h2>
                <p className="mt-2 text-muted-foreground">
                    Lo sentimos, la página que buscas no existe.
                </p>
                <Button asChild className="mt-6">
                    <Link href="/">Volver al inicio</Link>
                </Button>
            </div>
        </div>
    )
}
