import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => ([
  { title: 'Delivery & Returns | Bad Omen Prints' },
  { name: 'description', content: 'Information about delivery, shipping, and returns for Bad Omen Prints. Made-to-order film photography prints, shipping details, and return policy.' },
]);

export default function DeliveryReturns() {
  return (
    <div className="delivery-returns-page" style={{ maxWidth: 900, margin: '1rem auto', padding: '0.5rem' }}>
      <div className="delivery-returns-columns">
        <h1>Delivery & Returns</h1>
        <h2>Made to Order</h2>
        <p>All prints are made just for you. Once you place an order, it goes straight into production.</p>
        <p><strong>Please allow:</strong></p>
        <ul>
          <li>2–5 business days for production</li>
          <li>5–8 business days for shipping within the U.S.</li>
        </ul>
        <p>You&#39;ll receive a tracking link by email as soon as your order ships.</p>
        <h2>Shipping</h2>
        <p>We currently ship only within the United States.</p>
        <p><strong>Shipping is calculated at checkout based on print size:</strong></p>
        <ul>
          <li>Small prints (8×10 up to 18×24): $4.99 flat rate</li>
          <li>Large print (20×30): $7.99 flat rate</li>
        </ul>
        <p>Orders ship from a U.S.-based fulfillment center.</p>
        <h2>Returns & Replacements</h2>
        <p>Because each print is made to order, we don&#39;t accept returns or exchanges for preferences like size or color.</p>
        <p>If your order arrives damaged, misprinted, or defective, we&#39;ll work with our print partner to make it right:</p>
        <ul>
          <li>Email <a href="mailto:carletonfosteriii@gmail.com">carletonfosteriii@gmail.com</a> within 30 days of delivery</li>
          <li>Include your order number and a clear photo of the issue</li>
          <li>If the problem is confirmed, we&#39;ll send a free replacement or issue a refund—at no cost to you</li>
        </ul>
        <p>Returned packages are processed through our fulfillment partner. If a shipment is returned due to an incorrect or undeliverable address, you&#39;ll be responsible for the cost of reshipping once a corrected address is provided.</p>
        <h2>Questions</h2>
        <p>If you have any concerns, feel free to reach out. We&#39;re a small operation, but we care a lot.</p>
      </div>
      <style>{`
        .delivery-returns-columns h1, .delivery-returns-columns h2 {
          font-family: 'Audiowide', sans-serif;
        }
        .delivery-returns-columns p, .delivery-returns-columns ul, .delivery-returns-columns li {
          font-family: 'Exo 2', sans-serif;
          line-height: 1.7;
        }
        .delivery-returns-columns h1 {
          font-size: 2rem;
          margin-bottom: 2rem;
        }
        .delivery-returns-columns h2 {
          font-size: 1.25rem;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .delivery-returns-columns p {
          margin-bottom: 1rem;
        }
        .delivery-returns-columns ul {
          margin-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .delivery-returns-columns li {
          margin-bottom: 0.5rem;
        }
        .delivery-returns-columns strong {
          font-weight: bold;
        }
        .delivery-returns-columns a {
          color: #111;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
} 