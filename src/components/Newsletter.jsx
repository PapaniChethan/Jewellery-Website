import { useState } from 'react';

/**
 * Newsletter
 * -------------------------------------------------------------------------
 * Simple client-side-validated email capture. Submission is stubbed (no
 * backend wired up) — replace handleSubmit's TODO with a real API call to
 * your ESP (Klaviyo, Mailchimp, etc).
 */
export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | success | error

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setStatus('error');
      return;
    }
    // TODO: replace with a real newsletter API call.
    setStatus('success');
    setEmail('');
  };

  return (
    <div className="newsletter">
      <p className="label">Stay in the light</p>
      <h2>Join the Sri Ranganatha Jewellers circle</h2>
      <p>New collections, private previews and atelier stories — no more than twice a month.</p>
      <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
          required
        />
        <button type="submit">Subscribe</button>
      </form>
      <p className="newsletter-note" role="status">
        {status === 'success' && 'Thank you — please check your inbox to confirm.'}
        {status === 'error' && 'Please enter a valid email address.'}
        {status === 'idle' && 'By subscribing you agree to our Privacy Policy.'}
      </p>
    </div>
  );
}
