import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function DetailPopup({ pos, onClose, children }) {
  const ref = useRef();

  // Clamp position to viewport after render
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const { width, height } = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 12;

    let left = pos.x;
    let top = pos.y + 12; // slightly below click

    // Flip above if too close to bottom
    if (top + height > vh - margin) top = pos.y - height - 8;
    // Clamp horizontally
    if (left + width > vw - margin) left = vw - width - margin;
    if (left < margin) left = margin;
    // Clamp vertically
    if (top < margin) top = margin;

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }, [pos]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="md:hidden fixed z-50 border border-border rounded-lg bg-card shadow-xl w-64"
      style={{ left: pos.x, top: pos.y }} // will be overridden by effect
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      {children}
    </div>
  );
}