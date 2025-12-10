import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Iniciar Sesión - Clipi.top",
  description: "Accede a tu cuenta de Clipi.top para gestionar tus biolinks.",
}

export default function LoginPage() {
  return <LoginForm />
}
