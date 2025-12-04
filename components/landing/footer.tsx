import Link from "next/link"
import Image from "next/image"
import { Instagram, Twitter, Youtube, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Image src="/logoclic.svg" alt="clipi.top logo" width={190} height={40} />
            <p className="mt-4 text-sm text-muted-foreground">
              La plataforma más fácil para crear biolinks profesionales y landing pages.
            </p>
            <div className="mt-4 flex gap-3">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">Producto</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#features" className="hover:text-foreground">
                  Funciones
                </Link>
              </li>
              <li>
                <Link href="#templates" className="hover:text-foreground">
                  Plantillas
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-foreground">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Integraciones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">Recursos</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Guías
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} clipi.top. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
