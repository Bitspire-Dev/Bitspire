import LegalPage from "@/components/sections/LegalPage";

interface LegalSection {
    id?: string | null;
    title?: string | null;
    content?: string | null;
}

interface LegalPageData {
    [key: string]: unknown;
    title?: string | null;
    titleAccent?: string | null;
    lastUpdate?: string | null;
    sections?: LegalSection[];
}

interface LegalPageWrapperProps {
    data: LegalPageData;
    hideToc?: boolean;
}

export default function LegalPageWrapper({ data, hideToc }: LegalPageWrapperProps) {
    return (
        <LegalPage data={data} hideToc={hideToc} />
    );
}
