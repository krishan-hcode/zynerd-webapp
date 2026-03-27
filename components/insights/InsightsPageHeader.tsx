import SpottedErrorModal from '@/common/SpottedErrorModal';
import WhatsThisModal from '@/common/WhatsThisModal';
import { useState } from 'react';

interface InsightsPageHeaderProps {
  pageTitle: string;
  whatsThisTitle?: string;
  whatsThisBody?: string;
}

export default function InsightsPageHeader({
  pageTitle,
  whatsThisTitle,
  whatsThisBody,
}: InsightsPageHeaderProps) {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isWhatsThisModalOpen, setIsWhatsThisModalOpen] = useState(false);
  const showWhatsThis = Boolean(whatsThisTitle && whatsThisBody);

  return (
    <>
      <div className="mb-4 rounded-2xl border border-customGray-10 bg-gradient-to-b from-white to-customGray-3/40 p-4">
        <p className="text-[11px] font-interMedium uppercase tracking-[0.08em] text-customGray-50">
          Insights
        </p>
        <h2 className="mt-1 text-xl font-semibold text-primary-dark font-besley md:text-2xl">
          {pageTitle}
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {showWhatsThis ? (
            <button
              type="button"
              onClick={() => setIsWhatsThisModalOpen(true)}
              className="rounded-lg border border-customGray-10 bg-white px-3 py-1.5 text-xs font-inter text-customGray-70 transition-colors hover:border-primary-blue/30 hover:text-primary-blue"
            >
              What&apos;s this?
            </button>
          ) : (
            <a href="#" className="rounded-lg border border-customGray-10 bg-white px-3 py-1.5 text-xs font-inter text-customGray-70">
              What&apos;s this?
            </a>
          )}
        </div>

      </div>

      {showWhatsThis && (
        <WhatsThisModal
          title={whatsThisTitle!}
          body={whatsThisBody!}
          isOpen={isWhatsThisModalOpen}
          onClose={() => setIsWhatsThisModalOpen(false)}
        />
      )}
    </>
  );
}
