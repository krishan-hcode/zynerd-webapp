import type {IAddress} from '@/account/types';
import type React from 'react';

export interface IAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: unknown;
}

export interface IConfirmAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onEdit?: () => void;
  address?: IAddress;
}

export interface IAccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface IProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: unknown;
}

export interface MenuItem {
  icon: React.ComponentType<{className?: string}>;
  label: string;
  onClick: () => void;
}

export interface IProfileField {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  editable: boolean;
}
