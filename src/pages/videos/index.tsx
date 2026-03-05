'use client';

import videosData from '@/data/videosData.json';
import withAuth from '@/global/WithAuth';
import type {IVideoSectionData} from '@/types/videos.types';
import VideoSearchFilter from '@/videos/VideoSearchFilter';
import VideoSection from '@/videos/VideoSection';
import VideosHeader from '@/videos/VideosHeader';
import Head from 'next/head';
import {useMemo, useState} from 'react';

// When using API, uncomment these imports:
// import {BASE_URL} from '@/constants';
// import {fetchHelper, showToast} from '@/utils/helpers';
// import {useCallback, useEffect} from 'react';

const VideosPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedCounselling, setSelectedCounselling] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All languages');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  /* ========== Static JSON data (current) ========== */
  const {tags, counsellingOptions, languages, sections} = useMemo(() => {
    const data = videosData as {
      tags: string[];
      counsellingOptions: string[];
      languages: string[];
      sections: IVideoSectionData[];
    };
    return {
      tags: data.tags || [],
      counsellingOptions: data.counsellingOptions || [],
      languages: data.languages || [
        'All languages',
        'English',
        'தமிழ்',
        'മലയാളം',
        'Hindi',
      ],
      sections: data.sections || [],
    };
  }, []);

  /* ========== API integration (uncomment when ready) ==========
   * 1. Uncomment the imports above (BASE_URL, fetchHelper, showToast, useCallback, useEffect)
   * 2. Comment out the useMemo block above (static JSON data)
   * 3. Uncomment the block below
   * 4. Add loading/error UI in the return (e.g. if (isLoading) return <Loader />;
   *
  const [tags, setTags] = useState<string[]>([]);
  const [counsellingOptions, setCounsellingOptions] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [sections, setSections] = useState<IVideoSectionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideosData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchHelper(BASE_URL + '/videos/', 'GET');

      if (response.status === 200 && response.data) {
        const data = response.data;
        setTags(data.tags || []);
        setCounsellingOptions(data.counsellingOptions || []);
        setLanguages(
          data.languages || [
            'All languages',
            'English',
            'தமிழ்',
            'മലയാളം',
            'Hindi',
          ],
        );
        setSections(data.sections || []);
      } else {
        showToast('error', 'Failed to load videos');
      }
    } catch (err) {
      setError('Something went wrong');
      showToast('error', 'Failed to load videos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideosData();
  }, [fetchVideosData]);
  ========== End API integration ========== */

  const filteredSections = useMemo(() => {
    return sections.map(section => {
      let filteredVideos = section.videos;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredVideos = filteredVideos.filter(
          video =>
            video.title.toLowerCase().includes(query) ||
            video.language.toLowerCase().includes(query),
        );
      }

      if (selectedCounselling) {
        filteredVideos = filteredVideos.filter(video =>
          video.title.toLowerCase().includes(selectedCounselling.toLowerCase()),
        );
      }

      if (selectedLanguage && selectedLanguage !== 'All languages') {
        filteredVideos = filteredVideos.filter(
          video => video.language === selectedLanguage,
        );
      }

      if (selectedTag) {
        filteredVideos = filteredVideos.filter(video =>
          video.tags?.includes(selectedTag),
        );
      }

      return {...section, videos: filteredVideos};
    });
  }, [
    sections,
    searchQuery,
    selectedCounselling,
    selectedLanguage,
    selectedTag,
  ]);

  const handleVideoClick = (video: {videoLink?: string}) => {
    if (video.videoLink) {
      window.open(video.videoLink, '_blank');
    }
  };

  // When using API, add loading/error handling before return:
  // if (isLoading) return <Loader />;
  // if (error) return <ErrorMessage message={error} onRetry={fetchVideosData} />;

  return (
    <>
      <Head>
        <title>Videos – Cerebellum Academy</title>
      </Head>
      <VideosHeader />
      <div className="bg-lightBlue-300 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] pb-6 sm:pb-8">
        <VideoSearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          selectedCounselling={selectedCounselling}
          onCounsellingChange={setSelectedCounselling}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          tags={tags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
          counsellingOptions={counsellingOptions}
          languageOptions={languages}
        />
        <div className="pt-4 sm:pt-5">
          {filteredSections.map(section => (
            <VideoSection
              key={section.id}
              title={section.title}
              viewMoreUrl={section.viewMoreUrl}
              videos={section.videos}
              onVideoClick={handleVideoClick}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default withAuth(VideosPage);
