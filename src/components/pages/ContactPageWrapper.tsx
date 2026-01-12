interface ContactPageWrapperProps {
    data: Record<string, unknown>;
}

export default function ContactPageWrapper({ data }: ContactPageWrapperProps) {
    if (!data) return null;

    const locale = (data as { locale?: string })?.locale || 'pl';
    const brief = (data as { brief?: Record<string, any> }).brief || {};
    const contact = (data as { contact?: Record<string, any> }).contact || (brief as any).contact || {};

    const briefCta = brief.buttonText || (locale === 'pl' ? 'Wypełnij brief' : 'Fill out brief');
    const briefTitle = brief.title || (locale === 'pl' ? 'Poznajmy się' : 'Tell us about your project');
    const briefDescription = brief.description || (locale === 'pl' ? 'Opisz potrzeby, a przygotujemy ofertę.' : 'Share your needs and we will prepare a proposal.');

    return (
        <div className="relative z-10 min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto max-w-6xl px-6 py-24 space-y-16">
                <header className="space-y-4 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-blue-400">{brief.badge || 'Brief'}</p>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">{briefTitle}</h1>
                    <p className="text-lg text-slate-300 max-w-3xl mx-auto">{briefDescription}</p>
                    <div className="pt-4">
                        <a
                            href="/forms.html"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 transition"
                        >
                            {briefCta}
                            <span aria-hidden>→</span>
                        </a>
                    </div>
                </header>

                <div className="grid gap-8 md:grid-cols-2">
                    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl">
                        <h2 className="text-xl font-semibold mb-3">{brief.heroTitle || (locale === 'pl' ? 'Opowiedz o projekcie' : 'Tell us about the project')}</h2>
                        <p className="text-slate-300 mb-6">{brief.heroTitleHighlight || brief.description}</p>
                        <ul className="space-y-3 text-slate-300 text-sm">
                            {brief.tabs?.map(tab => (
                                <li key={tab?.value} className="flex items-center gap-3">
                                    <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" aria-hidden />
                                    <span>{tab?.label}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl space-y-4">
                        <h2 className="text-xl font-semibold">{brief.contactForm?.title || (locale === 'pl' ? 'Skontaktuj się' : 'Get in touch')}</h2>
                        <div className="space-y-2 text-slate-300 text-sm">
                            {contact.email && (
                                <a className="block hover:text-blue-300 transition" href={`mailto:${contact.email}`}>
                                    {contact.email}
                                </a>
                            )}
                            {contact.phone && (
                                <a className="block hover:text-blue-300 transition" href={`tel:${contact.phone}`}>
                                    {contact.phone}
                                </a>
                            )}
                            {contact.address && (
                                <p>
                                    {contact.address}
                                    {contact.addressLine2 ? `, ${contact.addressLine2}` : ''}
                                    {contact.city ? `, ${contact.city}` : ''}
                                </p>
                            )}
                        </div>

                        {brief.contactInfo?.quickResponseText && (
                            <p className="text-xs text-slate-400">{brief.contactInfo.quickResponseText}</p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
