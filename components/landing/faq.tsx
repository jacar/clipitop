"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "¿Es realmente gratis?",
    answer:
      "Sí, el plan gratuito es completamente gratis para siempre. Incluye 1 biolink, enlaces ilimitados, plantillas básicas y analíticas. Puedes actualizar a Pro cuando lo necesites.",
  },
  {
    question: "¿Puedo usar mi propio dominio?",
    answer:
      "Sí, con el plan Pro puedes conectar tu propio dominio personalizado (ej: links.tuempresa.com). También ofrecemos subdominios gratuitos con todos los planes.",
  },
  {
    question: "¿Cuántos enlaces puedo agregar?",
    answer:
      "Todos los planes incluyen enlaces ilimitados. Puedes agregar tantos enlaces como necesites a tu biolink sin restricciones.",
  },
  {
    question: "¿Puedo cambiar de plan en cualquier momento?",
    answer:
      "Absolutamente. Puedes actualizar, degradar o cancelar tu plan cuando quieras. Los cambios se aplican inmediatamente y facturamos proporcionalmente.",
  },
  {
    question: "¿Ofrecen soporte técnico?",
    answer:
      "Sí, todos los planes incluyen soporte por email. Los planes Pro y Business tienen acceso a soporte prioritario con tiempos de respuesta garantizados.",
  },
  {
    question: "¿Mis datos están seguros?",
    answer:
      "Tu seguridad es nuestra prioridad. Usamos encriptación SSL, servidores seguros y cumplimos con GDPR. Nunca vendemos tus datos a terceros.",
  },
  {
    question: "¿Puedo ver analíticas de mis enlaces?",
    answer:
      "Sí, todos los planes incluyen analíticas. El plan gratuito incluye vistas básicas, mientras que Pro y Business ofrecen analíticas avanzadas con datos demográficos y geográficos.",
  },
  {
    question: "¿Cómo funciona la prueba gratuita de Pro?",
    answer:
      "La prueba de 14 días de Pro es completamente gratis. No necesitas tarjeta de crédito para empezar. Al terminar, puedes continuar con Pro o volver al plan gratuito.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">Todo lo que necesitas saber sobre LinkFlow</p>
        </div>

        <div className="mt-12 divide-y divide-border rounded-2xl border border-border">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-muted/50"
              >
                <span className="font-medium text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && <div className="px-5 pb-5 text-muted-foreground">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
