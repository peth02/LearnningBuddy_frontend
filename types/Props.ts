import { Topic } from "./Course";

export interface TopicProps {
  handleNavigate: (id: string) => void;
  handleDel: (id: string) => void;
  index: number;
  topic: Topic;
  isOwner: boolean;
}
