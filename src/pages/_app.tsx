import UserContextHook from '@/global/UserContext';
import Layout from '@/Layout';
import '@/lib/firebase/initFirebase';
import '@/styles/fonts.css';
import '@/styles/globals.css';
import {
  GOOGLE_ADS_ID,
  GOOGLE_ANALYTICS_ID,
  GOOGLE_TAG_MANAGER_ID,
  META_PIXEL_ID,
  RECAPTCHA_SITE_KEY,
} from '@/utils/config';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {persistor, store} from 'lib/redux/store';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import {useEffect} from 'react';
import {GoogleReCaptchaProvider} from 'react-google-recaptcha-v3';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import '../css/zoom-image.css';
import '../styles/fonts.css';
export const queryClient = new QueryClient();
export default function App({Component, pageProps}: AppProps) {
  useEffect(() => {
    if (document) {
      document.addEventListener(
        'contextmenu',
        function (e) {
          e.preventDefault();
        },
        false,
      );
    }
  }, []);
  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      <Provider store={store}>
        <Head>
          <title>Cerebellum Academy - Get The Balance Right</title>
          <meta name="description" content="Welcome to Cerebellum Academy " />
          <meta
            property="og:image"
            content="https://cerebellum-web-static-dev.s3.ap-south-1.amazonaws.com/static/admin/img/logo.png"
          />
          <meta
            property="og:url"
            content="https://dashboard.cerebellumacademy.com/"
          />
          <meta
            property="og:title"
            content="Cerebellum Academy - Get The Balance Right"
          />
          <meta
            property="og:description"
            content="Welcome to cerebellum academy"
          />
          <meta
            property="twitter:image"
            content="https://cerebellum-web-static-dev.s3.ap-south-1.amazonaws.com/static/admin/img/logo.png"
          />
          <meta
            property="twitter:title"
            content="Cerebellum Academy - Get The Balance Right"
          />
          <meta
            property="twitter:description"
            content="Welcome to Cerebellum Academy"
          />
        </Head>

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS_ID}');
            gtag('config', '${GOOGLE_ADS_ID}');
          `}
        </Script>

        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${META_PIXEL_ID});
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{display: 'none'}}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>

        {/* Google Tag Manager */}
        <Script id="gtag" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer',"${GOOGLE_TAG_MANAGER_ID}");`}
        </Script>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <UserContextHook>
              <Layout>
                <Component {...pageProps} />
              </Layout>
              <noscript
                dangerouslySetInnerHTML={{
                  __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
                }}></noscript>
            </UserContextHook>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </GoogleReCaptchaProvider>
  );
}
