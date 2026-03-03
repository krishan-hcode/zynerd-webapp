import AddressInfo, {IAddressInfo} from '@/account/addressInfo';
import Loader from '@/common/Loader';
import Modal from '@/common/Modal';
import {
  GET_ALL_COUPON_LIST,
  GET_NOTES_LIST,
  NOTES_STATIC_IMAGE_PATH,
  RAZORPAY_PAYMENT_SUCCESS_PATH,
  VERIFY_EXCLUSIVE_COUPONS,
  errorMessage,
} from '@/constants';
import Button from '@/elements/Button';
import Illustrations from '@/elements/Illustrations';
import {UserContext} from '@/global/UserContext';
import {INotes} from '@/types/plans-only-notes.types';
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
  getStyledParsedHTML,
  metaConversionEvent,
  setGtagUserData,
  triggerGoogleConversionEvent,
} from '@/utils/utils';
import {NoSymbolIcon, XMarkIcon} from '@heroicons/react/24/outline';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useCallback, useContext, useEffect, useState} from 'react';
import {generateCouponCodeErrorMessage} from '../premium-packages/[planId]';

const OnlyNotesList = () => {
  const router = useRouter();
  const {userData, email} = useContext(UserContext);
  const [onlyNotesList, setOnlyNotesList] = useState<INotes[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState<boolean>(false);
  const [addressInfo, setAddressInfo] = useState<IAddressInfo>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Coupon states
  const [couponCodeList, setCouponCodeList] = useState([]);
  const [couponCodeInput, setCouponCodeInput] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [selectedNote, setSelectedNote] = useState<INotes | null>(null);

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
      if (!selectedNote?.id || !couponCode) {
        return showToast(
          'error',
          'Please enter a valid coupon code',
          'invalid_coupon',
        );
      }
      const response = await fetchHelper(
        BASE_URL +
          VERIFY_EXCLUSIVE_COUPONS(String(selectedNote?.id || ''), couponCode),
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

  const getNotesList = useCallback(async () => {
    const response = await fetchHelper(BASE_URL + GET_NOTES_LIST, 'GET');
    if (response.status === 200 && response.data) {
      const filteredNotes = response.data.filter(
        (content: INotes) => content.event_type === 'notes',
      );
      setOnlyNotesList(filteredNotes);
    }
  }, []);

  const getAllCouponsList = useCallback(async () => {
    const response = await fetchHelper(
      BASE_URL +
        GET_ALL_COUPON_LIST('event_id', String(selectedNote?.id || '')),
      'GET',
    );
    if (response.status === 200 && response.data) {
      setCouponCodeList(response.data);
    }
  }, [selectedNote?.id]);

  useEffect(() => {
    getNotesList();
  }, [getNotesList]);

  const displayRazorpay = async (orderPayload: any) => {
    try {
      if (!(window as any).Razorpay) {
        showToast('error', 'Razorpay SDK failed to load. Are you online?');
        return;
      }
      if (selectedNote) {
        const options = createRazorpayOption({
          subjectName: selectedNote.name,
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
                    (couponDiscount || selectedNote?.discounted_price!) * 100,
                },
              );
              if (razorpayResponse.status === 201) {
                triggerGoogleConversionEvent({
                  amount: orderPayload.amount,
                  currency: orderPayload.currency,
                  razorpay_payment_id: response.razorpay_payment_id,
                  PlanId: selectedNote.id,
                });
                metaConversionEvent({
                  amount: orderPayload.amount,
                  currency: orderPayload.currency,
                  razorpay_payment_id: response.razorpay_payment_id,
                  PlanId: selectedNote.id,
                });

                // @ts-ignore
                window.gtag(
                  'notes_purchased',
                  JSON.stringify({
                    userId: userData?.id,
                    subjectName: selectedNote.name,
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
      String(selectedNote?.id || ''),
      couponDiscount ? couponCodeInput : '',
      'INR',
      true,
      addressInfo,
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
        Only Notes
      </h1>
      <Modal containerAdditionalClasses="max-w-3xl" isOpen={isModalOpen}>
        <AddressInfo
          closeModal={() => setIsModalOpen(false)}
          handleSubmit={payload => {
            setAddressInfo(payload);
            setIsModalOpen(false);
            getAllCouponsList();
            setIsCouponModalOpen(true);
          }}
        />
      </Modal>
      <Modal
        containerAdditionalClasses="max-w-lg"
        shouldHaveCrossIcon={true}
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}>
        <div>
          <h2 className="text-center font-semibold text-2xl">
            {selectedNote?.name}
          </h2>
          {selectedNote?.show_coupon_section && (
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
              {selectedNote?.discounted_price! - couponDiscount}
            </Button>
          </div>
        </div>
      </Modal>
      <Loader isLoading={isLoading}>
        <Illustrations />
        <Head>
          <title>Only Notes – Cerebellum Academy</title>
        </Head>
        {onlyNotesList?.length ? (
          <div className="relative z-40 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:p-12">
            {onlyNotesList.map(notes => (
              <NotesAndEventsCard
                key={notes.id}
                imageSrc={notes.thumbnail ?? NOTES_STATIC_IMAGE_PATH}
                plan={notes}
                handleOnClick={() => {
                  setSelectedNote(notes);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="mt-20 min-h-[50vh] bg-white rounded-xl max-w-4xl mx-auto flex flex-col justify-center items-center">
            <NoSymbolIcon className="w-8" />
            <p className="mb-2 font-semibold">No notes found</p>
            <Link className="underline text-gray-600 text-sm" href="/">
              Home
            </Link>
          </div>
        )}
      </Loader>
    </div>
  );
};

export default OnlyNotesList;

export const NotesAndEventsCard = ({
  imageSrc,
  plan,
  handleOnClick,
  disableBuyButton = false,
  btnText = 'Buy Now',
}: {
  imageSrc: string;
  disableBuyButton?: boolean;
  plan: INotes;
  handleOnClick: () => void;
  btnText?: string;
}) => {
  return (
    <div className="rounded-xl overflow-hidden space-y-2 bg-white shadow-xl">
      <div className="h-64 w-full bg-slate-300 ">
        <img
          width={200}
          height={200}
          alt={plan.name}
          src={imageSrc}
          className={`w-full object-contain  ${
            plan.thumbnail ? ' h-64 ' : ' w-36 h-full m-auto '
          }`}
        />
      </div>
      <div className="px-4">
        <h2 className="font-bold text-xl">{plan.name}</h2>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center justify-center bg-gray-100 px-4 py-4 my-4 rounded-xl">
            <p className="text-4xl font-bold">₹&nbsp;{plan.discounted_price}</p>
          </div>
          <Button
            onClick={() => handleOnClick()}
            variant="secondary"
            additionalClasses=" !text-cobalt border-2 border-cobalt !bg-white hover:!text-white hover:!bg-cobalt flex justify-center rounded-lg h-12 text-lg"
            disabled={disableBuyButton}>
            {btnText}
          </Button>
        </div>
        <p className="text-sm py-6 my-4 thin-scrollbar max-h-[9em] overflow-y-scroll">
          {getStyledParsedHTML(plan.description || '')}
        </p>
      </div>
    </div>
  );
};
