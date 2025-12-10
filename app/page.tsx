import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { TrustedBy } from "@/components/landing/trusted-by"
import { Stats } from "@/components/landing/stats"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Templates } from "@/components/landing/templates"
import { UseCases } from "@/components/landing/use-cases"
import { Comparison } from "@/components/landing/comparison"
import { Pricing } from "@/components/landing/pricing"
import { Testimonials } from "@/components/landing/testimonials"
import { FAQ } from "@/components/landing/faq"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <Stats />
        <Features />
        <HowItWorks />
        <Templates />
        <UseCases />
        <Comparison />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
