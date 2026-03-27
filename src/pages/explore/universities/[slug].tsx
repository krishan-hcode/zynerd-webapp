import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import { localExploreDataRepository } from '@/services/exploreData.repository';
import type { IInstitute } from '@/types/institutes.types';
import { classNames } from '@/utils/utils';
import { getUniversityWithAffiliatedInstitutes } from '@/utils/universities';
import {
  AcademicCapIcon,
  BuildingOfficeIcon,
  BuildingLibraryIcon,
  BeakerIcon,
  HomeModernIcon,
  ListBulletIcon,
  MapPinIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

const UniversityDetailsPage = () => {
  const router = useRouter();
  const slug = typeof router.query.slug === 'string' ? router.query.slug : '';
  const [allInstitutes, setAllInstitutes] = useState<IInstitute[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    localExploreDataRepository.getInstitutes().then(setAllInstitutes);
  }, []);

  const { university, affiliatedInstitutes } = useMemo(
    () => getUniversityWithAffiliatedInstitutes(slug, allInstitutes),
    [slug, allInstitutes],
  );

  const title = university?.name ?? 'University';

  return (
    <>
      <Head>
        <title>{title} – Cerebellum Academy</title>
      </Head>
      <Header title="University Details" isBackNav={true} />
      <div className="bg-white min-h-[calc(100vh-77px)] px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto space-y-4">
          {!university ? (
            <div className="rounded-2xl border border-customGray-10 bg-white p-6 text-center">
              <p className="text-sm font-inter text-customGray-50">
                University not found.
              </p>
            </div>
          ) : (
            <>
              <section className="relative overflow-hidden rounded-2xl border border-primary-dark bg-gradient-to-l from-primary-dark via-primary-dark/90 to-primary-dark/95 p-4 sm:p-5 shadow-sm">
                <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary-dark/20 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-12 left-10 h-28 w-28 rounded-full bg-primary-dark/15 blur-2xl" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-interMedium uppercase tracking-[0.08em] text-white/70">
                      University
                    </p>
                    <h1 className="mt-1 text-xl sm:text-2xl font-semibold text-white font-besley leading-tight">
                      {university.name}
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-primary-dark/20 bg-white/95 px-3 py-1.5 text-xs font-inter text-customGray-70">
                        <MapPinIcon className="h-3.5 w-3.5 text-primary-dark" />
                        {university.state}
                      </span>
                      <span className="inline-flex rounded-xl border border-primary-dark/20 bg-white/95 px-3 py-1.5 text-xs font-inter text-customGray-70">
                        {university.universityType}
                      </span>
                      <span className="inline-flex rounded-xl border border-primary-dark/20 bg-white/95 px-3 py-1.5 text-xs font-inter text-customGray-70">
                        {affiliatedInstitutes.length} affiliated institutes
                      </span>
                    </div>
                  </div>


                </div>
              </section>

              <section className="rounded-2xl border border-customGray-10 bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-customGray-10 bg-customGray-3/60 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-inter font-semibold text-primary-dark">Affiliated Institutes</p>
                  <div className="inline-flex items-center rounded-xl border border-customGray-10 bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={classNames(
                        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-inter transition-colors',
                        viewMode === 'grid'
                          ? 'bg-primary-blue text-white'
                          : 'text-primary-dark hover:bg-customGray-5',
                      )}>
                      <Squares2X2Icon className="h-4 w-4" />
                      Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={classNames(
                        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-inter transition-colors',
                        viewMode === 'list'
                          ? 'bg-primary-blue text-white'
                          : 'text-primary-dark hover:bg-customGray-5',
                      )}>
                      <ListBulletIcon className="h-4 w-4" />
                      List
                    </button>
                  </div>
                </div>
                {affiliatedInstitutes.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm font-inter text-customGray-50">
                      No affiliated institutes available.
                    </p>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {affiliatedInstitutes.map(institute => (
                      <div
                        key={institute.id}
                        className="rounded-xl border border-customGray-10 bg-gradient-to-b from-white to-customGray-3/40 p-3.5 hover:border-primary-blue/30 transition-colors">
                        <div className="flex items-start gap-2.5">
                          <BuildingLibraryIcon className="h-4 w-4 mt-0.5 text-customGray-50 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-inter font-semibold text-primary-dark line-clamp-2">
                              {institute.name}
                            </p>
                            <p className="text-xs text-customGray-50 mt-0.5 line-clamp-1">
                              {institute.instituteType}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2.5 flex items-center gap-1.5 text-customGray-60">
                          <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
                          <p className="text-xs font-inter line-clamp-1">
                            {institute.city}, {institute.state}
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-customGray-5 text-[11px] text-customGray-60 font-inter">
                            {institute.authority}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-customGray-5 text-[11px] text-customGray-60 font-inter">
                            <BuildingOfficeIcon className="h-3 w-3" />
                            Beds: {institute.beds}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-customGray-5 text-[11px] text-customGray-60 font-inter">
                            <HomeModernIcon className="h-3 w-3" />
                            {institute.localDistinction}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  affiliatedInstitutes.map(institute => (
                    <div
                      key={institute.id}
                      className="grid grid-cols-12 gap-3 items-center px-4 py-3 bg-gradient-to-b from-white to-customGray-3/40 border-b border-customGray-10 last:border-b-0">
                      <div className="col-span-12 md:col-span-6 min-w-0 flex items-start gap-2.5">
                        <BuildingLibraryIcon className="h-4 w-4 mt-0.5 text-customGray-50 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-inter font-semibold text-primary-dark truncate">
                            {institute.name}
                          </p>
                          <p className="text-xs text-customGray-50 mt-0.5">
                            {institute.instituteType}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-3 text-xs font-inter text-customGray-60">
                        {institute.city}, {institute.state}
                      </div>
                      <div className="col-span-6 md:col-span-3 md:text-right">
                        <div className="flex md:justify-end flex-wrap gap-1.5">
                          <span className="inline-flex px-2 py-1 rounded-md bg-customGray-5 text-[11px] text-customGray-60 font-inter">
                            {institute.authority}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-customGray-5 text-[11px] text-customGray-60 font-inter">
                            <BuildingOfficeIcon className="h-3 w-3" />
                            {institute.beds}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-customGray-5 text-[11px] text-customGray-60 font-inter">
                            <HomeModernIcon className="h-3 w-3" />
                            {institute.localDistinction}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default withAuth(UniversityDetailsPage);
