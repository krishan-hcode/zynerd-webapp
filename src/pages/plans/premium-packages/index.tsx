import Loader from '@/common/Loader';
import {BASE_URL, errorMessage, GET_PREMIUM_PLANS_PATH} from '@/constants';
import Button from '@/elements/Button';
import Illustrations from '@/elements/Illustrations';
import withAuth from '@/global/WithAuth';
import {ICollection, IPlanDetails} from '@/types/premium-packages.types';
import {
  fetchHelper,
  getCurrencySymbol,
  isIndianCurrency,
  removeAuthStoredData,
  showToast,
} from '@/utils/helpers';
import {getStyledParsedHTML} from '@/utils/utils';
import {NoSymbolIcon} from '@heroicons/react/24/outline';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useCallback, useEffect, useState} from 'react';

const Plans = () => {
  const [plansList, setPlansList] = useState<ICollection[] | null>(null);

  const [showAllPlans, setShowAllPlans] = useState(false);

  const router = useRouter();

  // Checks and returns the discounted price key based on the region
  const discountedPriceKey = isIndianCurrency()
    ? 'discounted_price'
    : 'discounted_price_usd';

  const getSortedPlans = (plans: IPlanDetails[]) => {
    if (plans.length > 1) {
      return plans.sort((planA, planB) =>
        planA[discountedPriceKey] > planB[discountedPriceKey] ? -1 : 1,
      );
    } else {
      return plans;
    }
  };

  const getPremiumPlans = useCallback(async () => {
    try {
      const response = await fetchHelper(
        BASE_URL + GET_PREMIUM_PLANS_PATH,
        'GET',
      );

      if (response.status === 200 && response.data) {
        // Sorts collections in descending order based on price of their plans
        const sortedCollections = response.data.sort(
          (collectionA: ICollection, collectionB: ICollection) =>
            getSortedPlans(collectionA.plans)[0]?.[discountedPriceKey] >
            getSortedPlans(collectionB.plans)[0]?.[discountedPriceKey]
              ? -1
              : 1,
        );

        const filteredPlans = sortedCollections.filter(
          (collection: ICollection) => collection.plans?.length,
        );
        setPlansList(filteredPlans || []);
      } else if (response.status === 401) {
        removeAuthStoredData();
        showToast('error', errorMessage.LOG_OUT_MSG);
      } else {
        throw new Error('unable to fetch premium plans');
      }
    } catch (error) {
      showToast('error', 'Something went wrong');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getPremiumPlans();
  }, [getPremiumPlans]);

  return (
    <div className="relative py-6 md:pb-24 px-4 md:px-10 bg-slate-100 min-h-screen ">
      <Loader isLoading={plansList === null}>
        <Illustrations />
        <Head>
          <title>Premium packages – Cerebellum Academy</title>
        </Head>
        <h1 className="heading-text pt-3 pb-6 font-semibold tracking-tight text-center">
          Premium Packages
        </h1>
        {plansList?.length ? (
          <div className="relative z-40">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-8 gap-x-8">
              {showAllPlans ? (
                plansList.map((collection: ICollection, idx) => (
                  <div
                    key={collection.id}
                    className="relative flex justify-between flex-col min-h-full pb-4 items-center w-full rounded-3xl border bg-white border-gray-200 shadow-md  mt-4">
                    {/* Ribbon */}
                    {collection.plans.some(
                      plan => plan.type === 'extension',
                    ) && (
                      <div className="ribbon ribbon-top-right">
                        <span className="text-sm font-bold">Extension</span>
                      </div>
                    )}
                    <div className="w-full space-y-4">
                      {collection.is_complete_course && (
                        <span className=" text-xs bg-cobalt text-white px-2 pt-1.5 pb-2 rounded-tl-xl rounded-br-xl text-center w-auto">
                          Premium Plan
                        </span>
                      )}
                      <h2
                        className={`${
                          !collection.is_complete_course ? 'pt-4' : ''
                        } px-8 text-center text-xl md:text-xl font-bold mt-6`}>
                        {collection.name}
                      </h2>

                      <div className="flex space-y-6 flex-col items-center justify-center ">
                        <div className="flex flex-col items-center justify-center bg-gray-100 px-4 py-2 rounded-xl">
                          <h3 className="text-4xl font-bold">
                            {getCurrencySymbol()}&nbsp;
                            {
                              getSortedPlans(collection.plans)[
                                getSortedPlans(collection.plans).length - 1
                              ]?.[discountedPriceKey]
                            }
                          </h3>
                        </div>
                        <Button
                          onClick={() => {
                            router.push(
                              '/plans/premium-packages/' + collection.id,
                            );
                          }}
                          variant="secondary"
                          additionalClasses=" !text-cobalt border-2 border-cobalt !bg-white hover:!text-white hover:!bg-cobalt flex justify-center rounded-lg h-12 text-lg">
                          See all plans &#8594;
                        </Button>
                      </div>
                      {collection.description && (
                        <div className=" max-h-[9em] thin-scrollbar overflow-y-scroll">
                          {getStyledParsedHTML(collection.description, 'plans')}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className=" col-span-1 md:col-span-2 xl:col-span-3 mx-2 lg:mx-[25%]">
                  <div key={plansList[0].id}>
                    <div className="relative flex justify-between flex-col min-h-full pb-4 items-center w-full rounded-3xl border bg-white border-gray-200 shadow-lg  mt-4">
                      {/* Ribbon */}
                      {plansList[0].plans.some(
                        plan => plan.type === 'extension',
                      ) && (
                        <div className="ribbon ribbon-top-right">
                          <span className="text-sm font-bold">Extension</span>
                        </div>
                      )}
                      <div className="w-full space-y-4">
                        {plansList[0].is_complete_course && (
                          <span className=" text-xs bg-cobalt text-white px-2 pt-1.5 pb-2 rounded-tl-xl rounded-br-xl text-center w-auto">
                            Premium Plan
                          </span>
                        )}
                        <h2
                          className={`${
                            !plansList[0].is_complete_course ? 'pt-4' : ''
                          } px-8 text-center text-xl md:text-xl font-bold mt-6`}>
                          {plansList[0].name}
                        </h2>

                        <div className="flex space-y-6 flex-col items-center justify-center ">
                          <div className="flex flex-col items-center justify-center bg-gray-100 px-4 py-2 rounded-xl">
                            <h3 className="text-4xl font-bold">
                              {getCurrencySymbol()}&nbsp;
                              {
                                getSortedPlans(plansList[0].plans)[
                                  getSortedPlans(plansList[0].plans).length - 1
                                ]?.[discountedPriceKey]
                              }
                            </h3>
                          </div>
                          <Button
                            onClick={() => {
                              router.push(
                                '/plans/premium-packages/' + plansList[0].id,
                              );
                            }}
                            variant="secondary"
                            additionalClasses=" !text-cobalt border-2 border-cobalt !bg-white hover:!text-white hover:!bg-cobalt flex justify-center rounded-lg h-12 text-lg">
                            See all plans &#8594;
                          </Button>
                        </div>
                        {plansList[0].description && (
                          <div className="flex justify-center">
                            <div className="max-w-2xl  thin-scrollbar">
                              {getStyledParsedHTML(
                                plansList[0].description,
                                'plans',
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 w-full h-12 flex justify-center">
                    <Button
                      onClick={() => setShowAllPlans(true)}
                      variant="secondary">
                      Show more
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          plansList !== null && (
            <div className="mt-20 min-h-[50vh] bg-white rounded-xl max-w-4xl mx-auto flex flex-col justify-center items-center">
              <NoSymbolIcon className="w-8" />
              <p className="mb-2 font-semibold">No plans found</p>
              <Link className="underline text-gray-600 text-sm" href="/">
                Home
              </Link>
            </div>
          )
        )}
      </Loader>
    </div>
  );
};

export default withAuth(Plans);
