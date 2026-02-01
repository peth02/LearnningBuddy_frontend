export interface Course {
    creator: string,
    description: string,
    url: string,
}

export interface CourseMetaData {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  totalTopics: number;
}