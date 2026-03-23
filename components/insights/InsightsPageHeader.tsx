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
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 mb-4">
        <div className="flex flex-row items-baseline gap-x-4">
          <h2 className="text-xl font-semibold text-primary-dark font-besley">
            {pageTitle}
          </h2>
          {showWhatsThis ? (
            <button
              type="button"
              onClick={() => setIsWhatsThisModalOpen(true)}
              className="text-customGray-50 underline font-inter text-xs hover:text-primary-dark transition-colors"
            >
              What&apos;s this?
            </button>
          ) : (
            <a href="#" className="text-customGray-50 underline font-inter text-xs">
              What&apos;s this?
            </a>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs">
          <button
            type="button"
            onClick={() => setIsErrorModalOpen(true)}
            className="text-customGray-50 underline-dotted underline-offset-2 font-inter flex items-center gap-1.5 underline hover:text-primary-dark transition-colors"
          >
            Spotted an error? Let us know
          </button>
        </div>
      </div>
      <SpottedErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
      />
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
