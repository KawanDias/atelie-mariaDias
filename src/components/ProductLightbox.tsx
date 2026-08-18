'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ProductLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (index: number) => void;
}

export function ProductLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onSelectImage,
}: ProductLightboxProps) {
  const [mounted, setMounted] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bloqueia o scroll da página enquanto o lightbox estiver aberto
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !images?.length) return;

      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'ArrowRight') {
        onSelectImage((currentIndex + 1) % images.length);
      }

      if (e.key === 'ArrowLeft') {
        onSelectImage((currentIndex - 1 + images.length) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, images?.length, onClose, onSelectImage]);

  if (!isOpen || !images || images.length === 0 || !mounted) {
    return null;
  }

  const nextImage = () => {
    onSelectImage((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    onSelectImage((currentIndex - 1 + images.length) % images.length);
  };

  const currentImg = images[currentIndex] || '';

  const isUrl =
    typeof currentImg === 'string' &&
    (currentImg.startsWith('http') || currentImg.startsWith('data:'));

  // ============================================================
  // SWIPE MOBILE
  // ============================================================

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;

    const distance = touchStartX - touchEndX;
    const minimumSwipeDistance = 50;

    if (Math.abs(distance) < minimumSwipeDistance) return;

    if (distance > 0) {
      nextImage();
    } else {
      prevImage();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const lightboxContent = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 99999,

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        padding: 'clamp(12px, 3vw, 24px)',
        boxSizing: 'border-box',

        overflow: 'hidden',
        touchAction: 'none',
      }}
    >
      {/* ======================================================
          BOTÃO FECHAR
      ======================================================= */}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          position: 'absolute',
          top: 'clamp(12px, 3vw, 24px)',
          right: 'clamp(12px, 3vw, 24px)',

          width: '44px',
          height: '44px',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          background: 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',

          color: '#ffffff',
          fontSize: '22px',
          lineHeight: 1,

          cursor: 'pointer',
          zIndex: 100001,

          padding: 0,

          WebkitTapHighlightColor: 'transparent',
        }}
        aria-label="Fechar galeria"
      >
        ×
      </button>

      {/* ======================================================
          CONTADOR
      ======================================================= */}

      <div
        style={{
          position: 'absolute',
          top: 'clamp(14px, 3vw, 25px)',
          left: 'clamp(14px, 3vw, 25px)',

          color: '#ffffff',
          fontSize: 'clamp(12px, 2vw, 14px)',
          fontWeight: 500,

          background: 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.12)',

          padding: '7px 12px',
          borderRadius: '20px',

          zIndex: 100001,

          whiteSpace: 'nowrap',
        }}
      >
        {currentIndex + 1} / {images.length}
      </div>

      {/* ======================================================
          ÁREA PRINCIPAL
      ======================================================= */}

      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',

          width: '100%',
          height: '100%',

          maxWidth: '1400px',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          padding:
            'clamp(50px, 8vh, 80px) clamp(8px, 6vw, 90px)',

          boxSizing: 'border-box',

          touchAction: 'pan-y',
        }}
      >
        {/* ==================================================
            SETA ANTERIOR
        =================================================== */}

        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="Imagem anterior"
            style={{
              position: 'absolute',

              left: 'clamp(8px, 2vw, 24px)',

              top: '50%',
              transform: 'translateY(-50%)',

              width: 'clamp(42px, 5vw, 52px)',
              height: 'clamp(42px, 5vw, 52px)',

              background: 'rgba(255, 255, 255, 0.16)',
              border: '1px solid rgba(255, 255, 255, 0.15)',

              color: '#ffffff',

              fontSize: 'clamp(17px, 2vw, 22px)',

              borderRadius: '50%',

              cursor: 'pointer',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              zIndex: 100000,

              padding: 0,

              WebkitTapHighlightColor: 'transparent',

              transition:
                'background-color 0.2s ease, transform 0.2s ease',
            }}
          >
            ❮
          </button>
        )}

        {/* ==================================================
            IMAGEM
        =================================================== */}

        {isUrl ? (
          <img
            src={currentImg}
            alt={`Imagem ${currentIndex + 1}`}
            draggable={false}
            style={{
              display: 'block',

              width: 'auto',
              height: 'auto',

              maxWidth: '100%',
              maxHeight: '100%',

              objectFit: 'contain',

              borderRadius: 'clamp(8px, 1.5vw, 16px)',

              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',

              userSelect: 'none',
              WebkitUserSelect: 'none',

              pointerEvents: 'none',
            }}
          />
        ) : (
          <div
            style={{
              fontSize: 'clamp(4rem, 15vw, 8rem)',
              lineHeight: 1,
            }}
          >
            {currentImg}
          </div>
        )}

        {/* ==================================================
            SETA PRÓXIMA
        =================================================== */}

        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Próxima imagem"
            style={{
              position: 'absolute',

              right: 'clamp(8px, 2vw, 24px)',

              top: '50%',
              transform: 'translateY(-50%)',

              width: 'clamp(42px, 5vw, 52px)',
              height: 'clamp(42px, 5vw, 52px)',

              background: 'rgba(255, 255, 255, 0.16)',
              border: '1px solid rgba(255, 255, 255, 0.15)',

              color: '#ffffff',

              fontSize: 'clamp(17px, 2vw, 22px)',

              borderRadius: '50%',

              cursor: 'pointer',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              zIndex: 100000,

              padding: 0,

              WebkitTapHighlightColor: 'transparent',

              transition:
                'background-color 0.2s ease, transform 0.2s ease',
            }}
          >
            ❯
          </button>
        )}
      </div>

      {/* ======================================================
          INDICADOR MOBILE
      ======================================================= */}

      {images.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(14px, 3vw, 24px)',

            left: '50%',
            transform: 'translateX(-50%)',

            color: 'rgba(255, 255, 255, 0.7)',

            fontSize: '12px',

            padding: '6px 10px',

            borderRadius: '20px',

            background: 'rgba(0, 0, 0, 0.25)',

            pointerEvents: 'none',

            whiteSpace: 'nowrap',
          }}
        >
          Deslize para navegar
        </div>
      )}
    </div>
  );

  return createPortal(lightboxContent, document.body);
}

export default ProductLightbox;