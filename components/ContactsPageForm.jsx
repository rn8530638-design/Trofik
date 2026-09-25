'use client';

import { useEffect, useRef, useState } from 'react';
import { serviceOptions } from '@/lib/contactData';
import { CONTACT_DRAFT_EVENT, readContactDraft, writeContactDraft } from '@/lib/contactDraft';
import styles from './ContactsPageForm.module.css';

export default function ContactsPageForm({ phoneHref }) {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [draft, setDraft] = useState({ name: '', phone: '', comment: '', service: '' });
  const [isServiceListOpen, setIsServiceListOpen] = useState(false);
  const servicePickerRef = useRef(null);

  const updateDraft = (field, value) => {
    setDraft((current) => {
      const next = { ...current, [field]: value };
      writeContactDraft(next);
      return next;
    });
  };

  useEffect(() => {
    setDraft((current) => ({ ...current, ...readContactDraft() }));
  }, []);

  useEffect(() => {
    const handleDraftChanged = (event) => setDraft(event.detail);
    window.addEventListener(CONTACT_DRAFT_EVENT, handleDraftChanged);
    return () => window.removeEventListener(CONTACT_DRAFT_EVENT, handleDraftChanged);
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

  // Ошибку показываем, когда поле уже трогали и ушли из него.
  function validateField(field, value) {
    const trimmed = value.trim();
    if (field === 'name') return trimmed ? '' : 'Укажите, пожалуйста, имя.';
    if (!trimmed) return 'Укажите, пожалуйста, телефон.';
    return trimmed.replace(/\D/g, '').length < 10 ? 'Введите номер телефона не менее чем из 10 цифр.' : '';
  }

  function handleBlur(field) {
    setErrors((current) => ({ ...current, [field]: validateField(field, draft[field]) }));
  }

  const isReady = Boolean(draft.name.trim()) && draft.phone.replace(/\D/g, '').length >= 10;

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
      const response = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, comment: draft.comment.trim(), serviceType: draft.service }) });
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
      <label className={styles.field}><span>Имя<i aria-hidden="true">*</i></span><input name="name" type="text" required placeholder="Ваше имя" value={draft.name} onChange={(event) => { updateDraft('name', event.target.value); if (errors.name) setErrors((current) => ({ ...current, name: '' })); }} onBlur={() => handleBlur('name')} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contacts-name-error' : undefined} />{errors.name && <small id="contacts-name-error">{errors.name}</small>}</label>
      <label className={styles.field}><span>Телефон<i aria-hidden="true">*</i></span><input name="phone" type="tel" required placeholder="+7 (___) ___-__-__" value={draft.phone} onChange={(event) => { updateDraft('phone', event.target.value); if (errors.phone) setErrors((current) => ({ ...current, phone: '' })); }} onBlur={() => handleBlur('phone')} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'contacts-phone-error' : undefined} />{errors.phone && <small id="contacts-phone-error">{errors.phone}</small>}</label>
      <label className={styles.field}><span>Комментарий<em>необязательно</em></span><textarea name="comment" rows="4" placeholder="Расскажите, что вас интересует" value={draft.comment} onChange={(event) => updateDraft('comment', event.target.value)} /></label>
      <div className={styles.field} ref={servicePickerRef}>
        <span>Тип услуги</span>
        <input type="hidden" name="serviceType" value={draft.service} />
        <button
          className={styles.serviceTrigger}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isServiceListOpen}
          onClick={() => setIsServiceListOpen((isOpen) => !isOpen)}
        >
          <span className={draft.service ? styles.serviceValue : styles.servicePlaceholder}>{draft.service || 'Выберите услугу'}</span>
          <span className={`${styles.serviceChevron} ${isServiceListOpen ? styles.serviceChevronOpen : ''}`} aria-hidden="true" />
        </button>
        {isServiceListOpen && (
          <div className={styles.serviceMenu} role="listbox" aria-label="Тип услуги">
            {serviceOptions.map((service) => {
              const isSelected = service === draft.service;
              return (
                <button
                  key={service}
                  className={`${styles.serviceOption} ${isSelected ? styles.serviceOptionSelected : ''}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    updateDraft('service', service);
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
      <button className={`${styles.submit} ${isReady ? '' : styles.submitIdle}`} type="submit" disabled={isSubmitting || !isReady}>{isSubmitting ? 'Отправка...' : 'Записаться'}</button>
    </form>
  );
}
