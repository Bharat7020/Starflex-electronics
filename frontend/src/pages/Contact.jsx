import { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (form.message.trim().length < 20) errs.message = 'Message must be at least 20 characters';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <main className="page-wrapper page-enter">
      <div className="container contact-page">
        {/* Header */}
        <div className="contact-header">
          <div className="section-header">
            <p className="overline">Get in Touch</p>
            <h1 className="h1">We'd love to <span className="text-gradient">hear from you</span></h1>
            <p className="text-muted">
              Have a question, need support, or want to explore a partnership? We're here to help.
            </p>
          </div>
        </div>

        <div className="contact-layout">
          {/* Info Cards */}
          <div className="contact-info">
            {[
              {
                icon: '📍',
                title: 'Our Office',
                lines: ['StarFlex Tower, Hinjewadi', 'Pune, Maharashtra 411057', 'India'],
              },
              {
                icon: '📧',
                title: 'Email Us',
                lines: ['hello@starflex.com', 'support@starflex.com'],
              },
              {
                icon: '📞',
                title: 'Call Us',
                lines: ['+91 (800) STARFLEX', 'Mon–Fri, 9AM–6PM IST'],
              },
              {
                icon: '⏰',
                title: 'Support Hours',
                lines: ['Monday–Friday: 9AM–6PM', 'Saturday: 10AM–4PM', 'Sunday: Closed'],
              },
            ].map(card => (
              <div key={card.title} className="contact-info-card glass-card">
                <span className="contact-info-icon">{card.icon}</span>
                <div>
                  <h3 className="contact-info-title">{card.title}</h3>
                  {card.lines.map(line => (
                    <p key={line} className="contact-info-line">{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="contact-social">
              <h3 className="contact-info-title">Follow Us</h3>
              <div className="contact-social-links">
                {[
                  { label: 'Twitter/X', icon: '𝕏', color: '#000' },
                  { label: 'Instagram', icon: '📸', color: '#e1306c' },
                  { label: 'LinkedIn', icon: 'in', color: '#0077b5' },
                  { label: 'YouTube', icon: '▶', color: '#ff0000' },
                ].map(s => (
                  <a key={s.label} href="#" className="contact-social-btn" aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-wrap">
            {submitted ? (
              <div class="contact-success glass-card">
                <span className="contact-success-icon">✉️</span>
                <h2>Message Sent!</h2>
                <p>Thanks for reaching out! We'll get back to you within 24 hours.</p>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                className="contact-form glass-card"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Contact form"
              >
                <h2 className="h3" style={{ marginBottom: '8px' }}>Send a Message</h2>
                <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '8px' }}>
                  Fill out the form below and we'll respond as soon as possible.
                </p>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      id="name" name="name" type="text" value={form.name}
                      onChange={handleChange} placeholder="John Doe"
                      className={`form-control ${errors.name ? 'error' : ''}`}
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && <span id="name-error" className="form-error">⚠ {errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email" className="form-label">Email Address</label>
                    <input
                      id="contact-email" name="email" type="email" value={form.email}
                      onChange={handleChange} placeholder="john@example.com"
                      className={`form-control ${errors.email ? 'error' : ''}`}
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    />
                    {errors.email && <span id="contact-email-error" className="form-error">⚠ {errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <select
                    id="subject" name="subject" value={form.subject}
                    onChange={handleChange}
                    className={`form-control ${errors.subject ? 'error' : ''}`}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                  >
                    <option value="">Select a subject...</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="order">Order Issue</option>
                    <option value="returns">Returns & Exchanges</option>
                    <option value="partnership">Partnership / Business</option>
                    <option value="feedback">Feedback</option>
                  </select>
                  {errors.subject && <span id="subject-error" className="form-error">⚠ {errors.subject}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                      {' '}({form.message.length}/500)
                    </span>
                  </label>
                  <textarea
                    id="message" name="message" value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className={`form-control ${errors.message ? 'error' : ''}`}
                    rows={5}
                    maxLength={500}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    style={{ resize: 'vertical' }}
                  />
                  {errors.message && <span id="message-error" className="form-error">⚠ {errors.message}</span>}
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  {loading ? '⏳ Sending...' : '✉️ Send Message'}
                </button>

                <p className="contact-privacy">
                  We respect your privacy. Your information will never be shared with third parties.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
