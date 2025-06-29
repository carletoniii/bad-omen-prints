import type {MetaFunction} from '@remix-run/node';

export const meta: MetaFunction = () => ([
  { title: 'About | Bad Omen Prints' },
  { name: 'description', content: "About Carleton Foster and Bad Omen Prints. Conceptual studio photography prints created on film. Bold, analog, and surreal." },
]);

export default function About() {
  return (
    <div className="about-page" style={{ maxWidth: 900, margin: '1rem auto', padding: '0.5rem' }}>
      <div
        style={{
          display: 'flex',
          gap: '2rem',
        }}
        className="about-columns"
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/images/carleton-iii-min.jpg"
            alt="Carleton Foster"
            style={{
              width: '100%',
              borderRadius: '1rem',
              objectFit: 'cover',
              height: 'auto',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              display: 'block',
            }}
          />
        </div>
        <div
          style={{
            flex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>about</h1>
          <p style={{ marginBottom: '1.5rem' }}>
            Hi, I&#39;m Carleton Foster. I&#39;m a film photographer focused on conceptual, studio-based work. My images explore mood, tension, and composition, with a love for analog process and detail.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            <strong>Bad Omen Prints</strong> is a curated storefront for my personal work. It&#39;s a small collection of images that I believe are worth living with. Each print is made to order using a high-quality print-on-demand service.
          </p>
          <p style={{ marginBottom: '2rem' }}>
            This site is fully custom. I designed and built it myself using Shopify&#39;s Hydrogen framework to create a minimal, modern experience focused on the work.
          </p>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>contact</h2>
          <p>
            Questions or just want to say hi?<br />
            Reach out at <a href="mailto:carletonfosteriii@gmail.com">carletonfosteriii@gmail.com</a>
          </p>
        </div>
      </div>
      <style>{`
        .about-columns {
          flex-direction: column;
        }
        .about-columns > div:first-child {
          max-width: 100%;
          margin-bottom: 0rem;
        }
        .about-columns > div:first-child img {
          max-width: 100%;
        }
        @media (min-width: 768px) {
          .about-columns {
            flex-direction: row;
          }
          .about-columns > div:first-child {
            max-width: 350px;
            margin-bottom: 0;
          }
          .about-columns > div:first-child img {
            max-width: 350px;
          }
        }
        .about-columns h1, .about-columns h2 {
          font-family: 'Audiowide', sans-serif;
        }
        .about-columns p {
          font-family: 'Exo 2', sans-serif;
        }
      `}</style>
    </div>
  );
} 