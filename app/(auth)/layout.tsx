import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Image src="/logoclic.svg" alt="clipi.top logo" width={190} height={40} priority />

        <div>
          <blockquote className="text-lg text-primary-foreground/90">
            &ldquo;clipi.top me ayudó a aumentar mis conversiones en un 200%. Ahora todos mis seguidores encuentran mi
            contenido fácilmente.&rdquo;
          </blockquote>
          <div className="mt-4">
            <p className="font-semibold text-primary-foreground">Sofia Mendez</p>
            <p className="text-sm text-primary-foreground/70">Creadora de contenido, +500K seguidores</p>
          </div>
        </div>

        <p className="text-sm text-primary-foreground/60">
          &copy; {new Date().getFullYear()} LinkFlow. Todos los derechos reservados.
        </p>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">{children}</div>
    </div>
  )
}
