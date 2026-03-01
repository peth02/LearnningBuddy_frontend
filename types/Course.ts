export interface PreviewCourseResponse {
  job_id: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  result?: GenerateCourse;
}

export interface GenerateCourse {
  title: string;
  description: string;
  is_published?: boolean;
  topics: Topic3[];
}

export interface Topic3 {
  // topic for create course from preview
  order_index: string;
  description: string;
  raw_text: string;
  summary_note: string;
  title: string;
}
export interface CourseMetaData {
  id?: string;
  title: string;
  description: string;
  is_published: boolean;
  totalTopics?: number;
}
export interface Topic {
  // Topic for getting course using get url/courses/{course_id}
  topicId: string;
  title: string;
  description: string;
  orderIndex: string;
}

export interface Topic2 {
  // Topic for getting topic by topic_id
  id: string;
  order_index: string;
  description: string;
  raw_text: string;
  summary_note: string;
  title: string;
}
export interface Course {
  course_id: string;
  created_at: Date;
  description: string;
  is_enrolled: boolean;
  is_owner: boolean;
  is_published: boolean;
  title: string;
  topics: Topic[];
  updated_at: Date;
}

export interface QuizMetaData {
  title: string;
  solution_visibility: "ALWAYS" | "NEVER";
  is_published: boolean;
}

export interface Quiz {
  // Quiz from get quizzes
  created_at: Date;
  is_published: boolean;
  question_count: number;
  quiz_id: string;
  solution_visibility: "ALWAYS" | "NEVER";
  title: string;
  updated_at: Date;
}

export interface Quiz2 {
  // Quiz from get quiz by quiz_id
  quiz_id: string;
  course_id: string;
  title: string;
  is_published: boolean;
  solution_visibility: "ALWAYS" | "NEVER";
  questions: Question[];
  created_at: Date;
  updated_at: Date;
}

export interface Question {
  id?: string;
  topic_id: string;
  question_text: string;
  question_type:
    | "NORMAL_MULTIPLE"
    | "STATEMENT_VERIFICATION"
    | "STATEMENT_COUNTING";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  explanation: string;
  choices: Choice[];
}
export interface Choice {
  id?: string;
  choice_text: string;
  is_correct: boolean;
}

export interface Quiz3 {
  // Quiz from get quiz attemp ( start quiz )
  quiz_id: string;
  course_id: string;
  title: string;
  is_published: boolean;
  solution_visibility: "ALWAYS" | "NEVER";
  questions: Question2[];
  created_at: Date;
  updated_at: Date;
}

export interface Question2 {
  // Question for quiz attemp ( start quiz )
  id: string;
  topic_id: string;
  question_text: string;
  question_type:
    | "NORMAL_MULTIPLE"
    | "STATEMENT_VERIFICATION"
    | "STATEMENT_COUNTING";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  explanation: string;
  choices: Choice2[];
}
export interface Choice2 {
  // Choice for quiz attemp ( start quiz )
  id: string;
  choice_text: string;
}

export interface QuizResult {
  attempt_id: number;
  total_score: number;
  max_score: number;
  start_time: string; // หรือ Date หากคุณทำการแปลงข้อมูลก่อน
  end_time: string;
  duration_seconds: number;
  feedback: QuestionFeedback[];
}

export interface QuestionFeedback {
  question_id: number;
  question_text: string;
  isCorrect: boolean;
  user_choice_ids: number[];
  correct_choice_ids: number[];
  explanation: string;
  choices: FeedbackChoice[];
}

export interface FeedbackChoice {
  id: number;
  choice_text: string;
}

export interface PreviewQuizResponse {
  job_id: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  progress_percent: number;
  result?: GenerateQuestion;
}

export interface GenerateQuestion {
  generated_questions: Question[];
}

export interface DeckMetaData {
  title: string;
  is_published: boolean;
}
export interface FlashcardDeck {
  deck_id: string;
  title: string;
  is_published: boolean;
  card_count: number;
  created_at: string; // หรือใช้ Date หากคุณทำการแปลงข้อมูลก่อนใช้งาน
  updated_at: string;
}

export interface FlashcardDeck2 {
  // deck from get deck by deckId
  deck_id: string;
  course_id: string;
  title: string;
  is_published: boolean;
  cards: Flashcard[];
}
export interface DeckTopicConfig {
  topic_id: number;
  amount: number;
}

export interface PreviewDeckResponse {
  job_id: string;
  course_id: string;
  course_title: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  progress_percent: number;
  result?: GenerateFlashcard;
}

export interface GenerateFlashcard {
  generated_cards: Flashcard[];
}

export interface Flashcard {
  id?: string;
  topic_id: string;
  front_text: string;
  back_text: string;
}
