import { useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/**
 * Fullscreen lightbox.
 * Props: images [{src, alt}], current (index), onClose, onPrev, onNext, onGoTo
 * Supports: keyboard arrows, click outside, touch swipe left/right
 */
const Lightbox = ({ images, current, onClose, onPrev, onNext, onGoTo }) => {
  const touchStartX = useRef(null);

  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  /* Touch swipe handlers */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;   // ignore tiny movements
    if (delta < 0) onNext();            // swipe left  → next
    else           onPrev();            // swipe right → prev
  };

  const img = images[current];
  if (!img) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
      >
        <X size={22} />
      </button>

      {/* Counter */}
      <p className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white">
        {current + 1} / {images.length}
      </p>

      {/* Prev */}
      {images.length > 1 && (
        <button
          type="button"
          aria-label="Image précédente"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Image */}
      <img
        src={img.src}
        alt={img.alt || `Image ${current + 1} sur ${images.length}`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
        loading="eager"
        draggable={false}
      />

      {/* Next */}
      {images.length > 1 && (
        <button
          type="button"
          aria-label="Image suivante"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 flex max-w-[90vw] -translate-x-1/2 gap-2 overflow-x-auto">
          {images.map((im, i) => (
            <button
              key={im.src}
              type="button"
              aria-label={`Voir image ${i + 1}`}
              onClick={(e) => { e.stopPropagation(); onGoTo(i); }}
              className={`h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === current ? "border-bronze" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={im.src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lightbox;
