import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';
import {useState} from 'react';
import {ImageZoomModal} from './ImageZoomModal';

export function ProductImage({
  image,
  mainImage,
}: {
  image: ProductVariantFragment['image'];
  mainImage?: ProductVariantFragment['image'];
}) {
  const [zoomOpen, setZoomOpen] = useState(false);
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className="product-image">
      <button
        type="button"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          display: 'block',
        }}
        onClick={() => setZoomOpen(true)}
        aria-label="Zoom product image"
      >
        <Image
          alt={image.altText || 'Product Image'}
          aspectRatio="1/1"
          data={image}
          key={image.id}
          sizes="(min-width: 45em) 50vw, 100vw"
        />
      </button>
      <ImageZoomModal
        src={mainImage?.url || image.url}
        alt={mainImage?.altText || image.altText || 'Product Image'}
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
      />
    </div>
  );
}
