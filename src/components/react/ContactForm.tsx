import { useState, useRef } from 'react';
import { useLang } from '../../i18n/useLang';
import { translations } from '../../i18n/translations';

type GoalOption = 'weight-loss' | 'weight-gain';

interface FormData {
  name: string;
  email: string;
  phone: string;
  goal: GoalOption;
}

export default function ContactForm() {
  const lang = useLang();
  const tr = translations.contactForm;
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

    if (!formData.name.trim()) newErrors.name = tr.errorNameRequired[lang];
    if (!formData.email.trim()) {
      newErrors.email = tr.errorEmailRequired[lang];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = tr.errorEmailInvalid[lang];
    }
    if (!formData.phone.trim()) {
      newErrors.phone = tr.errorPhoneRequired[lang];
    } else if (!/^[+]?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = tr.errorPhoneInvalid[lang];
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
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="contact-form__success-title">{tr.successTitle[lang]}</h3>
            <p className="contact-form__success-text" dangerouslySetInnerHTML={{ __html: tr.successText[lang].replace('{name}', formData.name) }} />
            <p className="contact-form__success-hint">
              {tr.successHint[lang].replace('{email}', formData.email)}
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
            <span className="contact-form__label">{tr.label[lang]}</span>
            <h2 className="contact-form__title">
              {tr.title[lang]} <span className="contact-form__gradient">{tr.titleHighlight[lang]}</span>
            </h2>
            <p className="contact-form__text">
              {tr.text[lang]}
            </p>

            <ul className="contact-form__benefits">
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 12 2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                {tr.benefit1[lang]}
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 12 2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                {tr.benefit2[lang]}
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 12 2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                {tr.benefit3[lang]}
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 12 2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                {tr.benefit4[lang]}
              </li>
            </ul>
          </div>

          <form ref={formRef} className="contact-form__form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form__field">
              <label htmlFor="contact-name">{tr.fullName[lang]}</label>
              <input
                id="contact-name"
                type="text"
                placeholder={tr.namePlaceholder[lang]}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="contact-form__error">{errors.name}</span>}
            </div>

            <div className="contact-form__field">
              <label htmlFor="contact-email">{tr.email[lang]}</label>
              <input
                id="contact-email"
                type="email"
                placeholder={tr.emailPlaceholder[lang]}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="contact-form__error">{errors.email}</span>}
            </div>

            <div className="contact-form__field">
              <label htmlFor="contact-phone">{tr.phone[lang]}</label>
              <input
                id="contact-phone"
                type="tel"
                placeholder={tr.phonePlaceholder[lang]}
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="contact-form__error">{errors.phone}</span>}
            </div>

            <div className="contact-form__field">
              <label>{tr.primaryGoal[lang]}</label>
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
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                  {tr.weightLoss[lang]}
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
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  {tr.weightGain[lang]}
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
                  {tr.submitting[lang]}
                </>
              ) : (
                <>
                  {tr.submitBtn[lang]}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
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
