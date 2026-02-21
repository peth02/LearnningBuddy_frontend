export interface CourseMetaData {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  totalTopics: number;
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
