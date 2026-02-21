import { Quiz, Topic } from "./Course";

export interface TopicProps {
  // props for topic card in course page ( show topic )
  handleNavigate: (id: string) => void;
  handleDel: (e:React.MouseEvent, id: string) => void;
  index: number;
  topic: Topic;
  isOwner: boolean;
}

export interface CourseNavItemProps {
  // props for navbar in course's topics page
  index: string;
  label: string;
  showDelete: boolean;
  onDelete: (idx: number) => void;
}

export interface QuizProps {
  // props for quiz card in course page ( show quiz )
  handleNavigateTo: (id: string) => void;
  handleNavigateEdit: (id: string) => void;
  index: number;
  quiz: Quiz;
  isOwner: boolean;
}