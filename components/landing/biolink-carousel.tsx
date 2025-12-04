"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const CAROUSEL_IMAGES = [
    "/carousel/example1.png",
    "/carousel/example2.png",
    "/carousel/example3.png",
    "/carousel/example4.png",
    "/carousel/example5.png",
    "/carousel/example6.png",
]

export function BiolinkCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [])

    const getSlideStyles = (index: number) => {
        const diff = index - currentIndex
        const absIndex = ((index - currentIndex + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length)

        if (diff === 0) {
            return {
                transform: "translateX(0%) scale(1) rotateY(0deg)",
                zIndex: 30,
                opacity: 1,
            }
        }

        if (absIndex === 1) {
            return {
                transform: "translateX(70%) scale(0.85) rotateY(-25deg)",
                zIndex: 20,
                opacity: 0.7,
            }
        }

        if (absIndex === 2) {
            return {
                transform: "translateX(140%) scale(0.7) rotateY(-35deg)",
                zIndex: 10,
                opacity: 0.4,
            }
        }

        if (absIndex === CAROUSEL_IMAGES.length - 1) {
            return {
                transform: "translateX(-70%) scale(0.85) rotateY(25deg)",
                zIndex: 20,
                opacity: 0.7,
            }
        }

        if (absIndex === CAROUSEL_IMAGES.length - 2) {
            return {
                transform: "translateX(-140%) scale(0.7) rotateY(35deg)",
                zIndex: 10,
                opacity: 0.4,
            }
        }

        return {
            transform: "translateX(200%) scale(0.5)",
            zIndex: 0,
            opacity: 0,
        }
    }

    return (
        <div className="relative w-full max-w-2xl mx-auto py-12">
            <div
                className="relative h-[600px] flex items-center justify-center"
                style={{ perspective: "2000px" }}
            >
                {CAROUSEL_IMAGES.map((image, index) => {
                    const styles = getSlideStyles(index)

                    return (
                        <div
                            key={image}
                            className="absolute cursor-pointer transition-all duration-700 ease-out"
                            style={{
                                ...styles,
                                transformStyle: "preserve-3d",
                            }}
                            onClick={() => setCurrentIndex(index)}
                        >
                            <div className="relative w-[280px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src={image}
                                    alt={`Biolink example ${index + 1}`}
                                    fill
                                    className="object-contain"
                                    priority={index === 0}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex justify-center gap-2 mt-8">
                {CAROUSEL_IMAGES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                ? "w-8 bg-primary"
                                : "w-2 bg-primary/30 hover:bg-primary/50"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
