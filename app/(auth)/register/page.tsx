import { RegisterForm } from "@/components/auth/register-form"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Crear cuenta - Clipi.top",
  description: "Crea tu cuenta gratuita y comienza a crear biolinks profesionales.",
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md">Cargando...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
