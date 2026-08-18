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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    } else if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images?.length]);

  if (!isOpen || !images || images.length === 0 || !mounted) return null;

  const nextImage = () => {
    onSelectImage((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    onSelectImage((currentIndex - 1 + images.length) % images.length);
  };

  const currentImg = images[currentIndex] || '';
  const isUrl = typeof currentImg === 'string' && (currentImg.startsWith('http') || currentImg.startsWith('data:'));

  const lightboxContent = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        boxSizing: 'border-box',
      }}
    >
      {/* Botão de Fechar */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '25px',
          background: 'transparent',
          border: 'none',
          color: '#ffffff',
          fontSize: '2.2rem',
          cursor: 'pointer',
          zIndex: 100000,
          lineHeight: 1,
        }}
        aria-label="Fechar galeria"
      >
        ✕
      </button>

      {/* Contador de Fotos */}
      <div
        style={{
          position: 'absolute',
          top: '25px',
          left: '25px',
          color: '#ffffff',
          fontSize: '1rem',
          fontWeight: 500,
          background: 'rgba(255, 255, 255, 0.15)',
          padding: '0.4rem 0.8rem',
          borderRadius: '20px',
        }}
      >
        {currentIndex + 1} / {images.length}
      </div>

      {/* Imagem do Produto e Botões de Navegação */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '85vw',
          maxHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Seta Anterior */}
        {images.length > 1 && (
          <button
            onClick={prevImage}
            style={{
              position: 'absolute',
              left: '-60px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#ffffff',
              fontSize: '1.5rem',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100000,
            }}
          >
            ❮
          </button>
        )}

        {/* Imagem Expandida */}
        {isUrl ? (
          <img
            src={currentImg}
            alt={`Imagem ${currentIndex + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}
          />
        ) : (
          <div style={{ fontSize: '8rem' }}>{currentImg}</div>
        )}

        {/* Seta Próximo */}
        {images.length > 1 && (
          <button
            onClick={nextImage}
            style={{
              position: 'absolute',
              right: '-60px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#ffffff',
              fontSize: '1.5rem',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100000,
            }}
          >
            ❯
          </button>
        )}
      </div>
    </div>
  );

  return createPortal(lightboxContent, document.body);
}

export default ProductLightbox;