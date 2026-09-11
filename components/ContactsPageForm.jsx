'use client';

import { useEffect, useRef, useState } from 'react';
import { serviceOptions } from '@/lib/contactData';
import styles from './ContactsPageForm.module.css';

export default function ContactsPageForm({ phoneHref }) {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [comment, setComment] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [isServiceListOpen, setIsServiceListOpen] = useState(false);
  const servicePickerRef = useRef(null);

  useEffect(() => {
    try {
      const selectedService = window.sessionStorage.getItem('selected-service');
      if (!selectedService) return;
      if (serviceOptions.includes(selectedService)) setServiceType(selectedService);
      window.sessionStorage.removeItem('selected-service');
    } catch {
      // The form works even if browser storage is unavailable.
    }
  }, []);

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
    const nextErrors = {};
    if (!name) nextErrors.name = 'Укажите, пожалуйста, имя.';
    if (!phone) nextErrors.phone = 'Укажите, пожалуйста, телефон.';
    else if (phone.replace(/\D/g, '').length < 10) nextErrors.phone = 'Введите номер телефона не менее чем из 10 цифр.';
    setErrors(nextErrors);
    setRequestError(false);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, comment: formData.get('comment').trim(), serviceType: formData.get('serviceType') }) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error('Lead request failed');
      setIsSubmitted(true);
    } catch {
      setRequestError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) return <div className={`${styles.formCard} ${styles.success}`} role="status">Спасибо! Мы свяжемся с вами в ближайшее время.</div>;

  return (
    <form className={styles.formCard} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.heading}>Оставьте заявку</h2>
      <label className={styles.field}><span>Имя</span><input name="name" type="text" required placeholder="Ваше имя" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contacts-name-error' : undefined} />{errors.name && <small id="contacts-name-error">{errors.name}</small>}</label>
      <label className={styles.field}><span>Телефон</span><input name="phone" type="tel" required placeholder="+7 (___) ___-__-__" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'contacts-phone-error' : undefined} />{errors.phone && <small id="contacts-phone-error">{errors.phone}</small>}</label>
      <label className={styles.field}><span>Комментарий</span><textarea name="comment" rows="4" placeholder="Расскажите, что вас интересует" value={comment} onChange={(event) => setComment(event.target.value)} /></label>
      <div className={styles.field} ref={servicePickerRef}>
        <span>Тип услуги</span>
        <input type="hidden" name="serviceType" value={serviceType} />
        <button
          className={styles.serviceTrigger}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isServiceListOpen}
          onClick={() => setIsServiceListOpen((isOpen) => !isOpen)}
        >
          <span className={serviceType ? styles.serviceValue : styles.servicePlaceholder}>{serviceType || 'Выберите услугу'}</span>
          <span className={`${styles.serviceChevron} ${isServiceListOpen ? styles.serviceChevronOpen : ''}`} aria-hidden="true" />
        </button>
        {isServiceListOpen && (
          <div className={styles.serviceMenu} role="listbox" aria-label="Тип услуги">
            {serviceOptions.map((service) => {
              const isSelected = service === serviceType;
              return (
                <button
                  key={service}
                  className={`${styles.serviceOption} ${isSelected ? styles.serviceOptionSelected : ''}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setServiceType(service);
                    setIsServiceListOpen(false);
                  }}
                >
                  {service}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {requestError && <p className={styles.requestError}>Не удалось отправить заявку. Попробуйте <a href={phoneHref}>позвонить нам напрямую</a>.</p>}
      <button className={styles.submit} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Отправка...' : 'Записаться'}</button>
    </form>
  );
}
