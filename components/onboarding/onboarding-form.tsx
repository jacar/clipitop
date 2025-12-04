"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Briefcase, Sparkles, User, Check } from "lucide-react"

type Category = "creator" | "business" | "personal"

interface CategoryOption {
    id: Category
    title: string
    description: string
    icon: React.ReactNode
    color: string
}

const categories: CategoryOption[] = [
    {
        id: "creator",
        title: "Creador",
        description: "Para influencers, artistas y creadores de contenido",
        icon: <Sparkles className="h-8 w-8" />,
        color: "from-purple-500 to-pink-500",
    },
    {
        id: "business",
        title: "Negocio",
        description: "Para empresas, marcas y tiendas",
        icon: <Briefcase className="h-8 w-8" />,
        color: "from-blue-500 to-cyan-500",
    },
    {
        id: "personal",
        title: "Personal",
        description: "Para uso personal y portafolio",
        icon: <User className="h-8 w-8" />,
        color: "from-green-500 to-emerald-500",
    },
]

export function OnboardingForm() {
    const router = useRouter()
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleContinue = async () => {
        if (!selectedCategory) return

        setIsLoading(true)

        // Update user with selected category
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            const user = JSON.parse(storedUser)
            user.category = selectedCategory
            localStorage.setItem("user", JSON.stringify(user))
        }

        // Simulate processing
        await new Promise((resolve) => setTimeout(resolve, 800))

        setIsLoading(false)
        router.push("/dashboard")
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                        <span className="text-2xl font-bold text-primary-foreground">C</span>
                    </div>
                    <span className="text-3xl font-bold">Clipi.top</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-3">Escoge tu categoría</h1>
                <p className="text-lg text-muted-foreground">
                    ¿Cuál de las siguientes opciones describe mejor tu objetivo al utilizar Clipi.top?
                </p>
                <p className="text-sm text-muted-foreground mt-2">Esto nos ayuda a personalizar tu experiencia.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`relative group rounded-2xl border-2 p-6 text-left transition-all hover:scale-105 ${selectedCategory === category.id
                                ? "border-primary bg-primary/5 shadow-lg"
                                : "border-border bg-card hover:border-primary/50"
                            }`}
                    >
                        {selectedCategory === category.id && (
                            <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                                <Check className="h-5 w-5 text-primary-foreground" />
                            </div>
                        )}

                        <div
                            className={`inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-white mb-4 shadow-md`}
                        >
                            {category.icon}
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-2">{category.title}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                    </button>
                ))}
            </div>

            <div className="flex justify-center">
                <Button
                    onClick={handleContinue}
                    disabled={!selectedCategory || isLoading}
                    size="lg"
                    className="min-w-[200px]"
                >
                    {isLoading ? "Configurando..." : "Continuar"}
                </Button>
            </div>
        </div>
    )
}
