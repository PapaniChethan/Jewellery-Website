import SectionReveal from '../components/SectionReveal.jsx';
import ContactForm from '../components/ContactForm.jsx';

/**
 * Contact
 * -------------------------------------------------------------------------
 * Contact form + store info + embedded map.
 */
const mapQuery = encodeURIComponent('Gandhi Chowk, Khammam, Telangana 507001, India');

export default function Contact() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="label">Get in Touch</p>
          <h1>We'd love to hear from you.</h1>
          <p>
            Whether you're commissioning a custom piece, need help with sizing, or
            just want to say hello — our client relations team replies within one
            business day.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap contact-grid">
          <SectionReveal as="div" direction="up">
            <ContactForm />
          </SectionReveal>

          <SectionReveal as="div" className="contact-info" direction="up" delay={0.1}>
            <dl>
              <div>
                <dt>Flagship Boutique</dt>
                <dd>Gandhi Chowk, Khammam, Telangana 507001, India</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>+91 84989 45326</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>sriranganathajewellers@gmail.com</dd>
              </div>
            </dl>

            {/* TODO: replace "#" with the shop's Instagram and Facebook page URLs. */}
            <div className="social" aria-label="Social media">
              <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4.2" />
                  <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
                </svg>
              </a>
            </div>

            <iframe
              className="map-embed"
              style={{ width: '100%', marginTop: '2.5rem', border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Boutique location map"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            />
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
