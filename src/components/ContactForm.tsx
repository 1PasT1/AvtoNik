import React, { useState } from 'react';
import { sendInquiry } from '../utils/api';

interface ContactFormProps {
  carid: string;
  language: string;
}

export function ContactForm({ carid, language }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    countryCode: '',
    phoneNumber: '',
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dateRange] = useState<{from: Date | null, to: Date | null} | null>(null);
  const [totalPrice] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const inquiryData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: `${formData.countryCode}${formData.phoneNumber}`,
        pickupdate: dateRange?.from?.toISOString() || '',
        dropoffdate: dateRange?.to?.toISOString() || '',
        carid: carid, 
        message: formData.message,
        totalPrice: totalPrice || 0,
      };

      await sendInquiry(inquiryData);

      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
        countryCode: '',
        phoneNumber: '',
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            {language === 'English' ? 'First Name' : 'Имя'}
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            {language === 'English' ? 'Last Name' : 'Фамилия'}
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {language === 'English' ? 'Email' : 'Электронная почта'}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          {language === 'English' ? 'Message' : 'Сообщение'}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          value={formData.message}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-500 text-white rounded-md py-2 px-4 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting 
          ? (language === 'English' ? 'Sending...' : 'Отправка...') 
          : (language === 'English' ? 'Send Inquiry' : 'Отправить запрос')}
      </button>
      {submitStatus === 'success' && (
        <p className="text-green-600">
          {language === 'English' ? 'Inquiry sent successfully!' : 'Запрос успешно отправлен!'}
        </p>
      )}
      {submitStatus === 'error' && (
        <p className="text-red-600">
          {language === 'English' ? 'Failed to send inquiry. Please try again.' : 'Не удалось отправить запрос. Пожалуйста, попробуйте еще раз.'}
        </p>
      )}
    </form>
  );
}

