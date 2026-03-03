import Button from '@/elements/Button';
import {ExclamationTriangleIcon} from '@heroicons/react/24/outline';
import Modal from './Modal';

interface IDataResetConfirmationModal {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  heading: string;
  content?: string;
  loading?: boolean;
  yesButtonText?: string;
  noButtonText?: string;
  onYesClick: () => void;
  onNoClick: () => void;
}

const DataResetConfirmationModal = (props: IDataResetConfirmationModal) => {
  const {
    isModalOpen,
    setIsModalOpen,
    heading = '',
    content = '',
    loading = false,
    yesButtonText = 'Yes',
    noButtonText = 'No',
    onYesClick,
    onNoClick,
  } = props;

  return (
    <Modal
      onClose={() => {}} // No-op since we don't want closing via backdrop
      shouldHaveCrossIcon={false}
      containerAdditionalClasses="max-w-xl"
      isOpen={isModalOpen}>
      <div className="flex space-y-2 flex-col items-center">
        <ExclamationTriangleIcon className="text-orange-500 w-16 h-16 p-3 bg-orange-300/20 rounded-full" />
        <p className="text-xl text-center font-semibold">{heading}</p>
        <p className="text-sm text-center pb-4 text-gray-500">{content}</p>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={onYesClick} disabled={loading}>
            {yesButtonText}
          </Button>
          <Button variant="primary" onClick={onNoClick} disabled={loading}>
            {noButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DataResetConfirmationModal;
