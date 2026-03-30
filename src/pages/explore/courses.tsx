import CoursesList from '@/courses/CoursesList';
import CoursesSearch from '@/courses/CoursesSearch';
import withAuth from '@/global/WithAuth';
import Header from '@/qbank/QBankHeader';
import {localExploreDataRepository} from '@/services/exploreData.repository';
import {type ICourse, type ICoursesViewMode} from '@/types/courses.types';
import {
  getCourseClinicalTypeOptions,
  getCourseDegreeTermOptions,
  getCourseDegreeTypeOptions,
} from '@/utils/courses';
import Head from 'next/head';
import {useEffect, useMemo, useState} from 'react';

const GRID_CHUNK_SIZE = 24;
const LIST_PAGE_SIZE = 20;

const CoursesPage = () => {
  const [allCourses, setAllCourses] = useState<ICourse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClinicalType, setSelectedClinicalType] = useState('');
  const [selectedDegreeType, setSelectedDegreeType] = useState('');
  const [selectedDegreeTerm, setSelectedDegreeTerm] = useState('');
  const [viewMode, setViewMode] = useState<ICoursesViewMode>('grid');
  const [gridVisibleCount, setGridVisibleCount] = useState(GRID_CHUNK_SIZE);
  const [listPage, setListPage] = useState(1);

  useEffect(() => {
    localExploreDataRepository.getCourses().then(setAllCourses);
  }, []);

  const clinicalTypeOptions = useMemo(
    () => getCourseClinicalTypeOptions(allCourses),
    [allCourses],
  );
  const degreeTypeOptions = useMemo(
    () => getCourseDegreeTypeOptions(allCourses),
    [allCourses],
  );
  const degreeTermOptions = useMemo(
    () => getCourseDegreeTermOptions(allCourses),
    [allCourses],
  );

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allCourses.filter(course => {
      const matchesSearch =
        !query ||
        course.name.toLowerCase().includes(query) ||
        course.clinicalType.toLowerCase().includes(query) ||
        course.degreeType.toLowerCase().includes(query) ||
        course.degreeTerm.toLowerCase().includes(query);

      const matchesClinicalType =
        !selectedClinicalType || course.clinicalType === selectedClinicalType;
      const matchesDegreeType =
        !selectedDegreeType || course.degreeType === selectedDegreeType;
      const matchesDegreeTerm =
        !selectedDegreeTerm || course.degreeTerm === selectedDegreeTerm;

      return (
        matchesSearch &&
        matchesClinicalType &&
        matchesDegreeType &&
        matchesDegreeTerm
      );
    });
  }, [
    allCourses,
    searchQuery,
    selectedClinicalType,
    selectedDegreeType,
    selectedDegreeTerm,
  ]);

  useEffect(() => {
    if (viewMode === 'grid') {
      setGridVisibleCount(GRID_CHUNK_SIZE);
    } else {
      setListPage(1);
    }
  }, [viewMode, searchQuery, selectedClinicalType, selectedDegreeType, selectedDegreeTerm]);

  const paginatedCourses = useMemo(() => {
    if (viewMode === 'grid') {
      return filteredCourses.slice(0, gridVisibleCount);
    }
    const start = (listPage - 1) * LIST_PAGE_SIZE;
    return filteredCourses.slice(start, start + LIST_PAGE_SIZE);
  }, [filteredCourses, gridVisibleCount, listPage, viewMode]);

  const clearFilters = () => {
    setSelectedClinicalType('');
    setSelectedDegreeType('');
    setSelectedDegreeTerm('');
  };

  return (
    <>
      <Head>
        <title>Courses – Cerebellum Academy</title>
      </Head>
      <Header
        title="Courses"
        isBackNav={true}
        showSearch={true}
        showBookmark={true}
      />
      <div className="bg-white min-h-[calc(100vh-77px)]">
        <CoursesSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedClinicalType={selectedClinicalType}
          onClinicalTypeChange={setSelectedClinicalType}
          selectedDegreeType={selectedDegreeType}
          onDegreeTypeChange={setSelectedDegreeType}
          selectedDegreeTerm={selectedDegreeTerm}
          onDegreeTermChange={setSelectedDegreeTerm}
          clinicalTypeOptions={clinicalTypeOptions}
          degreeTypeOptions={degreeTypeOptions}
          degreeTermOptions={degreeTermOptions}
          onClearFilters={clearFilters}
        />
        <CoursesList
          courses={paginatedCourses}
          totalCount={filteredCourses.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          hasMore={viewMode === 'grid' && gridVisibleCount < filteredCourses.length}
          onLoadMore={() =>
            setGridVisibleCount(current =>
              Math.min(current + GRID_CHUNK_SIZE, filteredCourses.length),
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

export default withAuth(CoursesPage);
