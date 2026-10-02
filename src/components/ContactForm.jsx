import { useState } from 'react';

const initialValues = { name: '', email: '', message: '' };

/**
 * ContactForm
 * -------------------------------------------------------------------------
 * Client-side validated contact form. Submission is stubbed — replace the
 * TODO in handleSubmit with a real request to your backend/email service
 * (e.g. Formspree, a serverless function, or your own API route).
 */
export default function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (v) => {
    const e = {};
    if (!v.name.trim()) e.name = 'Please tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Please enter a valid email address.';
    if (!v.message.trim() || v.message.trim().length < 10) e.message = 'Please add a little more detail (10+ characters).';
    return e;
  };

  const handleChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundErrors = validate(values);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) {
      const firstErrorField = document.querySelector('.field--error input, .field--error textarea');
      firstErrorField?.focus();
      return;
    }
    // TODO: replace with a real submission endpoint.
    setSubmitted(true);
    setValues(initialValues);
  };

  if (submitted) {
    return (
      <div className="form-success" role="status">
        <h3 className="gold-text">Message sent</h3>
        <p>Thank you for reaching out — a member of our client relations team will reply within one business day.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className={`field ${errors.name ? 'field--error' : ''}`}>
        <label htmlFor="name">Full name</label>
        <input id="name" type="text" value={values.name} onChange={handleChange('name')} autoComplete="name" />
        {errors.name && <p className="field__error">{errors.name}</p>}
      </div>

      <div className={`field ${errors.email ? 'field--error' : ''}`}>
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" value={values.email} onChange={handleChange('email')} autoComplete="email" />
        {errors.email && <p className="field__error">{errors.email}</p>}
      </div>

      <div className={`field ${errors.message ? 'field--error' : ''}`}>
        <label htmlFor="message">Message</label>
        <textarea id="message" rows={5} value={values.message} onChange={handleChange('message')} />
        {errors.message && <p className="field__error">{errors.message}</p>}
      </div>

      <button type="submit" className="btn btn--solid">
        Send message
      </button>
    </form>
  );
}
