"use client";

import React from "react";
import { CursorLightCard } from "../features/Cursor-Light";
import { tinaField } from 'tinacms/dist/react';
import { useContactForm } from "@/hooks/useContactForm";
import { RichText } from '../ui/RichTextPresets';

interface ContactData {
  title?: Record<string, unknown>;
  description?: Record<string, unknown>;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  successTitle?: string | null;
  successMessage?: string | null;
  nameLabel?: string | null;
  emailLabel?: string | null;
  messageLabel?: string | null;
  buttonText?: string | null;
  contactDataTitle?: string | null;
  quickResponseLabel?: string | null;
  quickResponseText?: string | null;
  [key: string]: unknown;
}

const Contact: React.FC<{ data?: ContactData }> = ({ data }) => {
  const {
    formData,
    loading,
    success,
    error,
    handleChange,
    handleSubmit,
  } = useContactForm({ formName: "contact" });

  return (
    <section className="py-12 px-4 bg-slate-900/20" id="contact" data-tina-field={tinaField(data)}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <div className="w-16 h-0.5 bg-linear-to-r from-blue-600 to-cyan-500 mb-4 mx-auto"></div>
          <div data-tina-field={tinaField(data, 'title')}>
            <RichText content={data?.title} preset="section-title" />
          </div>
          <div data-tina-field={tinaField(data, 'description')}>
            <RichText content={data?.description} preset="subtitle" />
          </div>
        </div>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          {/* Formularz kontaktowy */}
          <CursorLightCard className="glass-panel rounded-2xl p-8">
            {success ? (
              <div className="py-12 text-center">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                   <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-400">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3" data-tina-field={tinaField(data, 'successTitle')}>
                  {data?.successTitle}
                </h3>
                <p className="text-slate-400" data-tina-field={tinaField(data, 'successMessage')}>
                  {data?.successMessage}
                </p>
              </div>
            ) : (
              <form 
                name="contact" 
                method="POST" 
                className="space-y-6" 
                onSubmit={handleSubmit}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1" data-tina-field={tinaField(data, 'nameLabel')}>
                       {data?.nameLabel}
                     </label>
                     <input
                       type="text"
                       name="name"
                       value={formData.name}
                       onChange={handleChange}
                       placeholder="Jan Kowalski"
                       className="w-full px-4 py-3 rounded-lg bg-slate-900/50 text-white border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 placeholder-slate-600"
                       required
                     />
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1" data-tina-field={tinaField(data, 'emailLabel')}>
                       {data?.emailLabel}
                     </label>
                     <input
                       type="email"
                       name="email"
                       value={formData.email}
                       onChange={handleChange}
                       placeholder="jan@example.com"
                       className="w-full px-4 py-3 rounded-lg bg-slate-900/50 text-white border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 placeholder-slate-600"
                       required
                     />
                  </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1" data-tina-field={tinaField(data, 'messageLabel')}>
                     {data?.messageLabel}
                   </label>
                   <textarea
                     name="message"
                     value={formData.message}
                     onChange={handleChange}
                     placeholder="Opisz swój projekt..."
                     rows={6}
                     className="w-full px-4 py-3 rounded-lg bg-slate-900/50 text-white border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 placeholder-slate-600 resize-none"
                     required
                   />
                </div>
                
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-tech-primary w-full py-4 rounded-lg font-bold text-sm uppercase tracking-wider ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  data-tina-field={tinaField(data, 'buttonText')}
                >
                  {loading ? 'Wysyłanie...' : data?.buttonText}
                </button>
              </form>
            )}
          </CursorLightCard>

          {/* Dane kontaktowe */}
          <div className="glass-panel rounded-2xl p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
               </div>
               <h3 className="text-xl font-bold text-white" data-tina-field={tinaField(data, 'contactDataTitle')}>
                 {data?.contactDataTitle}
               </h3>
            </div>
            
            <div className="space-y-6 flex-1">
              {/* Email */}
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1">Email</p>
                  <a 
                    href={`mailto:${data?.email || ''}`}
                    className="text-white hover:text-blue-400 font-medium transition-colors"
                    data-tina-field={tinaField(data, 'email')}
                  >
                    {data?.email}
                  </a>
                </div>
              </div>

              {/* Telefon */}
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors text-slate-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1">Telefon</p>
                  <a 
                    href={`tel:${data?.phone || ''}`}
                    className="text-white hover:text-blue-400 font-medium transition-colors"
                    data-tina-field={tinaField(data, 'phone')}
                  >
                    {data?.phone}
                  </a>
                </div>
              </div>

              {/* Adres */}
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1">Adres</p>
                  <div className="text-white text-sm">
                    <p className="font-medium" data-tina-field={tinaField(data, 'address')}>
                      {data?.address}
                    </p>
                    <p className="text-slate-400" data-tina-field={tinaField(data, 'addressLine2')}>
                      {data?.addressLine2}
                    </p>
                    <p className="text-slate-400" data-tina-field={tinaField(data, 'city')}>
                      {data?.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Szybka odpowiedź - na dole */}
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 mt-6 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <div>
                 <p className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-0.5" data-tina-field={tinaField(data, 'quickResponseLabel')}>
                   {data?.quickResponseLabel}
                 </p>
                 <p className="text-slate-400 text-xs" data-tina-field={tinaField(data, 'quickResponseText')}>
                   {data?.quickResponseText}
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
