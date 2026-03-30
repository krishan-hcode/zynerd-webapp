import { classNames } from '@/utils/utils';
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type CounsellingTimelineStepStatus = 'done' | 'current' | 'upcoming';

export interface CounsellingTimelineStep {
  date: string;
  title: string;
  status: CounsellingTimelineStepStatus;
}

interface CounsellingTimelineProps {
  steps: CounsellingTimelineStep[];
  showHeader?: boolean;
  showControls?: boolean;
}

const STEP_WIDTH_PX = 220;

export default function CounsellingTimeline({
  steps,
  showHeader = true,
  showControls = true,
}: CounsellingTimelineProps) {
  const currentTimelineIndex = steps.findIndex(s => s.status === 'current');
  const safeCurrentTimelineIndex =
    currentTimelineIndex === -1 ? steps.length - 1 : currentTimelineIndex;

  // Circle sizing (must match the `h-6 w-6` wrapper used below).
  const circleDiameterPx = 24;
  const circleRadiusPx = circleDiameterPx / 2;

  // Render connectors as segments between circles so we leave a horizontal gap.
  // Segment width: from (circle right edge) -> (next circle left edge).
  const connectorSideGapPx = 8;
  const connectorWidthPx = STEP_WIDTH_PX - circleDiameterPx - connectorSideGapPx * 2;
  const connectorLeftOffsetPx =
    STEP_WIDTH_PX / 2 + circleRadiusPx + connectorSideGapPx;
  const connectorTopPx = 18;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    const handle = () => updateScrollState();
    el.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle, { passive: true });
    return () => {
      el.removeEventListener('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, [updateScrollState, steps.length]);

  const scrollByAmount = useCallback((direction: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * STEP_WIDTH_PX * 2,
      behavior: 'smooth',
    });
  }, []);

  const currentStepLabel = useMemo(() => {
    const current = steps.find(s => s.status === 'current');
    return current?.title ?? '';
  }, [steps]);

  return (
    <div>
      {(showHeader || showControls) && (
        <div
          className={classNames(
            'flex items-start justify-between',
            showHeader ? 'mb-4' : 'mb-2',
          )}>
          <div>
            {showHeader ? (
              <>
                <h3 className="text-xl font-semibold font-besley text-primary-dark">
                  Counselling Timeline
                </h3>
                {currentStepLabel ? (
                  <p className="mt-1 text-[11px] font-inter text-customGray-60">
                    Current: {currentStepLabel}
                  </p>
                ) : null}
              </>
            ) : null}
          </div>

          {showControls && steps.length > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Scroll timeline left"
                disabled={!canScrollLeft}
                onClick={() => scrollByAmount(-1)}
                className={classNames(
                  'inline-flex items-center justify-center rounded-full border px-3 py-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue/60',
                  canScrollLeft
                    ? 'border-customGray-10 bg-white text-primary-dark hover:border-primary-blue/30 hover:shadow-sm'
                    : 'border-customGray-15 bg-customGray-3/60 text-customGray-60 cursor-not-allowed',
                )}>
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Scroll timeline right"
                disabled={!canScrollRight}
                onClick={() => scrollByAmount(1)}
                className={classNames(
                  'inline-flex items-center justify-center rounded-full border px-3 py-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue/60',
                  canScrollRight
                    ? 'border-customGray-10 bg-white text-primary-dark hover:border-primary-blue/30 hover:shadow-sm'
                    : 'border-customGray-15 bg-customGray-3/60 text-customGray-60 cursor-not-allowed',
                )}>
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      )}

      <div
        ref={scrollRef}
        className={classNames(
          showHeader ? 'mt-4' : 'mt-0',
          'overflow-x-auto scroll-smooth thin-scrollbar',
        )}>
        <div className="relative" style={{ minWidth: steps.length * STEP_WIDTH_PX }}>
          {/* Base connectors (grey) */}
          {steps.length > 1
            ? steps.slice(0, -1).map((_, idx) => (
              <div
                key={`connector-base-${idx}`}
                aria-hidden={true}
                className="absolute h-[3px] rounded-full bg-customGray-10/60"
                style={{
                  left: idx * STEP_WIDTH_PX + connectorLeftOffsetPx,
                  top: connectorTopPx,
                  width: connectorWidthPx,
                }}
              />
            ))
            : null}

          {/* Progress overlay (green) up to current */}
          {steps.length > 1
            ? steps.slice(0, -1).map((_, idx) => {
              if (idx >= safeCurrentTimelineIndex) return null;
              return (
                <div
                  key={`connector-green-${idx}`}
                  aria-hidden={true}
                  className="absolute h-[3px] rounded-full bg-secondary-green shadow-lg shadow-secondary-green/25 "
                  style={{
                    left: idx * STEP_WIDTH_PX + connectorLeftOffsetPx,
                    top: connectorTopPx,
                    width: connectorWidthPx,
                  }}
                />
              );
            })
            : null}

          <div className="flex items-start">
            {steps.map((step, idx) => {
              const isDone = step.status === 'done';
              const isCurrent = step.status === 'current';
              const isUpcoming = step.status === 'upcoming';

              return (
                <div key={`${step.title}-${idx}`} className="w-[220px] shrink-0 px-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={classNames(
                        'relative z-10 mt-2 flex h-6 w-6 items-center justify-center rounded-full border transition-transform duration-200 hover:scale-[1.04]',
                        isDone
                          ? 'bg-secondary-green text-white border-secondary-green'
                          : isCurrent
                            ? 'bg-primary-blue text-white border-primary-blue'
                            : 'bg-customGray-3/60 text-customGray-50 border-customGray-10',
                      )}>
                      {isUpcoming ? (
                        <ClockIcon className="h-5 w-5 text-customGray-60" />
                      ) : (
                        <CheckIcon className="h-3 w-3 font-medium" />
                      )}
                    </div>

                    <p className="mt-2 text-xxs sm:text-xs text-customGray-60 font-inter truncate">
                      {step.date}
                    </p>
                  </div>

                  <div className="mt-2 text-center">
                    <p
                      className={classNames(
                        'text-xxs sm:text-sm font-inter font-semibold',
                        isDone
                          ? 'text-customGray-90'
                          : isCurrent
                            ? 'text-primary-dark'
                            : 'text-customGray-60',
                      )}>
                      {step.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

