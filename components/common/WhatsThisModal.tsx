import Modal from '@/common/Modal';

interface WhatsThisModalProps {
  title: string;
  body: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsThisModal({
  title,
  body,
  isOpen,
  onClose,
}: WhatsThisModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldHaveCrossIcon
      containerAdditionalClasses="max-w-md"
      backdropBlur
    >
      <div className="pr-8">
        <h2 className="text-lg font-semibold text-primary-dark font-besley">
          {title}
        </h2>
      </div>
      <p className="my-4 text-sm text-customGray-80 font-interMedium">{body}</p>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-primary-dark px-5 py-2.5 font-inter text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          OK
        </button>
      </div>
    </Modal>
  );
}
