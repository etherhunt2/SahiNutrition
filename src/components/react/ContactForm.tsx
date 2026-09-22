import { useState, useRef } from 'react';

type GoalOption = 'weight-loss' | 'weight-gain';

interface FormData {
  name: string;
  email: string;
  phone: string;
  goal: GoalOption;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    goal: 'weight-loss',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate submission (replace with actual endpoint later)
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <section className="contact-form" id="contact">
        <div className="contact-form__container">
          <div className="contact-form__success">
            <div className="contact-form__success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 className="contact-form__success-title">You're One Step Closer!</h3>
            <p className="contact-form__success-text">
              Thank you, <strong>{formData.name}</strong>! We've received your details. 
              Our team will reach out to you within 24 hours to start planning your 
              transformation journey.
            </p>
            <p className="contact-form__success-hint">
              Check your email ({formData.email}) for a confirmation.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="contact-form" id="contact">
      <div className="contact-form__container">
        <div className="contact-form__content">
          <div className="contact-form__info">
            <span className="contact-form__label">Take The First Step</span>
            <h2 className="contact-form__title">
              Let's Start Your <span className="contact-form__gradient">Transformation</span>
            </h2>
            <p className="contact-form__text">
              Fill in your details and we'll reach out with a personalized action plan 
              — completely free, no strings attached.
            </p>

            <ul className="contact-form__benefits">
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 12 2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                Free initial consultation
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 12 2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                Personalized assessment
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 12 2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                No obligation to continue
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 12 2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                Response within 24 hours
              </li>
            </ul>
          </div>

          <form ref={formRef} className="contact-form__form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form__field">
              <label htmlFor="contact-name">Full Name</label>
              <input
                id="contact-name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="contact-form__error">{errors.name}</span>}
            </div>

            <div className="contact-form__field">
              <label htmlFor="contact-email">Email Address</label>
              <input
                id="contact-email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="contact-form__error">{errors.email}</span>}
            </div>

            <div className="contact-form__field">
              <label htmlFor="contact-phone">Phone / WhatsApp</label>
              <input
                id="contact-phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="contact-form__error">{errors.phone}</span>}
            </div>

            <div className="contact-form__field">
              <label>Primary Goal</label>
              <div className="contact-form__goal-options">
                <label className={`contact-form__goal-option ${formData.goal === 'weight-loss' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="goal"
                    value="weight-loss"
                    checked={formData.goal === 'weight-loss'}
                    onChange={() => handleChange('goal', 'weight-loss')}
                  />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 15l-6-6-6 6"/>
                  </svg>
                  Weight Loss
                </label>
                <label className={`contact-form__goal-option ${formData.goal === 'weight-gain' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="goal"
                    value="weight-gain"
                    checked={formData.goal === 'weight-gain'}
                    onChange={() => handleChange('goal', 'weight-gain')}
                  />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Weight Gain
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="contact-form__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="contact-form__spinner"></span>
                  Submitting...
                </>
              ) : (
                <>
                  Start My Transformation
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
