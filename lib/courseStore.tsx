import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  _hasHydrated: boolean; // เพิ่มเพื่อเช็คสถานะการโหลดจาก Storage

  // Actions
  setHasHydrated: (state: boolean) => void; // Action สำหรับอัปเดตสถานะ
  setCourse: (course: Course) => void;
  updateCourseInfo: (title: string, desc: string) => void;
  
  // Topic Actions
  addTopic: (topic: Topic) => void;
  removeTopic: (id: number) => void;
  updateTopic: (id: number, updatedTopic: Topic) => void;
  getTopicById: (id: number) => Topic | undefined;
}

// export const useCourseStore = create<CourseStore>((set, get) => ({

//   course: mockData,

//   setCourse: (course) => set({ course }),

//   updateCourseInfo: (title, description) =>
//     set((state) => ({
//       course: state.course ? { ...state.course, title, description } : null
//     })),

//   addTopic: (topic) =>
//     set((state) => ({
//       course: state.course
//         ? { ...state.course, topics: [...state.course.topics, topic] }
//         : null
//     })),

//   removeTopic: (id) =>
//     set((state) => ({
//       course: state.course
//         ? { ...state.course, topics: state.course.topics.filter(t => t.order_index !== id) }
//         : null
//     })),

//   updateTopic: (id, updatedTopic) =>
//     set((state) => ({
//       course: state.course
//         ? {
//             ...state.course,
//             topics: state.course.topics.map(t => t.order_index === id ? updatedTopic : t)
//           }
//         : null
//     })),

//   getTopicById: (id) => get().course?.topics.find(t => t.order_index === id)
// }));

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      course: null,
      _hasHydrated: false, // เพิ่ม state นี้
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
      setCourse: (course) => set({ course }),
      updateCourseInfo: (title, description) =>
        set((state) => ({
          course: state.course ? { ...state.course, title, description } : null,
        })),

      addTopic: (topic) =>
        set((state) => ({
          course: state.course
            ? { ...state.course, topics: [...state.course.topics, topic] }
            : null,
        })),

      removeTopic: (id) =>
        set((state) => ({
          course: state.course
            ? {
                ...state.course,
                topics: state.course.topics.filter((t) => t.order_index !== id),
              }
            : null,
        })),

      updateTopic: (id, updatedTopic) =>
        set((state) => ({
          course: state.course
            ? {
                ...state.course,
                topics: state.course.topics.map((t) =>
                  t.order_index === id ? updatedTopic : t,
                ),
              }
            : null,
        })),

      getTopicById: (id) =>
        get().course?.topics.find((t) => t.order_index === id),
    }),
    {
      name: "course-storage", // ข้อมูลจะถูกเซฟใน LocalStorage ภายใต้ชื่อนี้
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true); // ทำงานเมื่อโหลดจาก localStorage เสร็จ
      }
    },
  ),
);
