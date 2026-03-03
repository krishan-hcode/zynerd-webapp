import {WebSiteLink} from '@/constants';
import {useRouter} from 'next/router';

const Footer = () => {
  const router = useRouter();

  return (
    <div className="bg-primary-blue/5 border border-primary-blue/20 rounded-2xl p-4 my-3 mb-10 w-full md:mb-2 flex flex-col justify-between">
      <span className="text-base text-primary-dark font-openSauceOneSemibold mb-4">
        Quick Links
      </span>
      <div className="flex flex-row justify-between">
        <div>
          <span
            className="text-sm font-interMedium text-customGray-80 mb-3 cursor-pointer block"
            onClick={() => window?.open(WebSiteLink.privacyPolicy, '_blank')}>
            Privacy Policy
          </span>
          <span
            className="text-sm font-interMedium text-customGray-80  mb-3 cursor-pointer block"
            onClick={() =>
              window?.open(WebSiteLink.cancellationPolicy, '_blank')
            }>
            Cancellation Policy
          </span>
          <span
            className="text-sm font-interMedium text-customGray-80  mb-3 cursor-pointer block"
            onClick={() => router.push('/faqs')}>
            FAQs
          </span>
        </div>
        <div>
          <span
            className="text-sm font-interMedium text-customGray-80  mb-3 cursor-pointer block"
            onClick={() => window?.open(WebSiteLink.termsConditions, '_blank')}>
            Terms & Conditions
          </span>
          <span
            className="text-sm font-interMedium text-customGray-80  mb-3 cursor-pointer block"
            onClick={() => window?.open(WebSiteLink.aboutUs, '_blank')}>
            About Us
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
