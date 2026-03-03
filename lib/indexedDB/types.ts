export interface IQuestionChoice {
  id: number;
  text: string;
}
export interface ITestSeriesData {
  [testId: string | number]: ITestSeriesSection;
}

export interface ITestSeriesSection {
  [sectionId: string | number]: ITestSeriesQuestion[];
}

export interface IAttemptedChoice {
  id?: string;
  question_id: number;
  question_choice_id: number;
  solution: string;
  is_guessed: boolean;
  review_later: boolean;
  isSynced: boolean;
}

export interface ITestSeriesQuestion {
  id: number;
  text: string;
  map_id: number;
  solution: string;
  unique_key: string;
  is_bookmarked: boolean;
  choices: IQuestionChoice[];
  correct_choice_id: number | null;
  attempted_choice: IAttemptedChoice | null;
  question_audio: string | null;
  question_video: string | null;
}

export interface ITestSeriesQuestionPayload {
  is_bookmarked: boolean;
  testId: number | string;
  correct_choice_id: number;
  sectionId: number | string;
  currentQuestionIndex: number;
  attemptedChoice: IAttemptedChoice | null;
}
