import {classNames} from '@/utils/utils';
import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import React, {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

// Reusable transition configurations
const backdropTransition = {
  enter: 'ease-out duration-300',
  enterFrom: 'opacity-0',
  enterTo: 'opacity-100',
  leave: 'ease-in duration-200',
  leaveFrom: 'opacity-100',
  leaveTo: 'opacity-0',
};

const modalTransition = {
  enter: 'ease-out duration-300',
  enterFrom: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
  enterTo: 'opacity-100 translate-y-0 sm:scale-100',
  leave: 'ease-in duration-200',
  leaveFrom: 'opacity-100 translate-y-0 sm:scale-100',
  leaveTo: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
};

// Reusable close button component
const CloseButton = memo(
  ({
    onClose,
    dialogRef,
    additionalClass = 'bg-white',
  }: {
    onClose: () => void;
    dialogRef: React.RefObject<HTMLButtonElement>;
    additionalClass?: string;
  }) => (
    <div className="absolute right-0 top-0 pr-4 pt-4 block">
      <button
        ref={dialogRef}
        type="button"
        className={classNames(
          'rounded-md  text-gray-400 hover:text-gray-500 focus:outline-none',
          additionalClass,
        )}
        onClick={onClose}>
        <span className="sr-only">Close</span>
        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  ),
);

CloseButton.displayName = 'CloseButton';

function Modal({
  onClose = () => null,
  buttonAdditionalClass = 'bg-white text-customGray-90',
  isOpen = false,
  children,
  containerAdditionalClasses = '',
  modalClasses = '',
  shouldHaveCrossIcon = false,
  modalPositionClass = '',
  zIndex = 'z-[100]',
  isInFullscreen = false,
  backdropBlur = false,
}: {
  children: React.ReactNode;
  onClose?: () => void;
  isOpen: boolean;
  containerAdditionalClasses?: string;
  modalClasses?: string;
  modalPositionClass?: string;
  shouldHaveCrossIcon?: boolean;
  zIndex?: string;
  isInFullscreen?: boolean;
  buttonAdditionalClass?: string;
  backdropBlur?: boolean;
}) {
  const backdropClasses = backdropBlur
    ? 'bg-black/50 backdrop-blur-sm'
    : 'bg-black bg-opacity-75';
  const dialogRef = useRef<HTMLButtonElement>(null);
  const [isInFullscreenMode, setIsInFullscreenMode] = useState(false);

  const checkFullscreen = useCallback(() => {
    setIsInFullscreenMode(Boolean(document.fullscreenElement));
  }, []);

  useEffect(() => {
    checkFullscreen();
    document.addEventListener('fullscreenchange', checkFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
    };
  }, [checkFullscreen]);

  // Use the prop if provided, otherwise detect automatically
  const shouldRenderInFullscreen = isInFullscreen || isInFullscreenMode;

  // If in fullscreen mode, render the modal inline instead of using portal
  if (shouldRenderInFullscreen) {
    return (
      <Transition.Root show={isOpen} as={Fragment}>
        <div
          className={`fixed inset-0 ${zIndex} flex items-center justify-center`}>
          <Transition.Child as={Fragment} {...backdropTransition}>
            <div
              className={`absolute inset-0 ${backdropClasses} transition-opacity`}
            />
          </Transition.Child>

          <Transition.Child as={Fragment} {...modalTransition}>
            <div
              className={`relative transform overflow-hidden bg-white rounded-lg px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:p-6 ${containerAdditionalClasses}`}>
              {shouldHaveCrossIcon && (
                <CloseButton
                  onClose={onClose}
                  dialogRef={dialogRef as React.RefObject<HTMLButtonElement>}
                  additionalClass={buttonAdditionalClass}
                />
              )}
              {children}
            </div>
          </Transition.Child>
        </div>
      </Transition.Root>
    );
  }

  // Normal portal-based rendering for non-fullscreen mode
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        initialFocus={dialogRef}
        as="div"
        className={`relative ${zIndex}`}
        onClose={onClose}>
        <Transition.Child as={Fragment} {...backdropTransition}>
          <div
            className={`fixed inset-0 ${backdropClasses} transition-opacity`}
          />
        </Transition.Child>

        <div
          className={`fixed inset-0 z-10 flex min-h-screen items-center justify-center overflow-hidden p-4 sm:p-6 ${modalClasses}`}>
          <div
            className={classNames(
              'flex min-h-0 w-full max-w-full flex-1 items-center justify-center',
              modalPositionClass,
            )}>
            <Transition.Child as={Fragment} {...modalTransition}>
              <Dialog.Panel
                className={`relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:p-6 ${containerAdditionalClasses}`}>
                {shouldHaveCrossIcon && (
                  <CloseButton
                    onClose={onClose}
                    dialogRef={dialogRef as React.RefObject<HTMLButtonElement>}
                    additionalClass={buttonAdditionalClass}
                  />
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default memo(Modal);
