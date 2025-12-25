import { Course } from "@/types/Course"
import Link from "next/link";

export default function CoursesCard(props:any) {
    return(
        <div className="flex flex-col max-w-[400px] py-7 px-5 gap-4 bg-white rounded-lg border-2 border-gray-300">
            <div className="flex justify-between">
                <h4 className="text-l font-bold">{props.creator}</h4>
                {
                    props.isPublic | 0? (
                        <div className="text-green-500 bg-green-200 px-2 py-1 rounded-lg font-bold text-sm">Public</div>
                    ) : (
                        <div className="text-gray-500 bg-gray-200 px-2 py-1 rounded-lg font-bold text-sm">Private</div>
                    )
                }
            </div>
            <p>description : {props.description}</p>
            <div className="flex justify-between text-gray-500">
                <div>total topics</div>
                <div>total quizzes</div>
            </div>

            <Link href={"/course/1"} className="bg-blue-500 text-white font-bold p-2 rounded-lg text-center">Manage</Link>
        </div>
    );
}