import { Course, FlashcardDeck2, Quiz2, Topic2 } from "./Course";

export interface EditCourseFormProps {
  data: Course;
  setDataForm: (field: keyof Course, value: any) => void;
  stateChange: () => void;
  setAlert: (alert: { message: string; type: "success" | "error" } | null) => void;
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
  setAlert: (alert: { message: string; type: "success" | "error" } | null) => void;
}

export interface CreatePreviewQuizFormProps {
  stageChange: ()=> void;
  topics: Topic2[];
}

export interface CreatePreviewFlashcardProps {
  stageChange: ()=> void;
  topics: Topic2[];
}

export interface EditDeckFormProps {
  deck: FlashcardDeck2;
  setDataForm: (field: keyof FlashcardDeck2, value: any) => void;
  stateChange: () => void;
  setAlert: (alert: { message: string; type: "success" | "error" } | null) => void;
}