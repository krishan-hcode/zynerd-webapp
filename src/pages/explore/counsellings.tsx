import CounsellingList from '@/counsellings/CounsellingList';
import CounsellingSearch from '@/counsellings/CounsellingSearch';
import counsellingsData from '@/data/counsellingsData.json';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import type {ICounselling, ICounsellingsViewMode} from '@/types/counsellings.types';
import Head from 'next/head';
import {useEffect, useMemo, useState} from 'react';

const GRID_CHUNK_SIZE = 24;
const LIST_PAGE_SIZE = 20;

const {ALL_COUNSELLINGS, TYPE_OPTIONS, STATE_OPTIONS} = counsellingsData as {
  ALL_COUNSELLINGS: ICounselling[];
  TYPE_OPTIONS: string[];
  STATE_OPTIONS: string[];
};

const CounsellingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [viewMode, setViewMode] = useState<ICounsellingsViewMode>('grid');
  const [gridVisibleCount, setGridVisibleCount] = useState(GRID_CHUNK_SIZE);
  const [listPage, setListPage] = useState(1);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_COUNSELLINGS.filter(item => {
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q);
      const matchesType =
        !selectedType ||
        item.subtitle.toLowerCase().includes(selectedType.toLowerCase());
      const matchesState =
        !selectedState ||
        item.name.toLowerCase().includes(selectedState.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(selectedState.toLowerCase());
      return matchesSearch && matchesType && matchesState;
    });
  }, [searchQuery, selectedType, selectedState]);

  useEffect(() => {
    if (viewMode === 'grid') {
      setGridVisibleCount(GRID_CHUNK_SIZE);
    } else {
      setListPage(1);
    }
  }, [viewMode, searchQuery, selectedType, selectedState]);

  const paginatedCounsellings = useMemo(() => {
    if (viewMode === 'grid') {
      return filtered.slice(0, gridVisibleCount);
    }
    const start = (listPage - 1) * LIST_PAGE_SIZE;
    return filtered.slice(start, start + LIST_PAGE_SIZE);
  }, [filtered, gridVisibleCount, listPage, viewMode]);

  const clearFilters = () => {
    setSelectedType('');
    setSelectedState('');
  };

  return (
    <>
      <Head>
        <title>Counsellings – Cerebellum Academy</title>
      </Head>
      <Header
        title="Counsellings"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-white min-h-[calc(100vh-77px)]">
        <CounsellingSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedState={selectedState}
          onStateChange={setSelectedState}
          typeOptions={TYPE_OPTIONS}
          stateOptions={STATE_OPTIONS}
          onClearFilters={clearFilters}
        />
        <CounsellingList
          counsellings={paginatedCounsellings}
          totalCount={filtered.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          hasMore={viewMode === 'grid' && gridVisibleCount < filtered.length}
          onLoadMore={() =>
            setGridVisibleCount(current =>
              Math.min(current + GRID_CHUNK_SIZE, filtered.length),
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

export default withAuth(CounsellingsPage);
