import {type FetcherWithComponents} from '@remix-run/react';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {useState} from 'react';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className="add-to-cart-btn font-audiowide"
            style={{
              background: disabled
                ? '#ccc'
                : hover
                ? '#fff'
                : '#111',
              color: disabled
                ? '#888'
                : hover
                ? '#111'
                : '#fff',
              border: '2px solid ' + (hover && !disabled ? '#111' : 'transparent'),
              borderRadius: '4px',
              padding: '0.5rem 1.25rem',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              letterSpacing: '0.05em',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, color 0.2s, border-color 0.2s',
              marginTop: '1rem',
              marginBottom: '1rem',
              textTransform: 'lowercase',
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}
