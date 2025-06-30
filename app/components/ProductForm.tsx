import {Link, useNavigate} from '@remix-run/react';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';
import {useState} from 'react';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  // Track hover state for each option value by key
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div className="product-form">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <h5>{option.name}</h5>
            <div className="product-options-grid">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;
                const key = option.name + name;
                if (isDifferentProduct) {
                  // SEO
                  // When the variant is a combined listing child product
                  // that leads to a different url, we need to render it
                  // as an anchor tag
                  return (
                    <Link
                      className="product-options-item"
                      key={key}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{
                        border: '2px solid ' + (selected ? '#111' : hovered === key && available ? '#111' : '#888'),
                        background: selected
                          ? '#111'
                          : hovered === key && available
                          ? '#f3f3f3'
                          : '#fff',
                        color: selected ? '#fff' : '#111',
                        opacity: available ? 1 : 0.3,
                        borderRadius: '6px',
                        padding: '0.4rem 1.1rem',
                        fontFamily: 'Exo 2, sans-serif',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: available ? 'pointer' : 'not-allowed',
                        marginRight: '0.5rem',
                        marginBottom: '0.5rem',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={() => setHovered(key)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  // SEO
                  // When the variant is an update to the search param,
                  // render it as a button with javascript navigating to
                  // the variant so that SEO bots do not index these as
                  // duplicated links
                  return (
                    <button
                      type="button"
                      className={`product-options-item${
                        exists && !selected ? ' link' : ''
                      }`}
                      key={key}
                      style={{
                        border: '2px solid ' + (selected
                          ? '#111'
                          : hovered === key && available
                          ? '#777'
                          : '#888'),
                        background: selected
                          ? '#111'
                          : hovered === key && available
                          ? '#777'
                          : '#fff',
                        color: selected
                          ? '#fff'
                          : hovered === key && available
                          ? '#fff'
                          : '#111',
                        opacity: available ? 1 : 0.3,
                        borderRadius: '6px',
                        padding: '0.4rem 1.1rem',
                        fontFamily: 'Exo 2, sans-serif',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: available ? 'pointer' : 'not-allowed',
                        marginRight: '0.5rem',
                        marginBottom: '0.5rem',
                        transition: 'all 0.15s',
                        textDecoration: 'none',
                      }}
                      disabled={!exists}
                      onMouseEnter={() => setHovered(key)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => {
                        if (!selected) {
                          navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
            <br />
          </div>
        );
      })}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}
