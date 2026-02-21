import { Course, Quiz2 } from "./Course";

export interface EditCourseFormProps {
  data: Course;
  setDataForm: (field: keyof Course, value: any) => void;
  stateChange: () => void;
}

export interface UpdateCourseTopicsProps {
  id?: string;
  order_index: string;
  description: string;
  raw_text: string;
  summary_note: string;
  title: string;
}

export interface EditQuizFormProps {
  quiz: Quiz2;
  setDataForm: (field: keyof Quiz2, value: any) => void;
  stateChange: () => void;
}
