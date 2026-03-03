import Loader from '@/common/Loader';
import {BASE_URL, ORDER_PATH, RAZORPAY_PAYMENT_SUCCESS_PATH} from '@/constants';
import Button from '@/elements/Button';
import {RazorpayIcon} from '@/elements/Icons';
import ScreenLoader from '@/global/ScreenLoader';
import {UserContext} from '@/global/UserContext';
import withAuth from '@/global/WithAuth';
import {ICollection} from '@/types/premium-packages.types';
import {
  IRazorpaySuccessResponse,
  createRazorpayOption,
  fetchHelper,
  getCurrencySymbol,
  getSubscriptionEndDate,
  isIndianCurrency as isCurrencyIndian,
  loadScript,
  showToast,
} from '@/utils/helpers';
import {
  getStyledParsedHTML,
  metaConversionEvent,
  setGtagUserData,
  triggerGoogleConversionEvent,
} from '@/utils/utils';
import {RadioGroup} from '@headlessui/react';
import {CheckCircleIcon} from '@heroicons/react/20/solid';
import dayjs from 'dayjs';
import {useRouter} from 'next/router';
import {useContext, useEffect, useMemo, useState} from 'react';

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const PlansPage = () => {
  const {email, userData} = useContext(UserContext);

  const [selectedPlan, setSelectedPlan] = useState(0);
  const [selectedCollection, setSelectedCollection] =
    useState<ICollection | null>(null);

  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  const [proceedToPayment, setProceedToPayment] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isIndianCurrency, setIsIndianCurrency] = useState(true);

  useEffect(() => {
    setIsIndianCurrency(isCurrencyIndian());
  }, [userData]);

  // Checks and returns the discounted price key based on the region
  const discountedPriceKey = isIndianCurrency
    ? 'discounted_price'
    : 'discounted_price_usd';

  const actualPriceKey = isIndianCurrency ? 'actual_price' : 'actual_price_usd';

  const router = useRouter();

  useEffect(() => {
    if (userData) {
      setGtagUserData(userData);
    }
  }, [userData]);

  const razorpayApi = useMemo(async () => {
    try {
      if (typeof window !== 'undefined') {
        await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      }
    } catch (error) {
      console.log('error::', error);
    }
  }, []);

  const displayRazorpay = async (orderPayload: any) => {
    try {
      if (!razorpayApi) {
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
                    selectedCollection.plans[selectedPlan]?.[
                      discountedPriceKey
                    ] * 100,
                },
              );
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
              if (razorpayResponse.status === 201) {
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
                  'plan_extension_purchased',
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
        BASE_URL + '/extended-collections/' + `${router.query.planId}`,
        'GET',
      );
      if (response.status === 200 && response.data) {
        setSelectedCollection(response.data);
        setSelectedPlanId(response.data?.plans[0]?.id);
      } else {
        router.back();
        throw new Error('unable to fetch premium plans');
      }
    } catch (error) {
      router.back();
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
    if (proceedToPayment) {
      createPaymentOrder(selectedPlanId);
    }
  }, [proceedToPayment]);

  const createPaymentOrder = async (planId: string) => {
    setProceedToPayment(false);
    const orderPayload = {
      student: userData?.user,
      plan: planId,
      currency: isIndianCurrency ? 'INR' : 'USD',
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
                      <>
                        {plan.type === 'extension' && (
                          <RadioGroup.Option
                            key={plan.id}
                            onClick={() => {
                              setSelectedPlan(idx);
                            }}
                            value={plan.id}
                            className={({checked, active}) =>
                              classNames(
                                checked
                                  ? 'border-transparent'
                                  : 'border-gray-300',
                                active
                                  ? 'border-cobalt ring-2 ring-cobalt'
                                  : '',
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
                                              getSubscriptionEndDate(
                                                plan.duration,
                                              ),
                                            ).format('DD MMM YYYY')}
                                        </p>
                                      </div>
                                      {/* actual price */}
                                      <div className="flex flex-col items-end">
                                        <RadioGroup.Description
                                          as="span"
                                          className="text-xs font-medium text-gray-900">
                                          {getCurrencySymbol()}
                                          {plan[discountedPriceKey]}{' '}
                                        </RadioGroup.Description>
                                        <RadioGroup.Description
                                          as="del"
                                          className="text-xs font-medium text-gray-900">
                                          {getCurrencySymbol()}
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
                        )}
                      </>
                    ))}
                </div>
                {/* Price summary section start */}
                {/* <hr className="my-4 md:w-3/4" /> */}
                <div className=" border-t-2 pt-2 mt-6 space-y-2 text-sm md:w-3/4 ">
                  <p className="font-semibold">Price summary</p>
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>
                      {getCurrencySymbol()}
                      {selectedCollection.plans[selectedPlan]?.[actualPriceKey]}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-500">Plan Discount</p>
                    <p className="text-GREEN">
                      -{getCurrencySymbol()}
                      {selectedCollection.plans[selectedPlan]?.[
                        actualPriceKey
                      ] -
                        selectedCollection.plans[selectedPlan]?.[
                          discountedPriceKey
                        ]}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="font-semibold">Final Price</p>
                    <p className="font-semibold">
                      {getCurrencySymbol()}
                      {
                        selectedCollection.plans[selectedPlan]?.[
                          discountedPriceKey
                        ]
                      }
                    </p>
                  </div>
                </div>
                {/* Price summary section end */}

                <div className="md:w-3/4 justify-center flex mt-4">
                  <Button
                    onClick={() => {
                      createPaymentOrder(selectedPlanId);
                    }}
                    variant="secondary"
                    additionalClasses=" hover:text-white hover:bg-cobalt w-auto flex justify-center py-3 text-xs">
                    Pay {getCurrencySymbol()}
                    {
                      selectedCollection.plans[selectedPlan]?.[
                        discountedPriceKey
                      ]
                    }
                    &nbsp;&nbsp;&nbsp;
                    <RazorpayIcon />
                  </Button>
                </div>
              </RadioGroup>
            </div>
          </div>
        ) : (
          <ScreenLoader />
        )}
      </div>
    </Loader>
  );
};

export default withAuth(PlansPage);
