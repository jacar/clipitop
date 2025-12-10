import { PhoneMockup } from './PhoneMockup';

export function ThreeDCarousel() {
    const items = [
        { variant: 'purple' as const },
        { variant: 'blue' as const },
        { variant: 'green' as const },
        { variant: 'orange' as const },
        { variant: 'dark' as const },
    ];

    const radius = 320; // Radius of the carousel
    const count = items.length;
    const angleStep = 360 / count;

    return (
        <div className="relative w-full h-[600px] flex justify-center items-center overflow-visible perspective-container">
            <style>{`
        .perspective-container {
          perspective: 2000px;
        }
        .carousel-track {
          transform-style: preserve-3d;
          animation: spin 20s infinite linear;
          width: 280px;
          height: 560px;
          position: relative;
        }
        .carousel-item {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 3rem;
          /* Backface visibility hidden makes the back of the card invisible, 
             but for a 3D phone we show it. However, since it's just a div, 
             we might want to just show it. It's fine. */
        }
        @keyframes spin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
      `}</style>

            <div className="carousel-track">
                {items.map((item, index) => {
                    const angle = index * angleStep;
                    return (
                        <div
                            key={index}
                            className="carousel-item"
                            style={{
                                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                            }}
                        >
                            <PhoneMockup variant={item.variant} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
