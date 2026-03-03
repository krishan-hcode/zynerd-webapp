import {BASE_URL} from '@/constants';
import Button from '@/elements/Button';
import Illustrations from '@/elements/Illustrations';
import withAuth from '@/global/WithAuth';
import {ICollection, IPlanDetails} from '@/types/premium-packages.types';
import {
  fetchHelper,
  getCurrencySymbol,
  isIndianCurrency,
} from '@/utils/helpers';
import {getStyledParsedHTML} from '@/utils/utils';
import {NoSymbolIcon} from '@heroicons/react/24/outline';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

const PlanExtension = () => {
  const router = useRouter();
  const [plansList, setPlansList] = useState<ICollection[] | null>(null);

  useEffect(() => {
    getExtensionPlans();
  }, []);

  const getExtensionPlans = async () => {
    try {
      const response = await fetchHelper(
        BASE_URL + '/extended-collections/',
        'GET',
      );
      if (response.status === 200 && response.data) {
        const filteredPlans = response.data.filter(
          (collection: ICollection) =>
            collection.plans?.length &&
            // Note: Payment_platform value 1 is of revenue cat, which should not be shown on webapp
            collection.payment_platform !== 1,
        );
        setPlansList(filteredPlans);
      } else {
        setPlansList([]);
      }
    } catch (error) {}
  };

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

  return (
    <div className="relative py-6 md:pb-24 px-4 md:px-10 bg-slate-100 min-h-screen ">
      <Illustrations />
      <Head>
        <title>Plan Extension – Cerebellum Academy</title>
      </Head>
      <h1 className="heading-text pt-3 pb-6 font-semibold tracking-tight text-center">
        Plan Extension
      </h1>
      {plansList?.length ? (
        <div className="relative z-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-8 gap-x-8">
            {plansList.map((collection: ICollection) => (
              <div
                key={collection.id}
                className="relative flex justify-between flex-col min-h-full pb-4 items-center w-full rounded-3xl border bg-white border-gray-200 shadow-md  mt-4">
                {/* Ribbon */}
                {collection.plans.some(plan => plan.type === 'extension') && (
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
                        router.push('/plan-extension/' + collection.id);
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
            ))}
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
    </div>
  );
};

export default withAuth(PlanExtension);
