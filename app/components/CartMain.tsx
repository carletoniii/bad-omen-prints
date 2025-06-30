import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const className = `cart-main${cartHasItems ? '' : ' cart-empty'}${withDiscount ? ' with-discount' : ''}`;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details">
        <div
          aria-labelledby="cart-lines"
          className="cart-lines-scrollable"
        >
          <ul>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div hidden={hidden} style={{ textAlign: 'center' }}>
      <br />
      <p className="font-exo2">
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link to="/prints" onClick={close} prefetch="viewport" style={{ textDecoration: 'none' }}>
        <button
          className="font-audiowide lowercase"
          style={{
            background: '#111',
            color: '#fff',
            border: '2px solid transparent',
            borderRadius: '4px',
            padding: '0.5rem 1.25rem',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s, border-color 0.2s',
            marginTop: '1rem',
            marginBottom: '1rem',
            textTransform: 'lowercase',
            width: '100%',
            maxWidth: '320px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#fff', e.currentTarget.style.color = '#111', e.currentTarget.style.border = '2px solid #111')}
          onMouseLeave={e => (e.currentTarget.style.background = '#111', e.currentTarget.style.color = '#fff', e.currentTarget.style.border = '2px solid transparent')}
        >
          continue shopping
        </button>
      </Link>
    </div>
  );
}
