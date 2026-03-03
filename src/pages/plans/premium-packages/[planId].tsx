import DataResetConfirmationModal from '@/common/DataResetConfirmationModal';
import Loader from '@/common/Loader';
import {
  AUTH_TOKEN_KEY,
  BASE_URL,
  COUPON_LIST_PATH,
  errorMessage,
  GET_PREMIUM_PLANS_PATH,
  ORDER_PATH,
  RAZORPAY_PAYMENT_SUCCESS_PATH,
} from '@/constants';
import Button from '@/elements/Button';
import {RazorpayIcon} from '@/elements/Icons';
import ScreenLoader from '@/global/ScreenLoader';
import {UserContext} from '@/global/UserContext';
import UserAddressModal from '@/modals/userAddressModal';
import {ICollection, ICouponList} from '@/types/premium-packages.types';
import {
  createRazorpayOption,
  fetchHelper,
  getCurrencySymbol,
  getSubscriptionEndDate,
  IRazorpaySuccessResponse,
  isIndianCurrency as isCurrencyIndian,
  removeAuthStoredData,
  showToast,
} from '@/utils/helpers';
import {
  getStyledParsedHTML,
  metaConversionEvent,
  setGtagUserData,
  triggerGoogleConversionEvent,
} from '@/utils/utils';
import {RadioGroup} from '@headlessui/react';
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TicketIcon,
} from '@heroicons/react/20/solid';
import {ChevronRightIcon, XMarkIcon} from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import {useRouter} from 'next/router';
import {useContext, useEffect, useState} from 'react';

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

export const generateCouponCodeErrorMessage = (
  couponCode: string,
  message: string = 'Enter a valid coupon code',
) => {
  const couponCodeLength = couponCode.length;
  if (couponCodeLength === 0) {
    return 'Enter a coupon';
  } else if (couponCodeLength < 4) {
    return 'Please add atleast 4 characters';
  } else {
    return message;
  }
};

const PlansPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [selectedCollection, setSelectedCollection] =
    useState<ICollection | null>(null);

  const [couponCodeList, setCouponCodeList] = useState([]);
  const [couponCodeInput, setCouponCodeInput] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  const [proceedToPayment, setProceedToPayment] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [subscriptionId, setSubscriptionId] = useState('');
  const [isAdressModalOpen, setIsAdressModalOpen] = useState(false);
  const [isDataResetModalOpen, setIsDataResetModalOpen] = useState(false);
  const [dataResetAcknowledged, setDataResetAcknowledged] = useState<
    boolean | null
  >(null);

  const [isIndianCurrency, setIsIndianCurrency] = useState(true);

  // Checks and returns the discounted price key based on the region
  const discountedPriceKey = isIndianCurrency
    ? 'discounted_price'
    : 'discounted_price_usd';

  const actualPriceKey = isIndianCurrency ? 'actual_price' : 'actual_price_usd';

  const [isCouponListVisible, setIsCouponListVisible] =
    useState<boolean>(false);

  const router = useRouter();

  const {email, userData} = useContext(UserContext);
  const [region, setRegion] = useState('');
  const [symbolToDisplay, setSymbolToDisplay] = useState('');

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Example: "America/New_York" → "America"
    const regionData = timezone?.split('/')[0];
    if (!userData) {
      setRegion(regionData);
    }
  }, [userData]);

  // Check if user is logged in before proceeding to payment
  const checkLoginAndRedirect = () => {
    const authToken = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!authToken) {
      // Save current URL for redirect after login
      localStorage.setItem('REDIRECT_AFTER_LOGIN', router.asPath);
      // Redirect to login page
      router.push('/login');
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (userData) {
      setGtagUserData(userData);
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      setIsIndianCurrency(isCurrencyIndian());
    }
  }, [userData]);

  const displayRazorpay = async (orderPayload: any) => {
    try {
      if (!(window as any).Razorpay) {
        showToast('error', 'Razorpay SDK failed to load. Are you online?');
        return;
      }
      if (selectedCollection) {
        const options = createRazorpayOption({
          subjectName: selectedCollection.name,
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
                    (selectedCollection.plans[selectedPlan]?.[
                      discountedPriceKey
                    ] -
                      couponDiscount) *
                    100,
                },
              );
              if (razorpayResponse.status === 201) {
                setSubscriptionId(razorpayResponse.data?.subscription_id || '');

                triggerGoogleConversionEvent({
                  amount: orderPayload.amount,
                  currency: orderPayload.currency,
                  razorpay_payment_id: response.razorpay_payment_id,
                  PlanId: selectedPlanId,
                });
                metaConversionEvent({
                  amount: orderPayload.amount,
                  currency: orderPayload.currency,
                  razorpay_payment_id: response.razorpay_payment_id,
                  PlanId: selectedPlanId,
                });

                // @ts-ignore
                window.gtag(
                  'plan_purchased',
                  JSON.stringify({
                    userId: userData?.id,
                    subjectName: selectedCollection.name,
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

  const getCollectionPlans = async () => {
    try {
      const response = await fetchHelper(
        BASE_URL + GET_PREMIUM_PLANS_PATH + `${router.query.planId}`,
        'GET',
      );
      if (response.status === 200 && response.data) {
        const sortedplans = response.data?.plans?.toSorted((a: any, b: any) => {
          if (a.type === 'extension') {
            return b.type === 'extension' ? 0 : -1;
          } else {
            return b.type === 'extension' ? 1 : 0;
          }
        });
        setSelectedCollection({...response.data, plans: sortedplans});
        setSelectedPlanId(response.data?.plans[0]?.id);
      } else {
        throw new Error('unable to fetch premium plans');
      }
    } catch (error) {
      showToast('error', 'Something went wrong');
    }
  };

  useEffect(() => {
    if (router.isReady && router.query.planId) {
      getCollectionPlans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.planId]);

  useEffect(() => {
    const selectedPlanData = selectedCollection?.plans?.[selectedPlan];

    if (
      selectedPlanData?.is_referral_code_applicable === true &&
      selectedCollection?.referral_code &&
      router.query.planId &&
      !couponDiscount // Only apply if no coupon is already set
    ) {
      applyCouponCode(selectedCollection.referral_code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan, router.query.planId, selectedCollection]);

  useEffect(() => {
    if (proceedToPayment) {
      createPaymentOrder(selectedPlanId);
    }
  }, [proceedToPayment]);

  const createPaymentOrder = async (
    planId: string,
    acknowledgement: boolean = false,
  ) => {
    setProceedToPayment(false);
    const basePayload = couponDiscount
      ? {
          student: userData?.user,
          coupon_code: couponCodeInput,
          plan: planId,
          currency: isIndianCurrency ? 'INR' : 'USD',
        }
      : {
          student: userData?.user,
          plan: planId,
          currency: isIndianCurrency ? 'INR' : 'USD',
        };

    // Add data reset acknowledgement field if provided
    const orderPayload = {
      ...basePayload,
      ...(acknowledgement
        ? {data_reset_acknowledgement: true}
        : {show_data_reset_acknowledgement: false}),
    };

    const response = await fetchHelper(
      BASE_URL + ORDER_PATH,
      'POST',
      orderPayload,
    );

    if (response.status === 201 && response.data) {
      displayRazorpay(response.data);
    } else {
      showToast('error', 'Something went wrong. Please try again');
    }
  };

  const getCouponList = async () => {
    setIsCouponListVisible(!isCouponListVisible);
    if (selectedPlanId) {
      const response = await fetchHelper(
        BASE_URL + COUPON_LIST_PATH + '?plan_id=' + selectedPlanId,
        'GET',
      );

      if (response.status === 200 && response.data) {
        setCouponCodeList(response.data || []);
      } else if (response.status === 401) {
        removeAuthStoredData();
        showToast('error', errorMessage.LOG_OUT_MSG);
      } else {
        showToast('error', 'Something went wrong. Please try again');
      }
    }
  };

  const applyCouponCode = async (couponCode: string) => {
    const finalCouponCode = couponCode?.toUpperCase() ?? '';
    setCouponCodeInput(finalCouponCode);
    try {
      const response = await fetchHelper(
        BASE_URL +
          '/plan/' +
          `${selectedPlanId}/?coupon_code=${finalCouponCode}`,
        'GET',
      );
      if (response.status === 200 && response.data) {
        setIsCouponListVisible(false);
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
          generateCouponCodeErrorMessage(
            couponCode,
            response?.message || 'Enter a valid coupon code',
          ),
          'coupon_code_error',
        );
      }
    } catch (error) {
      showToast('error', 'Something went wrong', 'coupon_code');
    }
  };

  const handleCouponRemoval = () => {
    setCouponDiscount(0);
    setCouponCodeInput('');
  };

  useEffect(() => {
    if (userData) {
      setSymbolToDisplay(getCurrencySymbol());
    } else {
      const symbol = region === 'Asia' ? '₹' : '$';
      setSymbolToDisplay(symbol);
    }
  }, [userData, region]);
  return (
    <Loader isLoading={isLoading}>
      <div>
        {selectedCollection ? (
          <div>
            <h1 className="my-6 px-8 text-2xl md:text-3xl font-semibold tracking-tight break-words text-center text-gray-900 sm:text-6xl">
              {selectedCollection.name}{' '}
            </h1>
            <hr className="mx-2 md:md:mx-20 shadow-sm" />
            <div className="grid lg:grid-cols-2">
              <div className="px-4 md:md:px-24 pb-4">
                <div className="sticky top-nav border-2 border-dashed border-skyBlue rounded-xl  mt-8 md:-ml-4 w-full min-h-[45vh] h-auto p-2 space-y-4 text-sm text-gray-500">
                  {getStyledParsedHTML(
                    selectedCollection.description || '',
                    'plans',
                  )}
                </div>
              </div>
              <RadioGroup
                value={
                  selectedPlanId
                    ? selectedPlanId
                    : selectedCollection.plans && selectedCollection.plans[0].id
                }
                onChange={(planId: string) => setSelectedPlanId(planId)}
                className="px-4 md:px-24 my-6">
                <RadioGroup.Label className="text-xs font-semibold leading-6 text-gray-900">
                  Select a plan
                </RadioGroup.Label>

                <div className="mt-4 grid grid-cols-1 xl:w-3/4 justify-items-center gap-y-6 sm:gap-x-4">
                  {Boolean(selectedCollection.plans?.length) &&
                    selectedCollection.plans.map((plan, idx) => (
                      <RadioGroup.Option
                        key={plan.id}
                        onClick={() => {
                          setSelectedPlan(idx);
                          if (idx !== selectedPlan) {
                            handleCouponRemoval();
                            setDataResetAcknowledged(null); // Reset acknowledgement when plan changes
                          }
                        }}
                        value={plan.id}
                        className={({checked, active}) =>
                          classNames(
                            checked ? 'border-transparent' : 'border-gray-300',
                            active ? 'border-cobalt ring-2 ring-cobalt' : '',
                            'relative flex cursor-pointer rounded-lg border bg-white px-3 py-5 shadow-sm focus:outline-none w-full',
                          )
                        }>
                        {({checked, active}) => (
                          <>
                            <CheckCircleIcon
                              className={classNames(
                                !checked ? 'invisible' : '',
                                'h-5 w-5 -ml-2 mr-2  text-cobalt',
                              )}
                              aria-hidden="true"
                            />
                            {plan.type === 'extension' && (
                              <span className="absolute top-0 right-0 text-xs bg-cobalt text-white px-2 rounded-tr-md rounded-bl-xl text-center w-auto">
                                Extension
                              </span>
                            )}

                            <span className="flex flex-1">
                              <span className="flex flex-col w-full">
                                <div className="flex justify-between">
                                  <div>
                                    <RadioGroup.Label
                                      as="span"
                                      className="block text-sm font-bold text-gray-900">
                                      {plan.name}
                                    </RadioGroup.Label>
                                    <p className="text-xs text-GREEN">
                                      {'Valid till ' +
                                        dayjs(
                                          getSubscriptionEndDate(plan.duration),
                                        ).format('DD MMM YYYY')}
                                    </p>
                                  </div>
                                  {/* actual price */}
                                  <div className="flex flex-col items-end">
                                    <RadioGroup.Description
                                      as="span"
                                      className="text-xs font-medium text-gray-900">
                                      {symbolToDisplay}
                                      {plan[discountedPriceKey]}{' '}
                                    </RadioGroup.Description>
                                    <RadioGroup.Description
                                      as="del"
                                      className="text-xs font-medium text-gray-900">
                                      {symbolToDisplay}
                                      {plan[actualPriceKey]}{' '}
                                    </RadioGroup.Description>
                                  </div>
                                </div>
                              </span>
                            </span>

                            <span
                              className={classNames(
                                active ? 'border' : 'border-2',
                                checked
                                  ? 'border-cobalt'
                                  : 'border-transparent',
                                'pointer-events-none absolute -inset-px rounded-lg',
                              )}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                </div>
                {userData &&
                  isIndianCurrency &&
                  selectedCollection.show_coupon_section && (
                    <div className="flex flex-col mt-4 xl:w-3/4">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold leading-6 text-gray-900">
                          Add coupon code
                        </label>
                        <button
                          onClick={getCouponList}
                          className="text-xs text-cobalt font-medium flex">
                          <TicketIcon className="inline text-cobalt w-4 mr-1" />{' '}
                          Check Offers
                          {isCouponListVisible ? (
                            <ChevronUpIcon className="w-4" />
                          ) : (
                            <ChevronDownIcon className="w-4" />
                          )}
                        </button>
                      </div>
                      {/* Coupon code list section start */}
                      {Boolean(couponCodeList.length) &&
                        isCouponListVisible && (
                          <div className="max-h-[30vh] pr-4 thin-scrollbar overflow-y-scroll scale-up-animation space-y-3 my-4">
                            {couponCodeList.map((coupon: ICouponList) => (
                              <div
                                onClick={() => applyCouponCode(coupon.code)}
                                key={coupon.id}
                                className="cursor-pointer flex justify-between px-4 py-2 border-dashed border-2 rounded-md">
                                <p>{coupon.code}</p>
                                <button className="text-cobalt text-xs font-semibold">
                                  Select
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      {/* Coupon code list section start */}

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
                          } block px-2 uppercase w-full rounded-md border-0 ring-gray-200 py-3 text-gray-900 shadow-sm ring-2 ring-inset placeholder:text-gray-400 focus:ring-0 focus:border-cobalt focus:ring-cobalt sm:text-sm sm:leading-6`}
                          placeholder="Enter coupon code"
                        />
                        {Boolean(couponDiscount) ? (
                          <XMarkIcon
                            onClick={() => {
                              handleCouponRemoval();
                            }}
                            className="w-5 absolute top-[27%] right-2 text-cobalt cursor-pointer"
                          />
                        ) : (
                          <button
                            onClick={() => applyCouponCode(couponCodeInput)}
                            className="text-sm absolute top-[27%] right-0.5 text-cobalt">
                            Apply coupon&nbsp;
                            <ChevronRightIcon className="inline-block w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                {/* Price summary section start */}
                {/* <hr className="my-4 md:w-3/4" /> */}
                <div className="border-t-2 pt-2 mt-6 space-y-2 text-sm md:w-3/4 ">
                  <p className="font-semibold">Price summary</p>
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>
                      {symbolToDisplay}
                      {selectedCollection.plans[selectedPlan]?.[actualPriceKey]}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-500">Plan Discount</p>
                    <p className="text-GREEN">
                      -{symbolToDisplay}
                      {selectedCollection.plans[selectedPlan]?.[
                        actualPriceKey
                      ] -
                        selectedCollection.plans[selectedPlan]?.[
                          discountedPriceKey
                        ]}
                    </p>
                  </div>
                  {Boolean(couponDiscount) && (
                    <div className="flex justify-between">
                      <p className="text-gray-500">Coupon Discount</p>
                      <p className="text-GREEN">
                        -{symbolToDisplay}
                        {couponDiscount}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <p className="font-semibold">Final Price</p>
                    <p className="font-semibold">
                      {symbolToDisplay}
                      {selectedCollection.plans[selectedPlan]?.[
                        discountedPriceKey
                      ] - couponDiscount}
                    </p>
                  </div>
                </div>
                {/* Price summary section end */}
                {selectedCollection.capture_address && (
                  <p className="mt-8 text-[#F23535] text-sm font-bold">
                    **(Please fill the address post payment for Notes delivery)
                  </p>
                )}
                <div className="md:w-3/4 justify-center flex mt-4">
                  <Button
                    onClick={() => {
                      // Check if user is logged in first
                      if (!checkLoginAndRedirect()) {
                        return;
                      }

                      const selectedPlan = selectedCollection?.plans.find(
                        plan => plan.id === selectedPlanId,
                      );
                      // First check if address modal is required
                      if (
                        selectedCollection.capture_address &&
                        selectedPlan?.type !== 'extension'
                      ) {
                        setIsAdressModalOpen(true);
                      } else {
                        // If no address needed, check for data reset acknowledgement
                        const showDataResetAck =
                          selectedPlan?.show_data_reset_acknowledgement;
                        if (showDataResetAck) {
                          setIsDataResetModalOpen(true);
                        } else {
                          createPaymentOrder(selectedPlanId);
                        }
                      }
                    }}
                    variant="secondary"
                    additionalClasses=" hover:text-white hover:bg-cobalt w-auto flex justify-center py-3 text-xs">
                    Pay {symbolToDisplay}
                    {selectedCollection.plans[selectedPlan]?.[
                      discountedPriceKey
                    ] - couponDiscount || ''}
                    &nbsp;&nbsp;&nbsp;
                    <RazorpayIcon />
                  </Button>
                </div>
              </RadioGroup>
            </div>
            <UserAddressModal
              isOpen={isAdressModalOpen}
              setIsOpen={setIsAdressModalOpen}
              createPaymentOrder={async (planId: string) => {
                // After address is saved, check if data reset acknowledgement is needed
                const currentPlan = selectedCollection?.plans.find(
                  plan => plan.id === planId,
                );
                const showDataResetAck =
                  currentPlan?.show_data_reset_acknowledgement;
                if (showDataResetAck) {
                  setIsDataResetModalOpen(true);
                } else {
                  await createPaymentOrder(planId);
                }
              }}
              selectedPlanId={selectedPlanId}
            />

            <DataResetConfirmationModal
              isModalOpen={isDataResetModalOpen}
              setIsModalOpen={setIsDataResetModalOpen}
              heading="Data Reset Confirmation"
              content="Do you want to reset current Data Progress?"
              yesButtonText="Yes"
              noButtonText="No"
              onYesClick={() => {
                setIsDataResetModalOpen(false);
                setDataResetAcknowledged(true);
                createPaymentOrder(selectedPlanId, true);
              }}
              onNoClick={() => {
                setIsDataResetModalOpen(false);
                setDataResetAcknowledged(false);
                createPaymentOrder(selectedPlanId, false);
              }}
            />
          </div>
        ) : (
          <ScreenLoader />
        )}
      </div>
    </Loader>
  );
};

export default PlansPage;
