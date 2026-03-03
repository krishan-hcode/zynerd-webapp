import {getStoreUrl, shareMessage} from '@/constants';
import {showToast} from '@/utils/helpers';
import {useAppSelector} from 'lib/redux/hooks/appHooks';

export const useShareApp = () => {
  const userInfo = useAppSelector(state => state.user.userInfo);
  const shareApp = async () => {
    try {
      const referralCode = userInfo?.referral_code || 'CEREBELLUM';
      const storeUrl = getStoreUrl();
      const message = shareMessage(referralCode, storeUrl);

      // Check if Web Share API is supported (Chrome, Safari)

      if (navigator.share) {
        await navigator.share({
          title: 'Cerebellum - NEET PG Preparation App',
          text: message,
          url: storeUrl,
        });
      } else {
        // Fallback: Copy to clipboard and show alert

        await navigator.clipboard.writeText(storeUrl);
        showToast(
          'success',
          'App link copied to clipboard! You can now share it with your friends.',
        );
      }
    } catch (error: any) {
      // Final fallback: copy to clipboard
      if (error.name === 'AbortError') {
        return;
      }
      try {
        const storeUrl = getStoreUrl();

        await navigator.clipboard.writeText(storeUrl);
        showToast('success', 'App link copied to clipboard!');
      } catch {
        showToast(
          'error',
          'Unable to share. Please copy the link manually: https://play.google.com/store/apps/details?id=com.cerebellummobileapp',
        );
      }
    }
  };

  return shareApp;
};
