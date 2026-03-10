import CheckboxGroup from '@/common/CheckboxGroup';
import Modal from '@/common/Modal';
import MultiSelectDropdown from '@/common/MultiSelectDropdown';
import NumberRangeInput from '@/common/NumberRangeInput';
import RadioGroup from '@/common/RadioGroup';
import ToggleButtonGroup from '@/common/ToggleButtonGroup';
import {
  DEFAULT_DISPLAYED_FIELDS,
  DEFAULT_FILTERS,
  DISPLAYED_FIELD_LABELS,
  SESSION_OPTIONS,
  SESSION_ROUNDS,
  type DisplayedFieldKey,
  type DisplayedFields,
  type InsightFilters,
  type SessionYear,
} from '@/insights/insightsFilter.types';
import { LockClosedIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: InsightFilters;
  onFiltersChange: (f: InsightFilters) => void;
  displayedFields: DisplayedFields;
  onDisplayedFieldsChange: (d: DisplayedFields) => void;
  onViewResults: () => void;
  quotaOptions?: string[];
  categoryOptions?: string[];
  stateOptions?: string[];
  instituteOptions?: string[];
  courseOptions?: string[];
  courseTypeOptions?: string[];
  degreeOptions?: string[];
}

export default function FiltersModal({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  displayedFields,
  onDisplayedFieldsChange,
  onViewResults,
  quotaOptions = [],
  categoryOptions = [],
  stateOptions = [],
  instituteOptions = [],
  courseOptions = [],
  courseTypeOptions = [],
  degreeOptions = [],
}: FiltersModalProps) {
  const updateFilters = (patch: Partial<InsightFilters>) => {
    onFiltersChange({ ...filters, ...patch });
  };

  const handleSessionChange = (session: SessionYear) => {
    const validRounds = SESSION_ROUNDS[session];
    const rounds = filters.rounds.filter(r => validRounds.includes(r));
    updateFilters({ session, rounds });
  };

  const roundsForSession = SESSION_ROUNDS[filters.session];

  const handleClearFilters = () => {
    onFiltersChange({ ...DEFAULT_FILTERS });
    onDisplayedFieldsChange({ ...DEFAULT_DISPLAYED_FIELDS });
  };

  const displayFieldKeys = Object.keys(DEFAULT_DISPLAYED_FIELDS) as DisplayedFieldKey[];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldHaveCrossIcon={false}
      containerAdditionalClasses="max-w-5xl max-h-[90vh] flex flex-col overflow-hidden p-0"
    >
      {/* Sticky header: Filters + close button */}
      <div className="flex shrink-0 items-center justify-between border-b border-customGray-10 bg-white px-4 pb-4 sm:px-6">
        <h2 className="text-lg font-semibold text-primary-dark font-besley">
          Filters
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-customGray-90 hover:bg-customGray-5 hover:text-primary-dark focus:outline-none"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6" aria-hidden />
        </button>
      </div>

      {/* Scrollable content: filter fields + displayed fields */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {/* Column 1 */}
          <div className="space-y-4 border border-customGray-10 p-4 rounded-lg shadow-md">
            <NumberRangeInput
              label="AI Rank"
              minValue={filters.aiRankMin}
              maxValue={filters.aiRankMax}
              onMinChange={aiRankMin => updateFilters({ aiRankMin })}
              onMaxChange={aiRankMax => updateFilters({ aiRankMax })}
              maxPlaceholder="50000000"
            />
            <NumberRangeInput
              label="State Rank"
              minValue={filters.stateRankMin}
              maxValue={filters.stateRankMax}
              onMinChange={stateRankMin => updateFilters({ stateRankMin })}
              onMaxChange={stateRankMax => updateFilters({ stateRankMax })}
              maxPlaceholder="50000000"
            />
            <RadioGroup
              label="Session"
              name="session"
              options={SESSION_OPTIONS}
              value={filters.session}
              onChange={handleSessionChange}
            />
            <ToggleButtonGroup
              label="Rounds"
              options={roundsForSession}
              value={filters.rounds}
              onChange={rounds => updateFilters({ rounds })}
            />
            <MultiSelectDropdown
              label="Quota"
              placeholder="Search Quota"
              options={quotaOptions}
              value={filters.quotas}
              onChange={quotas => updateFilters({ quotas })}
            />
            <MultiSelectDropdown
              label="Category"
              placeholder="Search Category"
              options={categoryOptions}
              value={filters.categories}
              onChange={categories => updateFilters({ categories })}
            />
          </div>

          {/* Column 2 */}
          <div className="space-y-4 border border-customGray-10 p-4 rounded-lg shadow-md">
            <MultiSelectDropdown
              label="State"
              placeholder="Search State"
              options={stateOptions}
              value={filters.states}
              onChange={newStates => updateFilters({ states: newStates, institutes: [] })}
              helperText="(Selection will filter Institutes as well)"
            />
            <MultiSelectDropdown
              label={`Institute (${instituteOptions.length})`}
              placeholder="Search Institute"
              options={instituteOptions}
              value={filters.institutes}
              onChange={institutes => updateFilters({ institutes })}
            />
            <CheckboxGroup
              label="Institute Type"
              options={[
                { key: 'government', label: 'Government Institute' },
                { key: 'private', label: 'Private Institute (State University)' },
              ]}
              value={filters.instituteType}
              onChange={instituteType =>
                updateFilters({ instituteType })
              }
            />
            <NumberRangeInput
              label="Beds"
              minValue={filters.bedsMin}
              maxValue={filters.bedsMax}
              onMinChange={bedsMin => updateFilters({ bedsMin })}
              onMaxChange={bedsMax => updateFilters({ bedsMax })}
              maxPlaceholder="10000"
            />
            <NumberRangeInput
              label="Fee"
              minValue={filters.feeMin}
              maxValue={filters.feeMax}
              onMinChange={feeMin => updateFilters({ feeMin })}
              onMaxChange={feeMax => updateFilters({ feeMax })}
              maxPlaceholder="10000000"
            />
            <NumberRangeInput
              label="Bond Years"
              minValue={filters.bondYearsMin}
              maxValue={filters.bondYearsMax}
              onMinChange={bondYearsMin => updateFilters({ bondYearsMin })}
              onMaxChange={bondYearsMax => updateFilters({ bondYearsMax })}
              maxPlaceholder="20"
            />
            <NumberRangeInput
              label="Bond Penalty"
              minValue={filters.bondPenaltyMin}
              maxValue={filters.bondPenaltyMax}
              onMinChange={bondPenaltyMin => updateFilters({ bondPenaltyMin })}
              onMaxChange={bondPenaltyMax => updateFilters({ bondPenaltyMax })}
              maxPlaceholder="10000000"
            />
          </div>

          {/* Column 3 */}
          <div className="space-y-4 border border-customGray-10 p-4 rounded-lg shadow-md">
            {courseOptions.length > 5 ? (
              <MultiSelectDropdown
                label="Course"
                placeholder="Search Course"
                options={courseOptions}
                value={filters.course}
                onChange={course => updateFilters({ course })}
              />
            ) : (
              <CheckboxGroup
                label="Course"
                options={courseOptions.map(c => ({ key: c, label: c }))}
                value={courseOptions.reduce(
                  (acc, c) => ({ ...acc, [c]: filters.course.includes(c) }),
                  {} as Record<string, boolean>,
                )}
                onChange={next =>
                  updateFilters({
                    course: Object.entries(next)
                      .filter(([, v]) => v)
                      .map(([k]) => k),
                  })
                }
              />
            )}
            {courseTypeOptions.length > 0 &&
              (courseTypeOptions.length > 5 ? (
                <MultiSelectDropdown
                  label="Course Type"
                  placeholder="Search Course Type"
                  options={courseTypeOptions}
                  value={filters.courseType}
                  onChange={courseType => updateFilters({ courseType })}
                />
              ) : (
                <CheckboxGroup
                  label="Course Type"
                  options={courseTypeOptions.map(c => ({ key: c, label: c }))}
                  value={courseTypeOptions.reduce(
                    (acc, c) => ({ ...acc, [c]: filters.courseType.includes(c) }),
                    {} as Record<string, boolean>,
                  )}
                  onChange={next =>
                    updateFilters({
                      courseType: Object.entries(next)
                        .filter(([, v]) => v)
                        .map(([k]) => k),
                    })
                  }
                />
              ))}
            {degreeOptions.length > 0 &&
              (degreeOptions.length > 5 ? (
                <MultiSelectDropdown
                  label="Degree"
                  placeholder="Search Degree"
                  options={degreeOptions}
                  value={filters.degree}
                  onChange={degree => updateFilters({ degree })}
                />
              ) : (
                <CheckboxGroup
                  label="Degree"
                  options={degreeOptions.map(d => ({ key: d, label: d }))}
                  value={degreeOptions.reduce(
                    (acc, d) => ({ ...acc, [d]: filters.degree.includes(d) }),
                    {} as Record<string, boolean>,
                  )}
                  onChange={next =>
                    updateFilters({
                      degree: Object.entries(next)
                        .filter(([, v]) => v)
                        .map(([k]) => k),
                    })
                  }
                />
              ))}
          </div>
        </div>
        <hr className="my-6 border-customGray-10" />

        {/* Displayed Fields */}
        <div className="mt-6 pt-4 border border-customGray-10 p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-primary-dark font-inter mb-3">
            Displayed Fields
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {displayFieldKeys.map(key => (
              <label
                key={key}
                className="flex items-center gap-2 cursor-pointer text-sm font-inter"
              >
                <input
                  type="checkbox"
                  checked={displayedFields[key]}
                  onChange={e =>
                    onDisplayedFieldsChange({ ...displayedFields, [key]: e.target.checked })
                  }
                  className="rounded border-customGray-10"
                />
                {DISPLAYED_FIELD_LABELS[key]}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky footer: Clear Filters + View Results */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-customGray-10 bg-white pt-4 sm:px-6">
        <button
          type="button"
          onClick={handleClearFilters}
          className="text-sm font-inter text-primary-blue hover:underline"
        >
          Clear Filters
        </button>
        <div className="flex items-center gap-3">
          <select
            className="rounded-lg border border-customGray-10 bg-white px-3 py-2 text-sm font-inter"
            defaultValue=""
            aria-label="Select filter"
          >
            <option value="">Select filter</option>
          </select>
          <button
            type="button"
            onClick={onViewResults}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-blue px-5 py-2.5 font-inter text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <LockClosedIcon className="h-4 w-4" aria-hidden />
            View Results
          </button>
        </div>
      </div>
    </Modal>
  );
}
