'use client';

import React, { useState, useRef, useEffect } from 'react';
import { tinaField } from 'tinacms/dist/react';
import { RichText } from '@tina/richTextPresets';
import { motion, AnimatePresence } from 'framer-motion';
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

const subjects = [
  "General Inquiry",
  "Project Proposal",
  "Support",
  "Other"
];

export const Contact: React.FC<ContactProps> = ({ data }) => {
  const [formState, setFormState] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSubjectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedSubject) {
        setFormState({
            status: 'error',
            message: 'Please select a subject.',
        });
        return;
    }

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
      setSelectedSubject("");
    } catch (error) {
      setFormState({
        status: 'error',
        message: data.errorMessage || 'Something went wrong. Please try again.',
      });
    }
  };

  const inputClasses = "w-full bg-[#0b1223] border border-[#1e2a44] rounded-xl px-4 py-3 text-brand-fg placeholder:text-brand-text-muted-2/60 focus:outline-none focus:border-brand-accent/60 focus:bg-[#0e162a] transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";
  const labelClasses = "block text-brand-text-muted-2 text-sm font-medium mb-2 ml-1";

  return (
    <section id="contact" className="w-full py-section mb-8 relative z-10 bg-brand-bg overflow-hidden">
      
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
            <form onSubmit={handleSubmit} className="relative space-y-6 bg-[#0a1326] p-8 md:p-10 rounded-3xl border border-[#1a2740] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                   <label htmlFor="name" className={labelClasses}>Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className={inputClasses}
                    placeholder="John Doe"
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <div className="relative group">
                   <label htmlFor="email" className={labelClasses}>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className={inputClasses}
                    placeholder="john@example.com"
                     onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
              
              <div className="relative group" ref={dropdownRef}>
                  <label htmlFor="subject-trigger" className={labelClasses}>Subject</label>
                  <input type="hidden" name="subject" value={selectedSubject} />
                  
                  <div 
                    id="subject-trigger"
                    className={`cursor-pointer ${inputClasses} flex items-center justify-between ${subjectOpen ? 'border-brand-accent ring-1 ring-brand-accent' : ''}`}
                    onClick={() => setSubjectOpen(!subjectOpen)}
                  >
                     <span className={selectedSubject ? 'text-brand-fg' : 'text-brand-text-muted-2/50'}>
                         {selectedSubject || "Select a subject..."}
                     </span>
                     <svg 
                        className={`w-5 h-5 text-brand-text-muted-2 transition-transform duration-300 ${subjectOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>

                  <AnimatePresence>
                    {subjectOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 right-0 mt-2 bg-[#0b1223] border border-[#1e2a44] rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                            {subjects.map((subject) => (
                                <div
                                    key={subject}
                                className={`px-4 py-3 cursor-pointer transition-colors duration-200 hover:bg-[#0f1b35] hover:text-brand-accent ${selectedSubject === subject ? 'bg-[#0f1b35] text-brand-accent' : 'text-brand-fg'}`}
                                    onClick={() => {
                                        setSelectedSubject(subject);
                                        setSubjectOpen(false);
                                    }}
                                >
                                    {subject}
                                </div>
                            ))}
                        </motion.div>
                    )}
                  </AnimatePresence>
              </div>

              <div className="relative group">
                 <label htmlFor="message" className={labelClasses}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className={`${inputClasses} resize-none min-h-[120px]`}
                  placeholder="Tell us about your project..."
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>

              <div className="pt-6 flex items-center justify-between">
                 <button
                  type="submit"
                  disabled={formState.status === 'loading'}
                  className="group relative inline-flex items-center justify-center px-8 py-3.5 font-semibold text-white transition-all duration-200 bg-[#2563eb] rounded-xl hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_24px_-12px_rgba(37,99,235,0.8)]"
                  data-tina-field={tinaField(data, 'buttonLabel')}
                >
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

