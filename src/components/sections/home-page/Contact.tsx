'use client';

import React, { useState } from 'react';
import { tinaField } from 'tinacms/dist/react';
import { RichText } from '@tina/richTextPresets';
import { motion } from 'framer-motion';
import { TinaMarkdownContent } from 'tinacms/dist/rich-text';

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

  return (
    <section id="contact" className="w-full py-section relative z-10 bg-brand-bg overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ 
             backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
             backgroundSize: '32px 32px' 
           }} 
      />
      
      {/* Radial Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Left Side: Text Content */}
          <div className="flex flex-col justify-center h-full pt-8 lg:sticky lg:top-24">
            {data.label && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="h-px w-8 bg-brand-accent"></div>
                <span className="text-brand-accent text-sm font-bold tracking-widest uppercase" data-tina-field={tinaField(data, 'label')}>
                  {data.label}
                </span>
              </motion.div>
            )}

            <motion.div
              className="prose prose-invert max-w-none mb-8 [&>h1]:text-4xl [&>h1]:md:text-5xl [&>h1]:font-bold [&>h1]:leading-tight [&>h1]:tracking-tight"
              data-tina-field={tinaField(data, 'title')}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
               <RichText content={data.title} />
            </motion.div>

            <motion.div
               className="prose prose-invert max-w-none text-brand-text-muted text-lg leading-relaxed border-l-2 border-brand-border/50 pl-6"
               data-tina-field={tinaField(data, 'description')}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
            >
              <RichText content={data.description} />
            </motion.div>
          </div>

          {/* Right Side: Card Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="w-full relative group"
          >
            {/* Form Glow Effect behind card */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-accent/20 to-blue-600/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            
            <form onSubmit={handleSubmit} className="relative bg-brand-surface p-6 sm:p-8 rounded-2xl border border-brand-border/40 shadow-2xl space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold text-brand-text-muted-2 uppercase tracking-wider ml-1">Name</label>
                  <div className="group/input relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-brand-fg placeholder:text-brand-text-muted-2/30 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold text-brand-text-muted-2 uppercase tracking-wider ml-1">Email</label>
                  <div className="group/input relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-brand-fg placeholder:text-brand-text-muted-2/30 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-300"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-bold text-brand-text-muted-2 uppercase tracking-wider ml-1">Subject</label>
                <div className="relative">
                 <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-brand-fg focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Project Proposal">Project Proposal</option>
                    <option value="Support">Support</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-text-muted-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold text-brand-text-muted-2 uppercase tracking-wider ml-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-brand-fg placeholder:text-brand-text-muted-2/30 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-300 resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={formState.status === 'loading'}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                  data-tina-field={tinaField(data, 'buttonLabel')}
                >
                  {formState.status === 'loading' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (data.buttonLabel || 'Send Message')}
                </button>
              </div>

              {formState.message && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`p-4 rounded-lg text-sm border ${
                    formState.status === 'success' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}
                >
                  {formState.message}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

