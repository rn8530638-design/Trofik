'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ContactsBrief.module.css';

export default function ContactsBriefForm({ copy, phoneHref }) {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [comment, setComment] = useState('');
  const [service, setService] = useState('');
  const [isServiceListOpen, setIsServiceListOpen] = useState(false);
  const servicePickerRef = useRef(null);

  useEffect(() => {
    const fillPromotionComment = (promotion) => {
      if (!promotion?.title) return;
      const description = promotion.description ? ` ${promotion.description}` : '';
      setComment(`${copy.promotionCommentPrefix} «${promotion.title}».${description}`);
    };

    const fillSelectedService = (selectedService) => {
      if (selectedService) setService(selectedService);
    };

    try {
      const savedPromotion = window.sessionStorage.getItem('selected-promotion');
      if (savedPromotion) {
        fillPromotionComment(JSON.parse(savedPromotion));
        window.sessionStorage.removeItem('selected-promotion');
      }
      const savedService = window.sessionStorage.getItem('selected-service');
      if (savedService) {
        fillSelectedService(savedService);
        window.sessionStorage.removeItem('selected-service');
      }
    } catch {
      // If session storage is unavailable, the event below still fills the field.
    }

    const handlePromotionSelected = (event) => {
      fillPromotionComment(event.detail);
      window.sessionStorage.removeItem('selected-promotion');
    };

    const handleServiceSelected = (event) => fillSelectedService(event.detail);

    window.addEventListener('promotion-selected', handlePromotionSelected);
    window.addEventListener('catalog-service-selected', handleServiceSelected);
    return () => {
      window.removeEventListener('promotion-selected', handlePromotionSelected);
      window.removeEventListener('catalog-service-selected', handleServiceSelected);
    };
  }, [copy.promotionCommentPrefix]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!servicePickerRef.current?.contains(event.target)) setIsServiceListOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsServiceListOpen(false);
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name').trim();
    const phone = formData.get('phone').trim();
    const comment = formData.get('comment').trim();
    const selectedService = formData.get('service') || '';
    const digits = phone.replace(/\D/g, '');
    const nextErrors = {};

    if (!name) nextErrors.name = copy.nameError;
    if (!phone) nextErrors.phone = copy.phoneRequiredError;
    else if (digits.length < 10) nextErrors.phone = copy.phoneFormatError;

    setErrors(nextErrors);
    setRequestError(false);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, comment, service: selectedService }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error('Lead request failed');
      setIsSubmitted(true);
    } catch {
      setRequestError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return <div className={`${styles.formCard} ${styles.success}`} role="status">{copy.success}</div>;
  }

  return (
    <form className={styles.formCard} onSubmit={handleSubmit} noValidate>
      <h3 className={styles.formHeading}>{copy.heading}</h3>
      <label className={styles.field}>
        <span>{copy.nameLabel}</span>
        <input name="name" type="text" required placeholder={copy.namePlaceholder} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
        {errors.name && <small id="name-error" className={styles.fieldError}>{errors.name}</small>}
      </label>
      <label className={styles.field}>
        <span>{copy.phoneLabel}</span>
        <input name="phone" type="tel" required placeholder={copy.phonePlaceholder} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} />
        {errors.phone && <small id="phone-error" className={styles.fieldError}>{errors.phone}</small>}
      </label>
      <label className={styles.field}>
        <span>{copy.commentLabel}</span>
        <textarea name="comment" rows="4" placeholder={copy.commentPlaceholder} value={comment} onChange={(event) => setComment(event.target.value)} />
      </label>
      <div className={styles.field} ref={servicePickerRef}>
        <span>{copy.serviceLabel}</span>
        <input type="hidden" name="service" value={service} />
        <button
          className={styles.serviceTrigger}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isServiceListOpen}
          onClick={() => setIsServiceListOpen((isOpen) => !isOpen)}
        >
          <span className={service ? styles.serviceValue : styles.servicePlaceholder}>{service || copy.servicePlaceholder}</span>
          <span className={`${styles.serviceChevron} ${isServiceListOpen ? styles.serviceChevronOpen : ''}`} aria-hidden="true" />
        </button>
        {isServiceListOpen && (
          <div className={styles.serviceMenu} role="listbox" aria-label={copy.serviceLabel}>
            {copy.services.map((item) => {
              const isSelected = item === service;
              return (
                <button
                  key={item}
                  className={`${styles.serviceOption} ${isSelected ? styles.serviceOptionSelected : ''}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setService(item);
                    setIsServiceListOpen(false);
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {requestError && <p className={styles.requestError}>{copy.requestError} <a href={phoneHref}>+7 (902) 229-89-93</a></p>}
      <button className={styles.submit} type="submit" disabled={isSubmitting}>{isSubmitting ? copy.submitting : copy.submit}</button>
    </form>
  );
}
