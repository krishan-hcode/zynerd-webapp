import {
  AUTH_TOKEN_KEY,
  BASE_URL,
  collegeStates,
  UPDATE_USER_PROFILE_PATH,
  USER_DATA_KEY,
  validateFile,
} from '@/constants';
import {
  BirthdayIcon,
  InfoIcon,
  LocationIcon,
  MailIcon,
  PencilIcon,
  PhoneIcon,
  ProfileWithoutBGIcon,
  UserNameIcon,
  WhatsAppBlankIcon,
} from '@/elements/Icons';
import {IUserData, UserContext} from '@/global/UserContext';
import {IProfileField} from '@/qbank/types';
import {fetchHelper, showToast} from '@/utils/helpers';
import {PlusIcon} from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import {updateUserData} from 'lib/redux/slices/userSlice';
import {RootState} from 'lib/redux/store';
import Image from 'next/image';
import {useContext, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AddressModal from './AddressModal';
import ProfileEditModal from './ProfileEditModal';
const EditProfileForm = () => {
  const userData = useSelector((state: RootState) => state.user.userInfo);
  const dispatch = useDispatch();
  const {setUserData} = useContext(UserContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<IProfileField[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const hasProfilePhoto = selectedImage || userData?.image_file;
  // Profile field configuration
  const getProfileFieldConfig = () => [
    {
      id: 'fullName',
      label: 'Full Name',
      value: userData?.first_name + ' ' + userData?.last_name || '',
      icon: <UserNameIcon />,
      editable: true,
    },
    {
      id: 'email',
      label: 'Email Address',
      value: userData?.email || '',
      icon: <MailIcon />,
      editable: false,
    },
    {
      id: 'mobile',
      label: 'Mobile Number',
      value: userData?.phone_number || '',
      icon: <PhoneIcon />,
      editable: false,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Number',
      value: userData?.whatsapp_no || '',
      icon: <WhatsAppBlankIcon />,
      editable: true,
    },
    {
      id: 'birthday',
      label: 'Birthday',
      value:
        userData && userData.birth_date && dayjs(userData.birth_date).isValid()
          ? dayjs(userData.birth_date).format('DD MMM, YYYY')
          : '',
      icon: <BirthdayIcon />,
      editable: true,
    },
  ];
  // Upload image function
  const uploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!authToken) {
        showToast(
          'error',
          'Authentication token not found. Please login again.',
        );
        return;
      }
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image_file', file);
      // Make API call to update profile image
      const response = await fetchHelper(
        BASE_URL + UPDATE_USER_PROFILE_PATH,
        'PATCH',
        formData,
      );
      if (response.status === 200 && response.data) {
        const updatedImageFile = response.data.image_file;
        const newData = {
          ...userData,
          image_file: updatedImageFile,
        } as IUserData;
        // Update Redux store
        dispatch(updateUserData(newData));
        // Update context
        setUserData && setUserData(newData);
        // Update localStorage
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(newData));
        showToast('success', 'Profile image updated successfully');
        // Reset the selected image and file
        setSelectedImage(null);
        setSelectedFile(null);
      } else {
        showToast('error', 'Failed to update profile image. Please try again.');
      }
    } catch (error: any) {
      showToast('error', 'Something went wrong. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  // Handle file selection
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }
    // Store the file for upload
    setSelectedFile(file);
    // Create preview URL
    const reader = new FileReader();
    reader.onload = e => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    // Automatically upload the image
    await uploadImage(file);
  };
  // Handle Add Photo button click
  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };
  // Handle image upload (for manual save button)
  const handleImageUpload = async () => {
    if (!selectedFile) return;
    await uploadImage(selectedFile);
  };
  // Handle edit field click
  const handleEditField = () => {
    setIsModalOpen(true);
  };
  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setActiveFieldId(null);
  };
  // Update profile data when userData changes
  useEffect(() => {
    if (userData) {
      setProfileData(getProfileFieldConfig());
    }
  }, [userData]);
  const handleAddAddressClick = () => {
    setIsAddressModalOpen(true);
  };
  const handleAddressModalClose = () => {
    setIsAddressModalOpen(false);
  };
  // Helper function to check if address has valid data
  const hasValidAddress = (address: any) => {
    return (
      address &&
      (address.address1?.trim() ||
        address.address2?.trim() ||
        address.city?.trim() ||
        String(address.pincode || '').trim() ||
        address.country_state)
    );
  };
  // Helper function to format address display
  const formatAddressDisplay = (address: any) => {
    const stateName = collegeStates.find(
      s => s.key === address.country_state,
    )?.name;
    return `${address.address1}, ${address.address2}, ${address.city}, ${stateName} - ${address.pincode}`;
  };
  // Render address section based on data availability
  const renderAddressSection = () => {
    const address = userData?.address_info?.[0];
    if (hasValidAddress(address)) {
      return (
        <div>
          <div className="text-lightBlue-900 font-sauce text-xs mb-2">
            {formatAddressDisplay(address)}
          </div>
          <div className="bg-secondary-purple/10 p-3 rounded-lg flex items-center space-x-2">
            <div className="flex items-start space-x-2">
              <InfoIcon className="w-4 h-4 text-customGray-80" />
              <p className="text-xxs text-customGray-80 font-openSauceOneMedium">
                Please reach out to us for changing the address for Notes
                Delivery.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return (
      <button
        onClick={handleAddAddressClick}
        className="text-lightBlue-400 font-sauce text-sm hover:text-lightBlue-500 transition-colors">
        + Add Address
      </button>
    );
  };
  return (
    <div className="bg-white rounded-2xl p-6 h-full">
      {/* Profile Photo Section */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="relative">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt="Profile Preview"
              width={64}
              height={64}
              className="w-16 h-16 rounded-xl object-cover"
            />
          ) : userData?.image_file ? (
            <Image
              src={userData.image_file}
              alt="Profile"
              width={64}
              height={64}
              className="w-16 h-16 rounded-xl object-cover"
            />
          ) : (
            <ProfileWithoutBGIcon className="w-16 h-16 text-white" />
          )}
        </div>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleAddPhotoClick}
            disabled={isUploading}
            className="flex items-center space-x-2 px-4 py-2 border border-lightBlue-400 text-lightBlue-400 rounded-lg hover:bg-lightBlue-50 transition-colors font-sauce disabled:opacity-50 disabled:cursor-not-allowed">
            {hasProfilePhoto ? (
              <PencilIcon className="w-5 h-5 text-customGray-90" />
            ) : (
              <PlusIcon className="w-5 h-5 text-lightBlue-400" />
            )}
            <span className="text-sm text-gray-90 font-inter font-medium">
              {hasProfilePhoto ? 'Edit Photo' : 'Add Photo'}
            </span>
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-end">
        <button
          onClick={() => handleEditField()}
          className="flex items-center space-x-1 flex-shrink-0 text-lightBlue-800 hover:text-lightBlue-900 text-sm font-inter font-medium py-2 rounded-lg transition-colors">
          <PencilIcon className="w-5 h-5" />
          <span>Edit</span>
        </button>
      </div>
      {/* Profile Fields */}
      <div className="space-y-6">
        {profileData.map(field => (
          <div
            key={field.id}
            className="flex items-center space-x-4 border-b border-gray-200 pb-4">
            <div className="flex-shrink-0">{field.icon}</div>
            <div className="flex-1">
              <label className="block text-xs text-gray-60 font-medium font-sauce mb-1">
                {field.label}
              </label>
              <div className="text-lightBlue-900 font-sauce text-xs">
                {field.value}
              </div>
            </div>
          </div>
        ))}
        {/* Address Section */}
        <div className="flex items-start space-x-4 border-b border-gray-200 pb-4">
          <div className="flex-shrink-0 mt-1">
            <LocationIcon />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-60 font-medium font-sauce mb-1">
              Address for Notes Delivery
            </label>
            {renderAddressSection()}
          </div>
        </div>
      </div>
      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        userData={userData}
      />
      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={handleAddressModalClose}
        userData={userData}
      />
    </div>
  );
};
export default EditProfileForm;
