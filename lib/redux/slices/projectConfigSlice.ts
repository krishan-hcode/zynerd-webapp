import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface SubscriptionRenewalReminderMessages {
  extension_expired_message: string;
  extension_expiring_message: string;
  upgrade_expired_message: string;
  upgrade_expiring_message: string;
}

interface CustomModuleScreenConfig {
  all_questions: string;
  qbank: string;
  previous_year_questions: string;
  grand_test_questions: string;
  bookmarked_questions: string;
}

interface TestAnalyticsConfig {
  air_card: boolean;
  difficulty_level_chart: boolean;
  gt_progress_chart: boolean;
  improvement_analysis_chart: boolean;
  last_3_gt_comparison_chart: boolean;
  percentile_distribution_chart: boolean;
  previous_gt_comparison_card_percentage: boolean;
  score_comparison_card: boolean;
  score_comparison_chart: boolean;
  score_distribution_chart: boolean;
}

interface QbankConfig {
  accuracy_and_momentum: boolean;
  badge_card: boolean;
  daily_que_attempted_trends: boolean;
  overall_accuracy: boolean;
  subject_accuracy_card: boolean;
  your_percentile: boolean;
}

interface ConfigState {
  premium_access_restricted_message: string;
  modify_user_address: boolean;
  subscription_renewal_reminder_messages: SubscriptionRenewalReminderMessages;
  custom_module_screen_config: CustomModuleScreenConfig;
  audio_explanation_heading: string;
  video_explanation_heading: string;
  test_analytics: TestAnalyticsConfig;
  qbank_analytics: QbankConfig;
  accuracy_graph_strength_offset: {
    weak: number;
    medium: number;
    strong: number;
  };
  default_subject_name_for_test: Record<number, string>;
}

const initialState: ConfigState = {
  premium_access_restricted_message: '',
  modify_user_address: false,
  subscription_renewal_reminder_messages: {
    extension_expired_message: '',
    extension_expiring_message: '',
    upgrade_expired_message: '',
    upgrade_expiring_message: '',
  },
  custom_module_screen_config: {
    all_questions: '',
    qbank: '',
    previous_year_questions: '',
    grand_test_questions: '',
    bookmarked_questions: '',
  },
  audio_explanation_heading: '',
  video_explanation_heading: '',
  test_analytics: {
    air_card: true,
    difficulty_level_chart: true,
    gt_progress_chart: true,
    improvement_analysis_chart: true,
    last_3_gt_comparison_chart: true,
    percentile_distribution_chart: true,
    previous_gt_comparison_card_percentage: true,
    score_comparison_card: true,
    score_comparison_chart: true,
    score_distribution_chart: true,
  },
  qbank_analytics: {
    accuracy_and_momentum: true,
    badge_card: true,
    daily_que_attempted_trends: true,
    overall_accuracy: true,
    subject_accuracy_card: true,
    your_percentile: true,
  },
  accuracy_graph_strength_offset: {
    weak: 0,
    medium: 0,
    strong: 0,
  },
  default_subject_name_for_test: {},
};

// TODO: Moivng this data from redux to index db in next release
const projectConfigSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setProjectConfig: (state, action: PayloadAction<ConfigState>) => {
      return {...action.payload}; // Ensure a new state object is returned
    },
    clearProjectConfig: () => initialState, // Correctly set state back to null
  },
});

export const {setProjectConfig, clearProjectConfig} =
  projectConfigSlice.actions;
export default projectConfigSlice.reducer;
