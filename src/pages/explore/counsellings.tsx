'use client';

import CounsellingList from '@/counsellings/CounsellingList';
import CounsellingSearch from '@/counsellings/CounsellingSearch';
import counsellingsData from '@/data/counsellingsData.json';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import type {ICounselling} from '@/types/counsellings.types';
import Head from 'next/head';
import {useMemo, useState} from 'react';

const {ALL_COUNSELLINGS, TYPE_OPTIONS, STATE_OPTIONS} = counsellingsData as {
  ALL_COUNSELLINGS: ICounselling[];
  TYPE_OPTIONS: string[];
  STATE_OPTIONS: string[];
};
/* ──────────────────────────────────────────────────────────────────── */

const CounsellingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const filtered = useMemo(() => {
    return ALL_COUNSELLINGS.filter(item => {
      const q = searchQuery.toLowerCase();
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

  return (
    <>
      <Head>
        <title>Counsellings – Cerebellum Academy</title>
      </Head>
      <Header title="Counsellings" isBackNav={true} />
      <div className="bg-gray-50 min-h-[calc(100vh-77px)]">
        <CounsellingSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedState={selectedState}
          onStateChange={setSelectedState}
          typeOptions={TYPE_OPTIONS}
          stateOptions={STATE_OPTIONS}
        />
        <CounsellingList counsellings={filtered} totalCount={filtered.length} />
      </div>
    </>
  );
};

export default withAuth(CounsellingsPage);
