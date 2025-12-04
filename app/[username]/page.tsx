import type { Metadata } from "next"
import { PublicBiolink } from "@/components/public/public-biolink"

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  return {
    title: `@${username} | LinkFlow`,
    description: `Visita el perfil de @${username} en LinkFlow`,
  }
}

export default async function PublicBiolinkPage({ params }: Props) {
  const { username } = await params
  return <PublicBiolink username={username} />
}
