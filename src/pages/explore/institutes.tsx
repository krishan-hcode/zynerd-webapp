import InstitutesList from '@/institutes/InstitutesList';
import InstitutesSearch from '@/institutes/InstitutesSearch';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import {localExploreDataRepository} from '@/services/exploreData.repository';
import type { IInstitute, IInstitutesViewMode } from '@/types/institutes.types';
import Head from 'next/head';
import {useEffect, useMemo, useState} from 'react';

const GRID_CHUNK_SIZE = 24;
const LIST_PAGE_SIZE = 20;

const InstitutesPage = () => {
  const [allInstitutes, setAllInstitutes] = useState<IInstitute[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstituteType, setSelectedInstituteType] = useState('');
  const [selectedAuthority, setSelectedAuthority] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [viewMode, setViewMode] = useState<IInstitutesViewMode>('grid');
  const [gridVisibleCount, setGridVisibleCount] = useState(GRID_CHUNK_SIZE);
  const [listPage, setListPage] = useState(1);

  useEffect(() => {
    localExploreDataRepository.getInstitutes().then(setAllInstitutes);
  }, []);

  const clearFilters = () => {
    setSelectedInstituteType('');
    setSelectedAuthority('');
    setSelectedState('');
    setSelectedUniversity('');
  };

  const filteredInstitutes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allInstitutes.filter(institute => {
      const matchesSearch =
        !query ||
        institute.name.toLowerCase().includes(query) ||
        institute.university.toLowerCase().includes(query) ||
        institute.city.toLowerCase().includes(query) ||
        institute.state.toLowerCase().includes(query);

      const matchesInstituteType =
        !selectedInstituteType || institute.instituteType === selectedInstituteType;
      const matchesAuthority =
        !selectedAuthority || institute.authority === selectedAuthority;
      const matchesState = !selectedState || institute.state === selectedState;
      const matchesUniversity =
        !selectedUniversity || institute.university === selectedUniversity;

      return (
        matchesSearch &&
        matchesInstituteType &&
        matchesAuthority &&
        matchesState &&
        matchesUniversity
      );
    });
  }, [
    allInstitutes,
    searchQuery,
    selectedInstituteType,
    selectedAuthority,
    selectedState,
    selectedUniversity,
  ]);

  const instituteTypeOptions = useMemo(
    () =>
      Array.from(new Set(allInstitutes.map(institute => institute.instituteType))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [allInstitutes],
  );
  const authorityOptions = useMemo(
    () =>
      Array.from(new Set(allInstitutes.map(institute => institute.authority))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [allInstitutes],
  );
  const stateOptions = useMemo(
    () =>
      Array.from(new Set(allInstitutes.map(institute => institute.state))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [allInstitutes],
  );
  const universityOptions = useMemo(
    () =>
      Array.from(new Set(allInstitutes.map(institute => institute.university))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [allInstitutes],
  );

  useEffect(() => {
    if (viewMode === 'grid') {
      setGridVisibleCount(GRID_CHUNK_SIZE);
    } else {
      setListPage(1);
    }
  }, [viewMode, searchQuery, selectedInstituteType, selectedAuthority, selectedState, selectedUniversity]);

  const paginatedInstitutes = useMemo(() => {
    if (viewMode === 'grid') {
      return filteredInstitutes.slice(0, gridVisibleCount);
    }
    const start = (listPage - 1) * LIST_PAGE_SIZE;
    return filteredInstitutes.slice(start, start + LIST_PAGE_SIZE);
  }, [filteredInstitutes, gridVisibleCount, listPage, viewMode]);

  return (
    <>
      <Head>
        <title>Institutes – Cerebellum Academy</title>
      </Head>
      <Header
        title="Institutes"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-white min-h-[calc(100vh-77px)]">
        <InstitutesSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedInstituteType={selectedInstituteType}
          onInstituteTypeChange={setSelectedInstituteType}
          selectedAuthority={selectedAuthority}
          onAuthorityChange={setSelectedAuthority}
          selectedState={selectedState}
          onStateChange={setSelectedState}
          selectedUniversity={selectedUniversity}
          onUniversityChange={setSelectedUniversity}
          instituteTypeOptions={instituteTypeOptions}
          authorityOptions={authorityOptions}
          stateOptions={stateOptions}
          universityOptions={universityOptions}
          onClearFilters={clearFilters}
        />
        <InstitutesList
          institutes={paginatedInstitutes}
          totalCount={filteredInstitutes.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          hasMore={viewMode === 'grid' && gridVisibleCount < filteredInstitutes.length}
          onLoadMore={() =>
            setGridVisibleCount(current =>
              Math.min(current + GRID_CHUNK_SIZE, filteredInstitutes.length),
            )
          }
          currentPage={listPage}
          pageSize={LIST_PAGE_SIZE}
          onPageChange={setListPage}
        />
      </div>
    </>
  );
};

export default withAuth(InstitutesPage);
