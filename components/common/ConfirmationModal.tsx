import Button from '@/elements/Button';
import {ExclamationTriangleIcon} from '@heroicons/react/24/outline';
import Modal from './Modal';

interface IConfirmationModal {
  setIsModalOpen: (val: boolean) => void;
  isModalOpen: boolean;
  heading: string;
  content?: string;
  redirectionUrl?: string;
  buttonText?: string;
  loading?: boolean;
  Icon?: React.ElementType;
  iconStyles?: string;
  showButton?: boolean;
  onClick?: () => void;
  onClose?: () => void; // Call back function when modal is closed. Useful when you want to perform action after closing the modal.
  shouldHaveCrossIcon?: boolean; // default is true. If set to false, cross icon will not be shown in modal.
}

const ConfirmationModal = (props: IConfirmationModal) => {
  const {
    setIsModalOpen,
    isModalOpen,
    heading = '',
    content = '',
    buttonText = '',
    showButton = false,
    loading = false,
    onClick,
    onClose = () => setIsModalOpen(false),
    shouldHaveCrossIcon = true,
  } = props;
  return (
    <Modal
      onClose={onClose}
      shouldHaveCrossIcon={shouldHaveCrossIcon}
      containerAdditionalClasses="max-w-xl"
      isOpen={isModalOpen}>
      <div className="flex space-y-2 flex-col items-center">
        <ExclamationTriangleIcon className="text-orange-500 w-16 h-16 p-3 bg-orange-300/20 rounded-full" />
        <p className="text-xl text-center font-semibold">{heading}</p>
        <p className="text-sm text-center pb-4 text-gray-500">{content}</p>
        {showButton && (
          <Button variant="secondary" onClick={onClick} disabled={loading}>
            {loading ? 'Deleting...' : buttonText}
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
