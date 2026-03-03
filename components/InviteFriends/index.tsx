import {getStoreUrl, shareMessage} from '@/constants';
import {showToast} from '@/utils/helpers';
import Image from 'next/image';
const InviteFriends = ({referralCode}: {referralCode: string}) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Cerebellum Academy',
          text: shareMessage(referralCode, await getStoreUrl()),
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = shareMessage(referralCode, await getStoreUrl());
        await navigator.clipboard.writeText(shareText);
        showToast('success', 'Share text copied to clipboard');
      }
    } catch (error: any) {}
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      showToast('success', 'Copied to clipboard');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = referralCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast('success', 'Copied to clipboard');
    }
  };

  //   const shareImage = inviteFriendsGif;

  return (
    <div className="bg-primary-blue/5 border border-primary-blue/20 rounded-2xl p-4 my-3 w-full">
      <div className="flex flex-row justify-between">
        <div className="flex items-center mb-3 w-24 h-24">
          <Image
            width={80}
            height={80}
            src={'/assets/invite-friends.gif'}
            alt="Invite friends"
            className="w-full h-full object-contain"
            style={{width: 80, height: 80}}
            unoptimized
          />
        </div>
        <div className="flex-1 ml-4">
          <p className="text-sm font-interMedium text-primary-dark  mb-2 line-clamp-2">
            Invite friends to Cerebellum Academy and learn together!
          </p>

          <button
            className="bg-primary-blue w-full rounded-2xl py-3.5 px-5 flex flex-row items-center justify-center mb-5"
            onClick={handleShare}>
            <Image
              src="/assets/Share.svg"
              alt="Share App"
              width={20}
              height={20}
            />
            <span className="text-white text-sm font-interSemibold ml-2">
              Share App
            </span>
          </button>
        </div>
      </div>

      <div className="bg-primary-blue/5 flex flex-row justify-between items-center p-3 rounded-xl">
        <div>
          <p className="text-xs text-customGray-70 font-openSauceOneMedium">
            Referral Code
          </p>
          <div className="flex flex-row justify-between items-center">
            <p className="font-openSauceOneMedium text-base mt-1 text-primary-blue tracking-wide">
              {referralCode}
            </p>
          </div>
        </div>
        <button
          className="bg-white border border-customGray-20 rounded-xl py-3 px-4 flex flex-row items-center"
          onClick={handleCopyCode}>
          <Image
            src="/assets/Copy.svg"
            alt="Copy Code"
            width={20}
            height={20}
          />
          <span className="text-customGray-90 text-sm font-interMedium ml-1">
            Copy Code
          </span>
        </button>
      </div>
    </div>
  );
};

export default InviteFriends;
