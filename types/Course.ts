export interface CourseMetaData {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  totalTopics: number;
}
export interface Topic {
  topicId: string;
  title: string;
  description: string;
  orderIndex: string;
}

export interface Topic2 {
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
