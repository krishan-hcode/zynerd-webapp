import {BASE_URL, GET_FAQ_ROUTE, PATCH_FAQ_ROUTE} from '@/constants';
import {
  DropArrowDownIcon,
  DropArrowUpIcon,
  SearchIcon,
  ThumbDownIcon,
  ThumbUpIcon,
} from '@/elements/Icons';
import Colors from '@/styles/colors';
import {fetchHelper, showToast} from '@/utils/helpers';
import React, {useCallback, useEffect, useState} from 'react';
type IFaq = {id: number | string; question: string; solution: string};
const ThumbButton: React.FC<{
  selected: boolean;
  onClick: () => void;
  label: 'up' | 'down';
}> = ({selected, onClick, label}) => {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors bg-customGray-3 border-customGray-3`}
      aria-label={label === 'up' ? 'Helpful' : 'Not helpful'}>
      <span>
        {label === 'up' ? (
          <ThumbUpIcon
            className="w-6 h-6"
            stroke={selected ? Colors.SECONDARY_GREEN : Colors.CUSTOM_GRAY_80}
          />
        ) : (
          <ThumbDownIcon
            className="w-6 h-6"
            stroke={selected ? Colors.SECONDARY_RED : Colors.CUSTOM_GRAY_80}
          />
        )}
      </span>
    </button>
  );
};
const Accordion: React.FC<{
  item: IFaq;
  isOpen: boolean;
  onToggle: () => void;
}> = ({item, isOpen, onToggle}) => {
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const handleFeedback = useCallback(async () => {
    if (isHelpful === null) return;
    try {
      await fetchHelper(BASE_URL + PATCH_FAQ_ROUTE(item.id), 'PATCH', {
        is_helpful: isHelpful,
      });
    } catch (e) {
      showToast('error', 'Failed to submit feedback');
    }
  }, [isHelpful, item.id]);
  useEffect(() => {
    handleFeedback();
  }, [handleFeedback]);
  return (
    <div className="py-3">
      <button
        className="w-full flex items-center justify-between pb-6"
        onClick={onToggle}>
        <span className="text-sm text-primary-dark font-medium font-sauce text-left pr-4">
          {item.question}
        </span>
        <span className="text-gray-500">
          {isOpen ? (
            <DropArrowUpIcon className="w-5 h-5" />
          ) : (
            <DropArrowDownIcon className="w-5 h-5" />
          )}
        </span>
      </button>
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-xl p-4  mb-6">
          <div
            className="prose max-w-none text-sm text-customGray-80 font-medium font-inter"
            dangerouslySetInnerHTML={{__html: item.solution}}
          />
          <div className="border-t border-gray-200 pt-3 flex items-center justify-end mt-4 gap-2">
            <span className="text-xs text-primary-dark font-inter font-medium">
              Was this helpful?
            </span>
            <ThumbButton
              selected={isHelpful === true}
              onClick={() => setIsHelpful(true)}
              label="up"
            />
            <ThumbButton
              selected={isHelpful === false}
              onClick={() => setIsHelpful(false)}
              label="down"
            />
          </div>
        </div>
      )}
      <div className="border-b border-gray-200" />
    </div>
  );
};
const FaqRight: React.FC = () => {
  const [faqList, setFaqList] = useState<IFaq[]>([]);
  const [filtered, setFiltered] = useState<IFaq[]>([]);
  const [query, setQuery] = useState('');
  const [openIdx, setOpenIdx] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);
  const fetchFaqs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchHelper(BASE_URL + GET_FAQ_ROUTE, 'GET');
      if (res.status === 200) {
        setFaqList(res.data || []);
        setFiltered(res.data || []);
      } else {
        showToast('error', 'Failed to load FAQs');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setFiltered(faqList);
    } else {
      const q = query.toLowerCase();
      setFiltered(faqList.filter(f => f.question?.toLowerCase?.().includes(q)));
    }
  }, [query, faqList]);
  return (
    <div className="h-full bg-white lg:overflow-y-auto scrollbar-hide">
      <div className="mx-auto px-6 py-6">
        <div className="bg-white border border-customGray-10 rounded-xl px-4 py-2 mb-4 flex items-center">
          <span className="text-gray-500 mr-2">
            <SearchIcon className="w-6 h-6" />
          </span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search FAQs"
            className="flex-1 outline-none text-xs font-inter font-medium text-customGray-40 py-2"
          />
        </div>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({length: 4}).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-xl px-4 py-6 border border-gray-200"
              />
            ))}
          </div>
        ) : (
          <div>
            {filtered.map((item, idx) => (
              <Accordion
                key={String(item.id)}
                item={item}
                isOpen={idx === openIdx}
                onToggle={() => setOpenIdx(idx === openIdx ? -1 : idx)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default FaqRight;
