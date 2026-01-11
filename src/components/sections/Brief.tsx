'use client';

import React, { useState } from 'react';
import { tinaField } from 'tinacms/dist/react';
import { CursorLightCard } from '@/components/features/Cursor-Light';
import { useBriefForm } from '@/hooks/useBriefForm';
import { useContactForm } from '@/hooks/useContactForm';
import { RichText } from '../ui/RichTextPresets';

interface ContactInfo {
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  [key: string]: unknown;
}

interface TabType {
  label?: string | null;
  value?: string | null;
}

interface FormLabels {
  progressLabel?: string | null;
  requiredMark?: string | null;
  placeholderTextarea?: string | null;
  placeholderText?: string | null;
  placeholderTechnology?: string | null;
  placeholderIntegrations?: string | null;
  buttonPrev?: string | null;
  buttonNext?: string | null;
  buttonSubmit?: string | null;
  buttonSubmitting?: string | null;
  successTitle?: string | null;
  successMessage?: string | null;
}

interface ContactFormLabels {
  title?: string | null;
  placeholderName?: string | null;
  placeholderEmail?: string | null;
  placeholderMessage?: string | null;
  buttonSend?: string | null;
  buttonSending?: string | null;
  successTitle?: string | null;
  successMessage?: string | null;
}

interface ContactInfoLabels {
  title?: string | null;
  emailLabel?: string | null;
  phoneLabel?: string | null;
  addressLabel?: string | null;
  quickResponseLabel?: string | null;
  quickResponseText?: string | null;
}

interface BriefData {
  title?: string | null;
  description?: Record<string, unknown>;
  buttonText?: string | null;
  badge?: string | null;
  heroTitle?: Record<string, unknown>;
  heroTitleHighlight?: Record<string, unknown>;
  tabs?: TabType[] | null;
  form?: FormLabels | null;
  contactForm?: ContactFormLabels | null;
  contactInfo?: ContactInfoLabels | null;
  contact?: ContactInfo | null;
  [key: string]: unknown;
}

interface Step {
  label: string;
  required: boolean;
  options?: string[];
  type?: 'text' | 'textarea';
  key: string;
}

const TAB_TYPES = [
  { label: 'Strona internetowa', value: 'website' },
  { label: 'Sklep internetowy', value: 'shop' },
  { label: 'Logo', value: 'logo' },
  { label: 'Pozycjonowanie', value: 'seo' },
];

// Kroki dla każdego typu briefu
const BRIEF_STEPS: Record<string, Step[]> = {
  website: [
    { label: "Nowy projekt czy przebudowa?", required: true, options: ["Nowy projekt", "Przebudowa"], key: "projectType" },
    { label: "Jakie są główne cele strony? (np. sprzedaż produktów, prezentacja usług, blog, portfolio)", required: true, type: "textarea", key: "mainGoal" },
    { label: "Czy strona ma być dostosowana do urządzeń mobilnych (responsywność)?", required: true, options: ["Tak", "Nie"], key: "responsive" },
    { label: "Jakie funkcje ma posiadać strona? (np. formularz kontaktowy, sklep internetowy, system rezerwacji, integracja z mediami społecznościowymi, mapy...)", required: false, type: "textarea", key: "features" },
    { label: "Czy potrzebne są dodatkowe funkcjonalności, takie jak panel administracyjny do zarządzania treścią? (CMS)", required: false, options: ["Tak", "Nie"], key: "cms" },
    { label: "Czy posiadasz już materiały graficzne (np. logo, zdjęcia, kolorystykę)?", required: false, options: ["Tak", "Nie"], key: "graphics" },
    { label: "Czy oczekujesz unikalnego projektu graficznego, czy możesz zaakceptować gotowy szablon?", required: false, options: ["Unikalny projekt", "Gotowy szablon"], key: "designType" },
    { label: "Preferencje co do stylu graficznego (np. minimalistyczny, nowoczesny, klasyczny)", required: false, type: "text", key: "style" },
    { label: "Linki do stron-inspiracji (jeśli są)", required: false, type: "text", key: "inspirationLinks" },
    { label: "Czy dostarczysz gotowe treści (teksty, zdjęcia, filmy), czy potrzebujesz pomocy w ich stworzeniu?", required: false, options: ["Dostarczę treści", "Potrzebuję pomocy"], key: "contentDelivery" },
    { label: "Ile podstron planujesz?", required: false, options: ["0-5", "6-10", "11-20", ">20"], key: "subpages" },
    { label: "Czy treści strony mają być dostępne tylko w języku polskim? Jeśli nie, to w jakich innych językach?", required: false, type: "text", key: "languages" },
    { label: "Preferencje do konkretnych technologii?", required: false, options: ["Nie", "Inne"], key: "technology" },
    { label: "Czy posiadasz już hosting i domenę, czy potrzebujesz pomocy w ich wyborze i konfiguracji?", required: false, options: ["Posiadam", "Potrzebuję pomocy"], key: "hosting" },
    { label: "Czy strona ma być zabezpieczona certyfikatem SSL?", required: false, options: ["Tak", "Nie"], key: "ssl" },
    { label: "Jaki jest orientacyjny budżet na realizację projektu?", required: false, type: "text", key: "budget" },
    { label: "Czy przewidujesz dodatkowy budżet na utrzymanie strony po jej uruchomieniu?", required: false, options: ["Tak", "Nie"], key: "maintenanceBudget" },
    { label: "Podaj swoje dane kontaktowe (e-mail lub numer telefonu)", required: true, type: "text", key: "contact" }
  ],
  shop: [
    { label: "Nowy sklep czy przebudowa?", required: true, options: ["Nowy sklep", "Przebudowa"], key: "shopType" },
    { label: "Jakie produkty chcesz sprzedawać?", required: true, type: "textarea", key: "products" },
    { label: "Ile produktów planujesz na start?", required: false, options: ["do10", "od11do50", "od51do200", "powyzej200"], key: "productCount" },
    { label: "Czy sklep ma obsługiwać różne warianty produktów (np. rozmiar, kolor)?", required: false, options: ["Tak", "Nie"], key: "variants" },
    { label: "Jakie metody płatności mają być dostępne?", required: false, type: "textarea", key: "payments" },
    { label: "Jakie metody dostawy mają być dostępne?", required: false, type: "textarea", key: "shipping" },
    { label: "Czy sklep ma mieć integracje z systemami zewnętrznymi (np. Allegro, hurtownie, ERP)?", required: false, options: ["Tak", "Nie", "Inne"], key: "integrations" },
    { label: "Czy potrzebujesz panelu administracyjnego do zarządzania zamówieniami i produktami?", required: false, options: ["Tak", "Nie"], key: "adminPanel" },
    { label: "Czy posiadasz już materiały graficzne (logo, zdjęcia produktów)?", required: false, options: ["Tak", "Nie"], key: "graphics" },
    { label: "Preferencje co do stylu graficznego sklepu?", required: false, type: "text", key: "style" },
    { label: "Czy sklep ma być dostępny w innych językach niż polski?", required: false, type: "text", key: "languages" },
    { label: "Jaki jest orientacyjny budżet na realizację sklepu?", required: false, type: "text", key: "budget" },
    { label: "Podaj swoje dane kontaktowe (e-mail lub numer telefonu)", required: true, type: "text", key: "contact" }
  ],
  logo: [
    { label: "Nowe logo czy lifting obecnego?", required: true, options: ["Nowe logo", "Lifting obecnego"], key: "logoType" },
    { label: "Nazwa firmy / marki do umieszczenia w logo", required: true, type: "text", key: "brandName" },
    { label: "Hasło / tagline (jeśli ma się pojawić)", required: false, type: "text", key: "tagline" },
    { label: "Jakie wartości lub cechy ma wyrażać logo?", required: true, type: "textarea", key: "values" },
    { label: "Preferencje kolorystyczne", required: false, type: "text", key: "colors" },
    { label: "Preferencje co do stylu logo (np. minimalistyczne, klasyczne, nowoczesne)", required: false, type: "text", key: "style" },
    { label: "Czy logo ma zawierać symbol/grafikę czy być tylko typograficzne?", required: false, options: ["Symbol/grafika", "Tylko typografia", "Nie wiem"], key: "symbol" },
    { label: "Gdzie będzie używane logo? (np. strona www, druk, social media, gadżety)", required: false, type: "textarea", key: "usage" },
    { label: "Czy posiadasz inspiracje lub przykłady logo, które Ci się podobają?", required: false, type: "text", key: "inspirations" },
    { label: "Jaki jest orientacyjny budżet na projekt logo?", required: false, type: "text", key: "budget" },
    { label: "Podaj swoje dane kontaktowe (e-mail lub numer telefonu)", required: true, type: "text", key: "contact" }
  ],
  seo: [
    { label: "Czy strona jest już online?", required: true, options: ["Tak", "Nie"], key: "online" },
    { label: "Adres strony do pozycjonowania", required: true, type: "text", key: "url" },
    { label: "Jakie cele chcesz osiągnąć dzięki pozycjonowaniu? (np. wzrost ruchu, sprzedaż, rozpoznawalność marki)", required: true, type: "textarea", key: "goals" },
    { label: "Na jakie frazy/tematy chcesz się pozycjonować?", required: true, type: "textarea", key: "keywords" },
    { label: "Czy prowadzisz już działania SEO?", required: false, options: ["Tak", "Nie"], key: "existingSeo" },
    { label: "Czy masz preferencje co do rynku (np. Polska, zagranica)?", required: false, type: "text", key: "market" },
    { label: "Czy posiadasz blog lub planujesz go prowadzić?", required: false, options: ["Tak", "Nie"], key: "blog" },
    { label: "Czy posiadasz materiały do optymalizacji (teksty, zdjęcia)?", required: false, options: ["Tak", "Nie"], key: "materials" },
    { label: "Jaki jest orientacyjny budżet na działania SEO?", required: false, type: "text", key: "budget" },
    { label: "Podaj swoje dane kontaktowe (e-mail lub numer telefonu)", required: true, type: "text", key: "contact" }
  ]
};

// Komponent Briefu
function BriefForm({ briefType, labels, tabs: _tabs }: { briefType: string, labels?: FormLabels | null, tabs?: TabType[] | null }) {
  const STEPS = BRIEF_STEPS[briefType] || [];
  
  const {
    step: _step,
    form,
    loading,
    success,
    error,
    current,
    percent,
    isFormValid,
    handleSelect,
    handleInputChange,
    handleOtherInputChange,
    nextStep,
    prevStep,
    handleSubmit,
    isLastStep,
    isFirstStep,
    setError: _setError,
  } = useBriefForm({
    steps: STEPS,
    briefType,
  });

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-mono text-blue-400">{labels?.progressLabel}</span>
          <span className="text-xs font-mono text-blue-400">{percent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-900/50 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-linear-to-r from-blue-600 to-cyan-500 relative"
            style={{
              width: `${percent}%`,
              transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
          </div>
        </div>
      </div>

      {success ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">{labels?.successTitle}</h3>
          <p className="text-slate-400 max-w-md">
            {labels?.successMessage}
          </p>
        </div>
      ) : (
        <>
          <div className="flex-1 mb-8">
            <label className="block text-2xl md:text-3xl font-bold mb-6 text-white leading-tight">
              {current.label}{" "}
              {current.required && (
                <span className="text-blue-500 text-lg align-top">{labels?.requiredMark}</span>
              )}
            </label>
            
            <div key={current.key} className="flex flex-col gap-3 animate-fade-in-up">
              {current.options &&
                current.options.map((option: string) => (
                  <div key={option} className="flex flex-col">
                    <label
                      className={`flex items-center gap-4 cursor-pointer p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden
                      ${
                        form[current.key] === option ||
                        (option === "Inne" && form[current.key]?.startsWith("Inne:"))
                          ? "border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                          : "border-slate-800 bg-slate-900/40 hover:border-blue-500/30 hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="relative z-10 flex items-center gap-4 w-full">
                        <div className="relative">
                          <input
                            type="radio"
                            name={`brief-${briefType}-${current.key}`}
                            checked={Boolean(
                              form[current.key] === option ||
                              (option === "Inne" && form[current.key]?.startsWith("Inne:"))
                            )}
                            onChange={() => handleSelect(option)}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border transition-all duration-300 flex items-center justify-center
                            ${
                              form[current.key] === option ||
                              (option === "Inne" && form[current.key]?.startsWith("Inne:"))
                                ? "border-blue-500 bg-blue-500"
                                : "border-slate-600 bg-transparent group-hover:border-blue-400"
                            }`}
                          >
                            {(form[current.key] === option ||
                              (option === "Inne" && form[current.key]?.startsWith("Inne:"))) && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <span className={`text-lg font-medium transition-colors ${
                          form[current.key] === option || (option === "Inne" && form[current.key]?.startsWith("Inne:"))
                          ? "text-white"
                          : "text-slate-400 group-hover:text-slate-200"
                        }`}>{option}</span>
                      </div>
                    </label>
                    {(current.key === "technology" || current.key === "integrations") &&
                      option === "Inne" &&
                      (form[current.key] === "Inne" ||
                        form[current.key]?.startsWith("Inne:")) && (
                        <input
                          className="w-full mt-3 p-4 rounded-xl bg-slate-900/80 border border-blue-500/50 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all animate-fade-in"
                          type="text"
                          placeholder={current.key === "technology" ? labels?.placeholderTechnology || "" : labels?.placeholderIntegrations || ""}
                          value={
                            form[current.key]?.replace(
                              "Inne:",
                              ""
                            ) || ""
                          }
                          onChange={(e) => handleOtherInputChange(e.target.value)}
                          autoFocus
                        />
                      )}
                  </div>
                ))}
              {current.type === "textarea" && (
                <textarea
                  className="w-full p-5 rounded-xl bg-slate-900/50 border border-slate-700 text-white text-lg placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none min-h-40"
                  rows={4}
                  value={form[current.key] || ""}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={labels?.placeholderTextarea || ""}
                />
              )}
              {current.type === "text" && (
                <input
                  className="w-full p-5 rounded-xl bg-slate-900/50 border border-slate-700 text-white text-lg placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  type="text"
                  value={form[current.key] || ""}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={labels?.placeholderText || ""}
                />
              )}
            </div>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center text-sm font-medium animate-shake">
              {error}
            </div>
          )}
          
          <div className="flex gap-4 pt-4 border-t border-slate-800/50 mt-auto">
            <button
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 border
                ${isFirstStep || loading 
                  ? "border-slate-800 text-slate-600 cursor-not-allowed opacity-50" 
                  : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800"}`}
              onClick={prevStep}
              disabled={isFirstStep || loading}
            >
              {labels?.buttonPrev}
            </button>
            
            {!isLastStep ? (
              <button
                className={`flex-1 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-300
                  ${
                    !form[current.key] || loading
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "btn-tech-primary"
                  }`}
                onClick={nextStep}
                disabled={!form[current.key] || loading}
              >
                {labels?.buttonNext}
              </button>
            ) : (
              <button
                className={`flex-1 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-300
                  ${
                    (!form[current.key] || !isFormValid) || loading
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-linear-to-r from-blue-600 to-cyan-500 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                  }`}
                onClick={handleSubmit}
                disabled={(!form[current.key] || !isFormValid) || loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {labels?.buttonSubmitting}
                  </span>
                ) : labels?.buttonSubmit}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function Brief({ data }: { data?: BriefData }) {
  const [activeTab, setActiveTab] = useState('website');
  
  const {
    formData,
    loading,
    success,
    error,
    handleChange,
    handleSubmit,
  } = useContactForm({ formName: 'contact' });

  return (
    <section className="py-24 px-4 bg-grid-pattern relative" data-tina-field={tinaField(data)}>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Lewa strona - Brief (2 kolumny) */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Nagłówek */}
            <div className="mb-10">
              <div className="inline-block px-3 py-1 mb-4 rounded-full border border-blue-500/20 bg-blue-500/5">
                 <span className="text-blue-400 text-xs font-bold tracking-widest uppercase" data-tina-field={tinaField(data, 'badge')}>{data?.badge}</span>
              </div>
              <div 
                className="text-4xl lg:text-6xl font-bold text-white mb-6"
                data-tina-field={tinaField(data, 'heroTitle')}
              >
                <RichText content={data?.heroTitle} preset="hero-title" />
              </div>
              <div 
                className="text-xl text-slate-400 leading-relaxed max-w-2xl"
                data-tina-field={tinaField(data, 'description')}
              >
                <RichText content={data?.description} preset="subtitle" />
              </div>
            </div>

            {/* Taby */}
            <div className="flex flex-wrap gap-3 mb-8">
              {(data?.tabs || TAB_TYPES).map((tab) => (
                <button
                  key={tab.value}
                  className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 border
                    ${activeTab === tab.value 
                      ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                      : 'text-slate-400 bg-slate-900/50 border-slate-800 hover:border-blue-500/50 hover:text-white'}
                    grow sm:grow-0`}
                  onClick={() => setActiveTab(tab.value || '')}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Formularz brief */}
            <CursorLightCard className="relative rounded-2xl glass-panel p-8 flex-1 min-h-120 overflow-y-auto">
              <BriefForm briefType={activeTab} key={activeTab} labels={data?.form} tabs={data?.tabs} />
            </CursorLightCard>
          </div>

          {/* Prawa strona - Kontakt (1 kolumna) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Formularz kontaktowy */}
            <div className="glass-panel rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                 </div>
                 <h3 className="text-xl font-bold text-white" data-tina-field={tinaField(data?.contactForm, 'title')}>{data?.contactForm?.title}</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {success ? (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                      <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-white font-bold mb-2" data-tina-field={tinaField(data?.contactForm, 'successTitle')}>{data?.contactForm?.successTitle}</p>
                    <p className="text-slate-400 text-sm" data-tina-field={tinaField(data?.contactForm, 'successMessage')}>{data?.contactForm?.successMessage}</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={data?.contactForm?.placeholderName || ""}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={data?.contactForm?.placeholderEmail || ""}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={data?.contactForm?.placeholderMessage || ""}
                        rows={4}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
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
                      className={`btn-tech-primary w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? data?.contactForm?.buttonSending : data?.contactForm?.buttonSend}
                    </button>
                  </>
                )}
              </form>
            </div>

            {/* Dane kontaktowe */}
            <div className="glass-panel rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                 </div>
                 <h3 className="text-xl font-bold text-white" data-tina-field={tinaField(data?.contactInfo, 'title')}>{data?.contactInfo?.title}</h3>
              </div>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1" data-tina-field={tinaField(data?.contactInfo, 'emailLabel')}>{data?.contactInfo?.emailLabel}</p>
                    <a 
                      href={`mailto:${data?.contact?.email}`}
                      className="text-white hover:text-blue-400 font-medium transition-colors"
                      data-tina-field={tinaField(data?.contact, 'email')}
                    >
                      {data?.contact?.email}
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
                    <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1" data-tina-field={tinaField(data?.contactInfo, 'phoneLabel')}>{data?.contactInfo?.phoneLabel}</p>
                    <a 
                      href={`tel:${data?.contact?.phone}`}
                      className="text-white hover:text-blue-400 font-medium transition-colors"
                      data-tina-field={tinaField(data?.contact, 'phone')}
                    >
                      {data?.contact?.phone}
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
                    <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1" data-tina-field={tinaField(data?.contactInfo, 'addressLabel')}>{data?.contactInfo?.addressLabel}</p>
                    <div className="text-white text-sm">
                      <p className="font-medium" data-tina-field={tinaField(data?.contact, 'address')}>
                        {data?.contact?.address}
                      </p>
                      <p className="text-slate-400" data-tina-field={tinaField(data?.contact, 'addressLine2')}>
                        {data?.contact?.addressLine2}
                      </p>
                      <p className="text-slate-400" data-tina-field={tinaField(data?.contact, 'city')}>
                        {data?.contact?.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Szybka odpowiedź */}
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 mt-6 flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <div>
                   <p className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-0.5" data-tina-field={tinaField(data?.contactInfo, 'quickResponseLabel')}>{data?.contactInfo?.quickResponseLabel}</p>
                   <p className="text-slate-400 text-xs" data-tina-field={tinaField(data?.contactInfo, 'quickResponseText')}>
                     {data?.contactInfo?.quickResponseText}
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
