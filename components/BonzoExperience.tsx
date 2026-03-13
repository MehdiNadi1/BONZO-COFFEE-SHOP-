"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function BonzoExperience() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    const totalFrames = 120;

    // Preload images
    useEffect(() => {
        let loadCount = 0;
        const imgArray: HTMLImageElement[] = [];

        for (let i = 0; i < totalFrames; i++) {
            const img = new Image();
            img.src = `/sequence/frame_${i}.jpg`;
            img.onload = () => {
                loadCount++;
                setProgress(Math.round((loadCount / totalFrames) * 100));
                if (loadCount === totalFrames) {
                    setImages(imgArray);
                    setLoaded(true);
                }
            };
            img.onerror = () => {
                // Fallback or ignore error for resilience
                loadCount++;
                if (loadCount === totalFrames) {
                    setImages(imgArray);
                    setLoaded(true);
                }
            };
            imgArray.push(img);
        }
    }, []);

    // Scroll tracking
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Canvas drawing
    useEffect(() => {
        if (!loaded || images.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const render = (progressValue: number) => {
            const frameIndex = Math.min(
                totalFrames - 1,
                Math.max(0, Math.floor(progressValue * totalFrames))
            );
            const img = images[frameIndex];

            if (img && img.complete && img.naturalHeight !== 0) {
                // Handle responsive scaling (contain logic)
                const canvasRatio = canvas.width / canvas.height;
                const imgRatio = img.width / img.height;
                let renderWidth = canvas.width;
                let renderHeight = canvas.height;
                let offsetX = 0;
                let offsetY = 0;

                if (canvasRatio > imgRatio) {
                    renderWidth = canvas.height * imgRatio;
                    offsetX = (canvas.width - renderWidth) / 2;
                } else {
                    renderHeight = canvas.width / imgRatio;
                    offsetY = (canvas.height - renderHeight) / 2;
                }

                ctx.fillStyle = "#050505";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
            }
        };

        // Initial render
        render(0);

        // Subscribe to scroll updates
        const unsubscribe = smoothProgress.on("change", (latest) => {
            render(latest);
        });

        // Handle resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render(smoothProgress.get());
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // trigger initial sizing

        return () => {
            unsubscribe();
            window.removeEventListener("resize", handleResize);
        };
    }, [loaded, images, smoothProgress]);

    // Scrollytelling Beats setup
    // Beat A: 0 - 20%
    const opacityA = useTransform(smoothProgress, [0, 0.05, 0.15, 0.2], [0, 1, 1, 0]);
    const yA = useTransform(smoothProgress, [0, 0.05, 0.15, 0.2], [20, 0, 0, -20]);

    // Beat B: 25 - 45%
    const opacityB = useTransform(smoothProgress, [0.25, 0.3, 0.4, 0.45], [0, 1, 1, 0]);
    const yB = useTransform(smoothProgress, [0.25, 0.3, 0.4, 0.45], [20, 0, 0, -20]);

    // Beat C: 50 - 70%
    const opacityC = useTransform(smoothProgress, [0.5, 0.55, 0.65, 0.7], [0, 1, 1, 0]);
    const yC = useTransform(smoothProgress, [0.5, 0.55, 0.65, 0.7], [20, 0, 0, -20]);

    // Beat D: 75 - 95%
    const opacityD = useTransform(smoothProgress, [0.75, 0.8, 0.9, 0.95], [0, 1, 1, 0]);
    const yD = useTransform(smoothProgress, [0.75, 0.8, 0.9, 0.95], [20, 0, 0, -20]);

    // Scroll to Extract indicator
    const indicatorOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

    if (!loaded) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white">
                <div className="text-sm uppercase tracking-[0.2em] text-[#D4AF37] mb-6 animate-pulse">
                    Calibrating Extraction
                </div>
                <div className="w-64 h-[1px] bg-white/10 overflow-hidden relative">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-[#D4AF37]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "circOut" }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-[#050505] w-full">
            {/* Sticky Canvas Container */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-contain"
                />

                {/* Scroll Indicator */}
                <motion.div
                    style={{ opacity: indicatorOpacity }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-50 pointer-events-none"
                >
                    <span className="text-xs uppercase tracking-[0.2em] text-white/50">Scroll to Extract</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
                </motion.div>

                {/* Scrollytelling Overlays */}

                {/* Beat A */}
                <motion.div
                    style={{ opacity: opacityA, y: yA }}
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-6"
                >
                    <h1 className="text-7xl md:text-9xl font-light tracking-[0.15em] text-white/90 mb-4">BONZO</h1>
                    <p className="text-lg md:text-2xl font-light tracking-wide text-white/60">The alchemy of perfect extraction.</p>
                </motion.div>

                {/* Beat B */}
                <motion.div
                    style={{ opacity: opacityB, y: yB }}
                    className="absolute inset-0 flex flex-col justify-center items-start pointer-events-none px-12 md:px-32 lg:px-48"
                >
                    <h2 className="text-5xl md:text-7xl font-sans font-light tracking-tight text-white/90 mb-6 max-w-2xl">
                        PRECISION MILLED
                    </h2>
                    <p className="text-xl md:text-2xl font-light tracking-wide text-white/60">
                        Sourced globally. Ground to the exact micron.
                    </p>
                </motion.div>

                {/* Beat C */}
                <motion.div
                    style={{ opacity: opacityC, y: yC }}
                    className="absolute inset-0 flex flex-col justify-center items-end pointer-events-none px-12 md:px-32 lg:px-48 text-right"
                >
                    <h2 className="text-5xl md:text-7xl font-sans font-light tracking-tight text-white/90 mb-6 max-w-2xl">
                        9 BARS OF PRESSURE
                    </h2>
                    <p className="text-xl md:text-2xl font-light tracking-wide text-white/60">
                        Liquid gold coaxed from the dark.
                    </p>
                </motion.div>

                {/* Beat D */}
                <motion.div
                    style={{ opacity: opacityD, y: yD }}
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 text-center"
                >
                    <h2 className="text-5xl md:text-7xl font-sans font-light tracking-tight text-white/90 mb-8">
                        TASTE THE VOID
                    </h2>
                    <p className="text-xl md:text-2xl font-light tracking-wide text-white/60 mb-12">
                        Step into BONZO.
                    </p>
                    <div className="pointer-events-auto">
                        <button className="px-8 py-4 bg-transparent border border-[#D4AF37]/50 text-[#D4AF37] uppercase tracking-[0.2em] text-sm hover:bg-[#D4AF37]/10 transition-colors duration-500 rounded-sm">
                            Find Our Shop
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
