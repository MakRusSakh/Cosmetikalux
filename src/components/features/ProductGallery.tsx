'use client'

import Image from 'next/image'
import { useState, useCallback, useRef } from 'react'

interface ProductGalleryProps {
  images: string[]
  alt: string
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [isZoomed, setIsZoomed] = useState(false)
  const touchStartX = useRef(0)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
    setIsZoomed(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const delta = e.changedTouches[0].clientX - touchStartX.current
      if (Math.abs(delta) < 50) return
      setActiveIndex((prev) => {
        if (delta < 0) return Math.min(prev + 1, images.length - 1)
        return Math.max(prev - 1, 0)
      })
    },
    [images.length],
  )

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/5] flex items-center justify-center rounded-[var(--radius-md)] bg-bg-secondary text-text-tertiary">
        Нет фото
      </div>
    )
  }

  return (
    <div>
      {/* Main image */}
      <div
        className="aspect-[4/5] relative overflow-hidden rounded-[var(--radius-md)] bg-bg-secondary cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[activeIndex]}
          alt={`${alt} — фото ${activeIndex + 1}`}
          fill
          className="object-contain transition-transform duration-300 ease-out"
          style={{
            transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={activeIndex === 0}
        />
      </div>

      {/* Thumbnails — desktop */}
      {images.length > 1 && (
        <div className="mt-3 hidden gap-2 md:flex">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative h-20 w-16 overflow-hidden rounded-[var(--radius-sm)] border-2 transition-colors ${
                i === activeIndex
                  ? 'border-accent-primary'
                  : 'border-border-light hover:border-accent-light'
              }`}
            >
              <Image
                src={src}
                alt={`${alt} — миниатюра ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dot indicators — mobile */}
      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-2 md:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Фото ${i + 1}`}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all ${
                i === activeIndex
                  ? 'h-2.5 w-2.5 bg-accent-primary'
                  : 'h-2 w-2 bg-border-medium'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
