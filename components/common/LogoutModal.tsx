import {LogOutIcon} from '@/elements/Icons';
import type React from 'react';
import Modal from './Modal';
const LogoutModal: React.FC<any> = ({isOpen, onClose, onConfirm}) => {
  return (
    <Modal
      shouldHaveCrossIcon
      onClose={onClose}
      isOpen={isOpen}
      containerAdditionalClasses="max-w-lg">
      <div className="flex flex-col items-center">
        <span className="mb-4 inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-8 border-slate-100 border-opacity-10 bg-slate-200">
          <LogOutIcon />
        </span>
        <h3 className="mb-2 text-2xl font-bold text-gray-800">Log Out</h3>
        <p className="text-gray-500">
          Are you sure you would like to log out of your account?
        </p>
        <div className="mt-6 flex justify-center gap-x-4">
          <button
            onClick={onConfirm}
            className="py-2.5 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm">
            Log Out
          </button>
          <button
            onClick={onClose}
            type="button"
            className="py-2.5 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default LogoutModal;
