export default function CoursesCard(props:any) {
    return(
        <div className="flex flex-col max-w-[300px] py-7 px-5 gap-4 bg-white rounded-lg border-2 border-gray-300">
            <h4 className="text-l font-bold">header</h4>
            <p>description</p>
            <div className="flex justify-between text-gray-500">
                <div>total topics</div>
                <div>total quizzes</div>
            </div>
            <button className="">view continue</button>
        </div>
    );
}