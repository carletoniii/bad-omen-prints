import type {ProductVariantFragment} from 'storefrontapi.generated';
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
          width: '100%',
        }}
        onClick={() => setZoomOpen(true)}
        aria-label="Zoom product image"
      >
        <img
          src={image.url}
          alt={image.altText || 'Product Image'}
          style={{ width: '100%' }}
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
