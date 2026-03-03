import Loader from '@/common/Loader';
import Modal from '@/common/Modal';
import {
  GET_ALL_COUPON_LIST,
  GET_NOTES_LIST,
  NOTES_STATIC_IMAGE_PATH,
  ORDER_PATH,
  RAZORPAY_PAYMENT_SUCCESS_PATH,
  VERIFY_EXCLUSIVE_COUPONS,
  errorMessage,
} from '@/constants';
import Button from '@/elements/Button';
import Illustrations from '@/elements/Illustrations';
import {UserContext} from '@/global/UserContext';
import {INotes, IOrder} from '@/types/plans-only-notes.types';
import {ICouponList} from '@/types/premium-packages.types';
import {BASE_URL} from '@/utils/config';
import {
  IRazorpaySuccessResponse,
  createOrder,
  createRazorpayOption,
  fetchHelper,
  removeAuthStoredData,
  showToast,
} from '@/utils/helpers';
import {
  metaConversionEvent,
  setGtagUserData,
  triggerGoogleConversionEvent,
} from '@/utils/utils';
import {NoSymbolIcon, XMarkIcon} from '@heroicons/react/24/outline';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useCallback, useContext, useEffect, useState} from 'react';
import {NotesAndEventsCard} from '../only-notes';
import {generateCouponCodeErrorMessage} from '../premium-packages/[planId]';

const OfflineEventsList = () => {
  const router = useRouter();
  const {userData, email} = useContext(UserContext);
  const [offlineEventsList, setOfflineEventsList] = useState<INotes[]>([]);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderList, setOrdersList] = useState<IOrder[]>([]);

  // Coupon states
  const [couponCodeList, setCouponCodeList] = useState([]);
  const [couponCodeInput, setCouponCodeInput] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<INotes | null>(null);

  const handleCouponRemoval = () => {
    setCouponDiscount(0);
    setCouponCodeInput('');
  };

  useEffect(() => {
    if (userData) {
      setGtagUserData(userData);
    }
  }, [userData]);

  const applyCouponCode = async (couponCode: string) => {
    const finalCouponCode = couponCode?.toUpperCase() ?? '';
    try {
      if (!selectedEvent?.id || !couponCode) {
        return showToast(
          'error',
          'Please enter a valid coupon code',
          'invalid_coupon',
        );
      }
      const response = await fetchHelper(
        BASE_URL +
          VERIFY_EXCLUSIVE_COUPONS(String(selectedEvent?.id || ''), couponCode),
        'GET',
      );
      if (response.status === 200 && response.data) {
        setCouponCodeInput(finalCouponCode);
        setCouponDiscount(response.data.discount_value);
        showToast(
          'success',
          'Coupon applied successfully',
          'coupon_code_success',
        );
      } else if (response.status === 401) {
        removeAuthStoredData();
        showToast('error', errorMessage.LOG_OUT_MSG);
      } else {
        handleCouponRemoval();
        showToast(
          'error',
          generateCouponCodeErrorMessage(couponCode),
          'coupon_code_error',
        );
      }
    } catch (error) {
      showToast('error', 'Something went wrong', 'coupon_code');
    }
  };

  const getOfflineEventsList = useCallback(async () => {
    const response = await fetchHelper(BASE_URL + GET_NOTES_LIST, 'GET');
    if (response.status === 200 && response.data) {
      const filteredEvents = response.data.filter(
        (content: INotes) =>
          content.event_type === 'offline_event' && content.discounted_price,
      );
      setOfflineEventsList(filteredEvents);
    }
  }, []);

  const getAllCouponsList = useCallback(async () => {
    const response = await fetchHelper(
      BASE_URL +
        GET_ALL_COUPON_LIST('event_id', String(selectedEvent?.id || '')),
      'GET',
    );
    if (response.status === 200 && response.data) {
      setCouponCodeList(response.data);
    }
  }, [selectedEvent?.id]);

  const getOrdersList = async () => {
    const response = await fetchHelper(BASE_URL + ORDER_PATH, 'GET');
    if (response.status === 200 && response.data) {
      setOrdersList(response.data);
    }
  };

  useEffect(() => {
    getOfflineEventsList();
    getOrdersList();
  }, [getOfflineEventsList]);

  const displayRazorpay = async (orderPayload: any) => {
    try {
      if (!(window as any).Razorpay) {
        showToast('error', 'Razorpay SDK failed to load. Are you online?');
        return;
      }
      if (selectedEvent) {
        const options = createRazorpayOption({
          subjectName: selectedEvent.name,
          amount: orderPayload.amount, // from BE
          currency: orderPayload.currency.toLowerCase(),
          order_id: orderPayload.razorpay_order_id,
          email: email!,
          phone_number: userData?.phone_number!,
          first_name: userData?.first_name!,
          last_name: userData?.last_name!,
          handler: async function (response: IRazorpaySuccessResponse) {
            try {
              setIsLoading(true);
              const razorpayResponse = await fetchHelper(
                BASE_URL + RAZORPAY_PAYMENT_SUCCESS_PATH,
                'POST',
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order: orderPayload.id,
                  amount:
                    (couponDiscount || selectedEvent?.discounted_price!) * 100,
                },
              );
              if (razorpayResponse.status === 201) {
                triggerGoogleConversionEvent({
                  amount: orderPayload.amount,
                  currency: orderPayload.currency,
                  razorpay_payment_id: response.razorpay_payment_id,
                  PlanId: selectedEvent.id,
                });
                metaConversionEvent({
                  amount: orderPayload.amount,
                  currency: orderPayload.currency,
                  razorpay_payment_id: response.razorpay_payment_id,
                  PlanId: selectedEvent.id,
                });

                // @ts-ignore
                window.gtag(
                  'offline_event_purchased',
                  JSON.stringify({
                    userId: userData?.id,
                    subjectName: selectedEvent.name,
                    amount: orderPayload.amount, // from BE
                    currency: orderPayload.currency,
                  }),
                );
              }
              setIsLoading(false);

              router.replace('/thankyou');
            } catch (error) {
              showToast('error', 'Something went wrong');
            }
          },
        });
        // @ts-ignore
        const razorpayPaymentObject = new window.Razorpay(options);

        razorpayPaymentObject.open();
      }
    } catch (error) {
      showToast('error', 'Something went wrong');
    }
  };

  const handleRazorpayPayment = async () => {
    const response = await createOrder(
      userData?.user!,
      String(selectedEvent?.id || ''),
      couponDiscount ? couponCodeInput : '',
      'INR',
      true,
    );

    if (response.status === 201 && response.data) {
      displayRazorpay(response.data);
    } else {
      showToast('error', 'Something went wrong. Please try again');
    }
  };

  return (
    <div className="relative py-6 md:pb-24 px-4 md:px-10 bg-slate-100 min-h-screen ">
      <h1 className="heading-text pt-3 pb-6 font-semibold tracking-tight text-center">
        Offline Events
      </h1>
      <Modal
        containerAdditionalClasses="max-w-lg"
        shouldHaveCrossIcon={true}
        onClose={() => setIsCouponModalOpen(false)}
        isOpen={isCouponModalOpen}>
        <div>
          <h2 className="text-center font-semibold text-2xl">
            {selectedEvent?.name}
          </h2>
          {selectedEvent?.show_coupon_section && (
            <>
              <h4 className="text-center font-semibold text-xl">
                Have a Coupon Code ?
              </h4>
              <div className="relative mt-2">
                <input
                  type="text"
                  name="couponCode"
                  id="couponCode"
                  maxLength={20}
                  minLength={4}
                  onChange={e => setCouponCodeInput(e.target.value)}
                  value={couponCodeInput}
                  disabled={Boolean(couponDiscount)}
                  className={`${
                    couponDiscount ? 'bg-skyBlue' : ''
                  } block px-4 uppercase w-full rounded-xl border-0 ring-gray-300 py-3 text-gray-900 shadow-sm ring-2 ring-inset placeholder:text-gray-400 placeholder:capitalize focus:ring-gray-400 sm:text-sm sm:leading-6 placeholder:text-xs md:placeholder:text-xs`}
                  placeholder="Enter coupon code"
                />
                {couponDiscount ? (
                  <XMarkIcon
                    onClick={() => {
                      handleCouponRemoval();
                    }}
                    className="w-5 absolute top-[27%] right-2 text-cobalt cursor-pointer"
                  />
                ) : (
                  <button
                    onClick={() => applyCouponCode(couponCodeInput)}
                    className="text-sm absolute top-[27%] right-0.5 text-cobalt mr-2">
                    Apply
                  </button>
                )}
              </div>
              {Boolean(couponCodeList?.length) && (
                <div className="max-h-[30vh] pr-4 thin-scrollbar overflow-y-scroll scale-up-animation space-y-3 my-4">
                  {couponCodeList.map((coupon: ICouponList) => (
                    <button
                      onClick={() => applyCouponCode(coupon.code)}
                      key={coupon.id}
                      className="w-full cursor-pointer flex justify-between px-4 py-2 border-dashed border-2 rounded-md">
                      <p>{coupon.code}</p>
                      <button className="text-cobalt text-xs font-semibold">
                        Select
                      </button>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          <div className="flex justify-center mt-4">
            <Button variant="secondary" onClick={() => handleRazorpayPayment()}>
              Pay ₹&nbsp;
              {selectedEvent?.discounted_price! - couponDiscount}
            </Button>
          </div>
        </div>
      </Modal>
      <Loader isLoading={isLoading}>
        <Illustrations />
        <Head>
          <title>Offline Events – Cerebellum Academy</title>
        </Head>
        {offlineEventsList?.length ? (
          <div className="relative z-40 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:p-12">
            {offlineEventsList.map(event => {
              const isDisabled = Boolean(
                orderList?.length &&
                orderList.some(order => order.content?.id === event.id),
              );
              return (
                <NotesAndEventsCard
                  key={event.id}
                  imageSrc={event.thumbnail ?? NOTES_STATIC_IMAGE_PATH}
                  plan={event}
                  handleOnClick={() => {
                    setSelectedEvent(event);
                    getAllCouponsList();
                    setIsCouponModalOpen(true);
                  }}
                  disableBuyButton={isDisabled}
                  btnText={isDisabled ? 'Already Enrolled' : 'Buy Now'}
                />
              );
            })}
          </div>
        ) : (
          <div className="mt-20 min-h-[50vh] bg-white rounded-xl max-w-4xl mx-auto flex flex-col justify-center items-center">
            <NoSymbolIcon className="w-8" />
            <p className="mb-2 font-semibold">No events found</p>
            <Link className="underline text-gray-600 text-sm" href="/">
              Home
            </Link>
          </div>
        )}
      </Loader>
    </div>
  );
};

export default OfflineEventsList;
