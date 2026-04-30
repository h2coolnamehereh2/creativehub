'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { FadeInUp, ScaleIn } from './ScrollAnimations';
import { fetchPhotos, type Photo } from '@/lib/api';

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPhotos() {
      const data = await fetchPhotos();
      setPhotos(data);
      setLoading(false);
    }
    loadPhotos();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) =>
          prev !== null ? (prev - 1 + photos.length) % photos.length : null
        );
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) =>
          prev !== null ? (prev + 1) % photos.length : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, photos.length]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedIndex]);

  const goToPrevious = () => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + photos.length) % photos.length : null
    );
  };

  const goToNext = () => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % photos.length : null
    );
  };

  return (
    <section id="portfolio" className="section-padding bg-dark-900">
      <div className="container-width">
        {/* Section Header */}
        <FadeInUp className="text-center mb-16">
          <span className="text-primary-400 font-medium text-sm uppercase tracking-wider">
            Нашата работа
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-dark-50 mt-4 mb-6">
            Галерия
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Разгледайте моменти, уловени от нашите сватбени фотосесии.
          </p>
        </FadeInUp>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] rounded-xl bg-dark-800 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <ScaleIn key={photo.id} delay={index * 0.05}>
                <motion.button
                  onClick={() => setSelectedIndex(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative aspect-[4/5] rounded-xl overflow-hidden group cursor-pointer w-full"
                >
                  <img
                    src={photo.url}
                    alt={photo.alt_text || 'Wedding photo'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-dark-100 text-sm font-medium">
                      Вижте снимката
                    </span>
                  </div>
                </motion.button>
              </ScaleIn>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && photos[selectedIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark-950/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 p-2 text-dark-400 hover:text-dark-100 transition-colors z-10"
              aria-label="Close"
            >
              <X size={32} />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 text-dark-400 text-sm">
              {selectedIndex + 1} / {photos.length}
            </div>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 p-2 text-dark-400 hover:text-dark-100 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={40} />
            </button>

            {/* Image */}
            <motion.img
              key={selectedIndex}
              src={photos[selectedIndex].url}
              alt={photos[selectedIndex].alt_text || 'Wedding photo'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 p-2 text-dark-400 hover:text-dark-100 transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={40} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
