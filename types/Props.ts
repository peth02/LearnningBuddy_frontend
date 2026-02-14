import { Topic } from "./Course";

export interface TopicProps {
  handleNavigate: (id: string) => void;
  handleDel: (e:React.MouseEvent, id: string) => void;
  index: number;
  topic: Topic;
  isOwner: boolean;
}
