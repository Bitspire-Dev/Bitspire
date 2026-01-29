'use client';

import React, { useState } from 'react';
import { tinaField } from 'tinacms/dist/react';
import { RichText } from '@tina/richTextPresets';
import { motion } from 'framer-motion';
import { TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { useLocale } from 'next-intl';

interface ContactData {
  label?: string | null;
  title?: TinaMarkdownContent | TinaMarkdownContent[] | null;
  description?: TinaMarkdownContent | TinaMarkdownContent[] | null;
  buttonLabel?: string | null;
  successMessage?: string | null;
  errorMessage?: string | null;
  [key: string]: unknown;
}

interface ContactProps {
  data: ContactData;
}


export const Contact: React.FC<ContactProps> = ({ data }) => {
  const [formState, setFormState] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ status: 'loading', message: '' });

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setFormState({
        status: 'success',
        message: data.successMessage || 'Message sent successfully!',
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      setFormState({
        status: 'error',
        message: data.errorMessage || 'Something went wrong. Please try again.',
      });
    }
  };

  const inputClasses = "w-full bg-transparent border-b border-brand-border py-4 text-brand-fg placeholder:text-transparent focus:outline-none focus:border-brand-accent transition-all duration-300 peer";
  const labelClasses = "absolute left-0 top-4 text-brand-text-muted-2 text-sm transition-all duration-300 -translate-y-6 scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-brand-accent cursor-text";

  return (
    <section id="contact" className="w-full py-section relative z-10 bg-brand-bg overflow-hidden">
      
      {/* Subtle modern background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/4" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Side: Text Content */}
          <div className="lg:w-5/12 pt-8">
            {data.label && (
              <motion.div
                key={`contact-label-${locale}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-8"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                </span>
                <span className="text-brand-accent text-sm font-bold tracking-[0.2em] uppercase" data-tina-field={tinaField(data, 'label')}>
                  {data.label}
                </span>
              </motion.div>
            )}

            <motion.div
              key={`contact-title-${locale}`}
              className="mb-8"
              data-tina-field={tinaField(data, 'title')}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="prose prose-invert max-w-none [&>h1]:text-5xl [&>h1]:lg:text-6xl [&>h1]:font-bold [&>h1]:leading-[1.1] [&>h1]:tracking-tight [&>h1]:text-brand-fg">
                <RichText content={data.title ?? []} />
              </div>
            </motion.div>

            <motion.div
              key={`contact-description-${locale}`}
               className="prose prose-invert max-w-none text-brand-text-muted text-lg leading-relaxed mb-12"
               data-tina-field={tinaField(data, 'description')}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
            >
              <RichText content={data.description ?? []} />
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="hidden lg:block text-brand-text-muted-2 text-sm"
            >
                <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <span>contact@bitspire.dev</span>
                </div>
            </motion.div>
          </div>

          {/* Right Side: Clean Form */}
          <motion.div
            key={`contact-form-${locale}`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:w-7/12 mt-4 lg:mt-0"
          >
            <form onSubmit={handleSubmit} className="relative space-y-8 bg-brand-surface/30 p-8 md:p-12 rounded-3xl border border-white/5 backdrop-blur-sm shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="relative group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className={inputClasses}
                    placeholder=" "
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <label htmlFor="name" className={labelClasses}>Your Name</label>
                </div>
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className={inputClasses}
                    placeholder=" "
                     onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <label htmlFor="email" className={labelClasses}>Email Address</label>
                </div>
              </div>
              
              <div className="relative group pt-4">
                  <div className="relative">
                    <select
                        id="subject"
                        name="subject"
                        required
                        className="w-full bg-transparent border-b border-brand-border py-4 text-brand-fg focus:outline-none focus:border-brand-accent transition-all duration-300 appearance-none cursor-pointer"
                        defaultValue=""
                    >
                        <option value="" disabled className="text-brand-text-muted-2">Select a subject...</option>
                        <option value="General Inquiry" className="bg-brand-surface text-brand-fg">General Inquiry</option>
                        <option value="Project Proposal" className="bg-brand-surface text-brand-fg">Project Proposal</option>
                        <option value="Support" className="bg-brand-surface text-brand-fg">Support</option>
                        <option value="Other" className="bg-brand-surface text-brand-fg">Other</option>
                    </select>
                    <label htmlFor="subject" className="absolute left-0 -top-2 text-brand-text-muted-2 text-xs uppercase tracking-wider">Subject</label>
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-brand-text-muted-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
              </div>

              <div className="relative group pt-4">
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-brand-border py-4 text-brand-fg placeholder:text-transparent focus:outline-none focus:border-brand-accent transition-all duration-300 resize-none peer"
                  placeholder=" "
                />
                <label htmlFor="message" className={labelClasses}>Tell us about your project</label>
              </div>

              <div className="pt-6 flex items-center justify-between">
                 <button
                  type="submit"
                  disabled={formState.status === 'loading'}
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-brand-accent font-lg rounded-full hover:bg-brand-accent-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-lg shadow-brand-accent/20"
                  data-tina-field={tinaField(data, 'buttonLabel')}
                >
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                    <span className="relative flex items-center gap-3">
                        {formState.status === 'loading' ? 'Sending...' : (data.buttonLabel || 'Send Message')}
                         {!formState.status && (
                             <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                         )}
                    </span>
                </button>
              </div>

              {formState.message && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`mt-4 text-sm font-medium ${
                    formState.status === 'success' 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}
                >
                    <div className="flex items-center gap-2">
                         {formState.status === 'success' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                         ) : (
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                         )}
                        {formState.message}
                    </div>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

