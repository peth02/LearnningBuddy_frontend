import { create } from 'zustand';

// --- Interfaces (เหมือนเดิม) ---
export interface Topic {
  order_index: number;
  title: string;
  description: string;
  raw_text: string;
  summary_note: string;
}

export interface Course {
  title: string;
  description: string;
  topics: Topic[];
}

interface CourseStore {
  course: Course | null;
  
  // Actions
  setCourse: (course: Course) => void;
  updateCourseInfo: (title: string, desc: string) => void;
  
  // Topic Actions
  addTopic: (topic: Topic) => void;
  removeTopic: (id: number) => void;
  updateTopic: (id: number, updatedTopic: Topic) => void;
  getTopicById: (id: number) => Topic | undefined;
}

const mockData: Course = {
  title: "Advanced Software Engineering",
  description: "Deep dive into object-oriented principles and design patterns.",
  topics: [
    {
      order_index: 1,
      title: "Creating and Destroying Objects",
      description: "Principles of objalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;lalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;lalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;lalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;lalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;lalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;lalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;lalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;lalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;lalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;lalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;l  ect creation and destruction.adsfojadsflkjasld;kfja;lkdsjf;lakdsjfa;lkdsjf..",
      raw_text: "THIS chapter concerns..alskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;lalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;l.",
      summary_note: "- **Object Creation Principles**.alskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;lalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;lalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;lalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;l.."
    },
    {
      order_index: 2,
      title: "Methods Common to All Objects",
      description: "Overriding equals, hashCode, toString.alkdsfja;lkdsfja;lkdsjfa;lkdjf;lakdjfa;lkdsjfalkds;fj..",
      raw_text: ".alskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;ldskfj..",
      summary_note: ".alskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;lalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;lalskdfj;alksdfj;alkdsfj;alksdjf;laksdjf;lajs;dlfkja;sdlkfja;l.."
    }
  ]
};

export const useCourseStore = create<CourseStore>((set, get) => ({
  course: mockData,

  setCourse: (course) => set({ course }),

  updateCourseInfo: (title, description) => 
    set((state) => ({
      course: state.course ? { ...state.course, title, description } : null
    })),

  addTopic: (topic) => 
    set((state) => ({
      course: state.course 
        ? { ...state.course, topics: [...state.course.topics, topic] } 
        : null
    })),

  removeTopic: (id) => 
    set((state) => ({
      course: state.course 
        ? { ...state.course, topics: state.course.topics.filter(t => t.order_index !== id) } 
        : null
    })),

  updateTopic: (id, updatedTopic) => 
    set((state) => ({
      course: state.course 
        ? { 
            ...state.course, 
            topics: state.course.topics.map(t => t.order_index === id ? updatedTopic : t) 
          } 
        : null
    })),
    
  getTopicById: (id) => get().course?.topics.find(t => t.order_index === id)
}));
