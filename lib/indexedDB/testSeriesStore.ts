import {TEST_SERIES, TEST_SERIES_UPDATED} from './constants';
import {emitIndexedDBEvent, initIndexedDB} from './initIndexedDB';
import {
  ITestSeriesData,
  ITestSeriesQuestion,
  ITestSeriesQuestionPayload,
} from './types';

/**
 * Fetches test series data from IndexedDB.
 * Returns an empty object if no data exists or in case of an error.
 * @returns {Promise<ITestSeriesData>} The stored test series data.
 */
export const fetchTestSeries = async () => {
  try {
    const db = await initIndexedDB();
    if (!db) return {};
    return (await db.get(TEST_SERIES, TEST_SERIES)) || {};
  } catch (error: any) {
    console.log('info: fetching test series', error);
    return {};
  }
};

/**
 * Stores test series questions in IndexedDB.
 * - Retrieves existing test series data.
 * - Merges new questions into the correct test and section.
 * - Emits an update event after successful storage.
 *
 * @param {string | number} testId - The unique identifier for the test.
 * @param {string | number} sectionId - The unique identifier for the section.
 * @param {ITestSeriesQuestion[]} testSeriesQuestions - The list of questions to store.
 */

export const storeTestSeriesQuestions = async (
  testId: string | number,
  sectionId: string | number,
  testSeriesQuestions: ITestSeriesQuestion[],
) => {
  try {
    const db = await initIndexedDB();
    if (!db) return;
    const testSeries: ITestSeriesData =
      (await db.get(TEST_SERIES, TEST_SERIES)) || {};

    if (!testSeries[testId]) {
      testSeries[testId] = {};
    }
    testSeries[testId][sectionId] = testSeriesQuestions;
    await db.put(TEST_SERIES, testSeries, TEST_SERIES);
    emitIndexedDBEvent(TEST_SERIES, TEST_SERIES, TEST_SERIES_UPDATED);
  } catch (error: any) {
    console.log('info: storing test series questions:', error);
  }
};

/**
 * Updates the attempted choice of a specific test series question in IndexedDB.
 * Efficiently retrieves and modifies the relevant question, ensuring data integrity.
 * Emits an event after updating the database.
 * @param {ITestSeriesQuestionPayload} testSeriesQuestionPayload - The testSeriesQuestionPayload containing testId, sectionId, currentQuestionIndex, and attemptedChoice.
 */
export const updateTestSeriesQuestions = async (
  testSeriesQuestionPayload: ITestSeriesQuestionPayload,
) => {
  try {
    const db = await initIndexedDB();
    if (!db) return;
    const testSeries: ITestSeriesData =
      (await db.get(TEST_SERIES, TEST_SERIES)) || {};

    const {testId, sectionId, currentQuestionIndex, attemptedChoice} =
      testSeriesQuestionPayload;
    const sectionQuestions = testSeries?.[testId]?.[sectionId] || [];

    if (Array.isArray(sectionQuestions) && sectionQuestions?.length) {
      const currentQuestion = sectionQuestions[currentQuestionIndex] || null;

      if (currentQuestion) {
        currentQuestion.attempted_choice = attemptedChoice;
        await db.put(TEST_SERIES, testSeries, TEST_SERIES);
        emitIndexedDBEvent(TEST_SERIES, TEST_SERIES, TEST_SERIES_UPDATED);
      }
    }
  } catch (error: any) {
    console.log('info: updating test series questions', error);
  }
};

/**
 * Resets a specific test series by removing its data from IndexedDB.
 * If the test exists, it deletes the entry and emits an update event.
 * @param {string | number} testId - The unique identifier for the test.
 */
export const resetTestSeries = async (testId: string | number) => {
  try {
    const db = await initIndexedDB();
    if (!db) return;
    const testSeries: ITestSeriesData =
      (await db.get(TEST_SERIES, TEST_SERIES)) || {};

    if (testId in testSeries) {
      delete testSeries[testId];
      await db.put(TEST_SERIES, testSeries, TEST_SERIES);
      emitIndexedDBEvent(TEST_SERIES, TEST_SERIES, TEST_SERIES_UPDATED);
    }
  } catch (error: any) {
    console.log('info: resetting test series', error);
  }
};
