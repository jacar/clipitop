import { OnboardingForm } from "@/components/onboarding/onboarding-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Bienvenido - Clipi.top",
    description: "Personaliza tu experiencia en Clipi.top",
}

export default function OnboardingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <OnboardingForm />
        </div>
    )
}
