'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Send, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { FadeInUp, SlideInLeft, SlideInRight } from './ScrollAnimations';
import { submitContact, type ContactFormData } from '@/lib/api';

const contactInfo = [
  {
    icon: Mail,
    label: 'Имейл',
    value: 'info@creativehub.bg',
    href: 'mailto:info@creativehub.bg',
  },
  {
    icon: Phone,
    label: 'Телефон',
    value: '+359 888 123 456',
    href: 'tel:+359888123456',
  },
  {
    icon: MapPin,
    label: 'Локация',
    value: 'София, България',
    href: '#',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@creativehub.wedding',
    href: 'https://instagram.com/creativehub.wedding',
  },
];

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    wedding_date: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const result = await submitContact(formData);

    if (result.success) {
      setStatus('success');
      setStatusMessage(result.message);
      setFormData({
        name: '',
        email: '',
        phone: '',
        wedding_date: '',
        message: '',
      });
    } else {
      setStatus('error');
      setStatusMessage(result.message);
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus('idle');
      setStatusMessage('');
    }, 5000);
  };

  return (
    <section id="contact" className="section-padding bg-dark-900">
      <div className="container-width">
        {/* Section Header */}
        <FadeInUp className="text-center mb-16">
          <span className="text-primary-400 font-medium text-sm uppercase tracking-wider">
            Свържете се с нас
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-dark-50 mt-4 mb-6">
            Контакти
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Имате въпроси или искате да резервирате дата? Свържете се с нас!
          </p>
        </FadeInUp>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <SlideInLeft>
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 8 }}
                  className="flex items-center gap-4 p-4 glass rounded-xl hover:bg-dark-800/80 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-primary-600/30 transition-colors">
                    <item.icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <div className="text-sm text-dark-400">{item.label}</div>
                    <div className="text-dark-100 font-medium">{item.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </SlideInLeft>

          {/* Contact Form */}
          <SlideInRight>
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm text-dark-400 mb-2">
                    Име *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="Вашето име"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm text-dark-400 mb-2">
                    Имейл *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm text-dark-400 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="+359 888 123 456"
                  />
                </div>

                {/* Wedding Date */}
                <div>
                  <label htmlFor="wedding_date" className="block text-sm text-dark-400 mb-2">
                    Дата на сватбата
                  </label>
                  <input
                    type="date"
                    id="wedding_date"
                    name="wedding_date"
                    value={formData.wedding_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm text-dark-400 mb-2">
                  Съобщение
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-none"
                  placeholder="Разкажете ни за вашата сватба..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
                whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-dark-950 font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Изпращане...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Изпрати съобщение
                  </>
                )}
              </motion.button>

              {/* Status Message */}
              {status !== 'idle' && status !== 'loading' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
                    status === 'success'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {status === 'success' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  {statusMessage}
                </motion.div>
              )}
            </form>
          </SlideInRight>
        </div>
      </div>
    </section>
  );
}
