import { Course } from "./Course";

export interface EditCourseFormProps {
  data: Course;
  setDataForm: (field: keyof Course, value: any) => void;
  stateChange: () => void;
}