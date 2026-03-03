export interface ISuggestedContent {
  id: number;
  text: string;
  unique_key: string;
  difficulty_level: string;
  question_choices: {
    id: number;
    text: string;
  }[];
  question_audio: string | null;
  question_video: string | null;
  tags: string[];
  previously_attempted_choice: {
    correct_choice_id: number;
    is_bookmarked: boolean;
    qbank_id: null | number;
    question_choice: number;
    session_updated_date: string;
    solution: string;
    solution_audio: string | null;
    solution_video: string | null;
    solution_media_position: 'top' | 'bottom' | null;
    audio_explanation_heading: string | null;
    video_explanation_heading: string | null;
  } | null;
}

export interface IAnnouncements {
  count: number;
  next: null;
  previous: null;
  results: Result[];
}

export interface Result {
  id: number;
  created_at: Date;
  updated_at: Date;
  image_file: string;
  image_caption: null;
  description: string;
  doc_link: string;
  file: null;
  is_active: boolean;
  start_date: Date;
  end_date: Date;
  visibility: string;
  serial_no: null;
  created_by: number;
  updated_by: number;
  type: string;
}

export interface ITeacherItem {
  image_file: string;
  name: string;
  id: number;
  description: string;
  image_caption: string;
  subject_name: string;
}

export interface IProjectConfig {
  premium_access_restricted_message: string;
  download_screen_config: {
    max_downloads: number;
    parallel_downloads: number;
    max_downloads_error_message: string;
    parallel_downloads_error_message: string;
  };
  subscription_renewal_reminder_messages: {
    extension_expired_message: string;
    extension_expiring_message: string;
    upgrade_expired_message: string;
    upgrade_expiring_message: string;
  };
  custom_module_screen_config: {
    all_questions: string;
    qbank: string;
    previous_year_questions: string;
    grand_test_questions: string;
    bookmarked_questions: string;
  };
}

export interface ISubscriptionSchema {
  duration: number;
  start_at: Date;
  plan__id?: string;
  plan__type?: string;
  plan__collection__id?: number;
  plan__collection__name?: string;
  plan__collection__is_complete_course: boolean;
}
