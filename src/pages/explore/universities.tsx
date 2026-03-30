import UniversitiesList from '@/universities/UniversitiesList';
import UniversitiesSearch from '@/universities/UniversitiesSearch';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import { localExploreDataRepository } from '@/services/exploreData.repository';
import {
  type IUniversitiesViewMode,
  type IUniversity,
} from '@/types/universities.types';
import {
  getUniversityStateOptions,
  getUniversityTypeOptions,
} from '@/utils/universities';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';

const GRID_CHUNK_SIZE = 24;
const LIST_PAGE_SIZE = 20;

const UniversitiesPage = () => {
  const [allUniversities, setAllUniversities] = useState<IUniversity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversityType, setSelectedUniversityType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [viewMode, setViewMode] = useState<IUniversitiesViewMode>('list');
  const [gridVisibleCount, setGridVisibleCount] = useState(GRID_CHUNK_SIZE);
  const [listPage, setListPage] = useState(1);

  useEffect(() => {
    localExploreDataRepository.getUniversities().then(setAllUniversities);
  }, []);
  const universityTypeOptions = useMemo(
    () => getUniversityTypeOptions(allUniversities),
    [allUniversities],
  );
  const stateOptions = useMemo(
    () => getUniversityStateOptions(allUniversities),
    [allUniversities],
  );

  const filteredUniversities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allUniversities.filter(university => {
      const matchesSearch =
        !query ||
        university.name.toLowerCase().includes(query) ||
        university.state.toLowerCase().includes(query) ||
        university.universityType.toLowerCase().includes(query);
      const matchesType =
        !selectedUniversityType || university.universityType === selectedUniversityType;
      const matchesState = !selectedState || university.state === selectedState;
      return matchesSearch && matchesType && matchesState;
    });
  }, [allUniversities, searchQuery, selectedUniversityType, selectedState]);

  useEffect(() => {
    if (viewMode === 'grid') {
      setGridVisibleCount(GRID_CHUNK_SIZE);
    } else {
      setListPage(1);
    }
  }, [viewMode, searchQuery, selectedUniversityType, selectedState]);

  const paginatedUniversities = useMemo(() => {
    if (viewMode === 'grid') {
      return filteredUniversities.slice(0, gridVisibleCount);
    }
    const start = (listPage - 1) * LIST_PAGE_SIZE;
    return filteredUniversities.slice(start, start + LIST_PAGE_SIZE);
  }, [filteredUniversities, gridVisibleCount, listPage, viewMode]);

  const clearFilters = () => {
    setSelectedUniversityType('');
    setSelectedState('');
  };

  return (
    <>
      <Head>
        <title>Universities – Cerebellum Academy</title>
      </Head>
      <Header
        title="Universities"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-white min-h-[calc(100vh-77px)]">
        <UniversitiesSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedUniversityType={selectedUniversityType}
          onUniversityTypeChange={setSelectedUniversityType}
          selectedState={selectedState}
          onStateChange={setSelectedState}
          universityTypeOptions={universityTypeOptions}
          stateOptions={stateOptions}
          onClearFilters={clearFilters}
        />
        <UniversitiesList
          universities={paginatedUniversities}
          totalCount={filteredUniversities.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          hasMore={viewMode === 'grid' && gridVisibleCount < filteredUniversities.length}
          onLoadMore={() =>
            setGridVisibleCount(current =>
              Math.min(current + GRID_CHUNK_SIZE, filteredUniversities.length),
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

export default withAuth(UniversitiesPage);
