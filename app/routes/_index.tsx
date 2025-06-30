import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';

export const meta: MetaFunction = () => {
  return [
    { title: 'Bad Omen Prints | Film Photography Prints' },
    { name: 'description', content: 'Conceptual studio photography prints created on film. Bold, analog, and surreal.' },
    { property: 'og:title', content: 'Bad Omen Prints | Film Photography Prints' },
    { property: 'og:description', content: 'Conceptual studio photography prints created on film. Bold, analog, and surreal.' },
    { property: 'og:image', content: '/images/SEO-image-min.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <picture>
        <source
          srcSet="/images/Hero-Image-Mobile-min.jpg"
          media="(max-width: 600px)"
        />
        <source
          srcSet="/images/Hero-Image-Tablet-min.jpg"
          media="(max-width: 1024px)"
        />
        <img
          src="/images/site-banner-2-min.jpg"
          alt="Bad Omen Prints hero banner"
          className="hero-image"
          style={{ width: '100%', objectFit: 'cover', display: 'block', marginBottom: '1rem' }}
        />
      </picture>
      <div
        className="homepage-description"
        style={{
          maxWidth: '600px',
          margin: '3rem auto 3rem auto',
          padding: '1.25rem',
          background: 'transparent',
          borderRadius: '1rem',
          textAlign: 'center',
        }}
      >
        <p className="font-exo2" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
          Bad Omen Prints is a curated collection of original film photographs. The work is studio-based and conceptual, with a focus on color, mood, and form. Each image is shot on 35mm or medium format film and printed on demand using high-quality materials.
        </p>
      </div>
      <RecommendedProducts products={data.recommendedProducts} />
      <form
        action="https://badomenprints.us5.list-manage.com/subscribe/post?u=c00223fba3df379d40621326e&id=f333b71ec1"
        method="POST"
        target="_blank"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          margin: '2.5rem auto 2.5rem auto',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <label htmlFor="mc-email" className="font-exo2" style={{ fontWeight: 400, fontSize: '1rem', color: '#444', marginBottom: '0.25rem' }}>
          sign up to get notified when we drop new prints
        </label>
        <div
          style={{
            display: 'flex',
            width: '100%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          <input
            type="email"
            name="EMAIL"
            id="mc-email"
            required
            placeholder="your@email.com"
            className="font-exo2"
            style={{
              flex: 1,
              border: 'none',
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              borderRadius: '0.5rem 0 0 0.5rem',
              outline: 'none',
              background: 'transparent',
            }}
          />
          <button
            type="submit"
            className="font-audiowide"
            style={{
              border: 'none',
              background: 'black',
              color: 'white',
              fontWeight: 700,
              fontFamily: 'Audiowide, sans-serif',
              padding: '0 1.5rem',
              fontSize: '1rem',
              borderRadius: '0 0.5rem 0.5rem 0',
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.1s',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.transform = 'scale(1.04)'; }}
            onFocus={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'black'; e.currentTarget.style.transform = 'scale(1)'; }}
            onBlur={e => { e.currentTarget.style.background = 'black'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            sign up
          </button>
        </div>
        <style>{`
          @media (max-width: 600px) {
            form[action*='list-manage'] > div {
              flex-direction: column;
              box-shadow: none;
              background: none;
              gap: 0.5rem;
            }
            form[action*='list-manage'] input {
              border-radius: 0.5rem;
              width: 100%;
            }
            form[action*='list-manage'] button {
              border-radius: 0.5rem;
              width: 100%;
              height: 44px;
            }
          }
        `}</style>
      </form>
    </div>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products" style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '70vw', marginLeft: 'auto', marginRight: 'auto' }}>
      <h2 className="font-audiowide lowercase">Featured Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div
              className="recommended-products-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: '2rem',
                justifyItems: 'center',
                margin: '0 auto',
                maxWidth: '1200px',
              }}
            >
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <style>{`
        @media (min-width: 900px) {
          .recommended-products-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
