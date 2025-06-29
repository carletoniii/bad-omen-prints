import {useState, useEffect} from 'react';

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('cookieConsent')) {
      setVisible(true);
    }
  }, []);

  function setConsent(consent: boolean) {
    if (typeof window !== 'undefined' && window.Shopify && window.Shopify.customerPrivacy && typeof window.Shopify.customerPrivacy.setTrackingConsent === 'function') {
      window.Shopify.customerPrivacy.setTrackingConsent(consent, () => {
        localStorage.setItem('cookieConsent', consent ? 'accepted' : 'declined');
        setVisible(false);
      });
    } else {
      localStorage.setItem('cookieConsent', consent ? 'accepted' : 'declined');
      setVisible(false);
    }
  }

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: '#fff',
      padding: '1rem',
      boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
    }}>
      <span style={{fontFamily: 'Exo 2, sans-serif'}}>
        We use cookies to improve your experience. By using our site, you agree to our cookie policy.
      </span>
      <button
        onClick={() => setConsent(true)}
        style={{
          fontFamily: 'Audiowide, sans-serif',
          background: '#111',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          padding: '0.5rem 1.25rem',
          cursor: 'pointer',
        }}
      >
        Accept
      </button>
      <button
        onClick={() => setConsent(false)}
        style={{
          fontFamily: 'Audiowide, sans-serif',
          background: '#eee',
          color: '#111',
          border: 'none',
          borderRadius: '4px',
          padding: '0.5rem 1.25rem',
          cursor: 'pointer',
        }}
      >
        Decline
      </button>
    </div>
  );
} 