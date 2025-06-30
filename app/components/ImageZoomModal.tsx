import {useEffect} from 'react';

export function ImageZoomModal({src, alt, open, onClose}: {src: string, alt?: string, open: boolean, onClose: () => void}) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-label="Zoomed product image"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.85)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <button
        type="button"
        aria-label="Close zoom background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'transparent',
          border: 'none',
          padding: 0,
          margin: 0,
          zIndex: 1999,
          cursor: 'default',
        }}
        onClick={onClose}
        onKeyDown={e => { if (e.key === 'Escape') onClose(); }}
        tabIndex={0}
      />
      <button
        type="button"
        aria-label="Close zoom"
        style={{
          position: 'fixed',
          top: 24,
          right: 32,
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '2rem',
          cursor: 'pointer',
          zIndex: 2100,
        }}
        onClick={onClose}
      >
        ×
      </button>
      <div
        role="presentation"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2001,
        }}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            background: '#fff',
          }}
        />
      </div>
    </div>
  );
} 