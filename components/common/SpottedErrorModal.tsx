import Modal from '@/common/Modal';
import SingleSelectDropdown from '@/common/SingleSelectDropdown';
import { useState } from 'react';

const ISSUE_TYPE_OPTIONS = [
  'Incorrect information',
  'Outdated information',
  'Missing information',
  'Misleading information',
  'Other',
];

interface SpottedErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (issueType: string, description: string) => void;
}

export default function SpottedErrorModal({
  isOpen,
  onClose,
  onSubmit,
}: SpottedErrorModalProps) {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(issueType, description);
    setIssueType('');
    setDescription('');
    onClose();
  };

  const canSubmit = issueType && description.trim().length > 0;

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
          Spotted An Error?
        </h2>
      </div>
      <p className="mt-2 text-sm text-primary-dark font-inter">
        Notice something off with the data? Let us know using this form, and
        we&apos;ll review it promptly.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <SingleSelectDropdown
          label="Issue Type"
          placeholder="Select an option"
          options={ISSUE_TYPE_OPTIONS}
          value={issueType}
          onChange={setIssueType}
        />
        <div>
          <label
            htmlFor="spotted-error-description"
            className="block text-sm font-medium text-primary-dark font-inter mb-1.5"
          >
            Description
          </label>
          <textarea
            id="spotted-error-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter message..."
            rows={4}
            className="w-full resize-y rounded-lg border border-customGray-10 bg-white px-3 py-2.5 text-sm font-inter text-primary-dark placeholder:text-customGray-50 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
            aria-label="Description"
          />
        </div>
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-lg bg-customGray-90 px-5 py-2.5 font-inter text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
}
