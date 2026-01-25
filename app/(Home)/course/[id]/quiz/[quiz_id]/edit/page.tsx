'use client'

export default function editQuiz() {
    const handleCreateQuiz = () => {
        console.log("createquiz")
    }
    const handleBack = () => {
        history.back()
    }
  return (
    <div className="flex flex-col min-h-screen gap-7 py-10 px-20 bg-gray-100">
        <button onClick={handleBack} className="cursor-pointer mr-auto underline text-gray-600">Back</button>
        {/* head */}
        <section className="flex justify-between p-5 bg-white rounded-lg">
            <div >Quiz 1</div>
            <button onClick={handleCreateQuiz} className="bg-blue-500 text-white font-bold p-2 rounded-lg cursor-pointer hover:bg-blue-600">Add Question</button>
        </section>
        {/* quiz */}
        <div className="flex">
            <section className="bg-white">
                <div>
                    question 1
                </div>
            </section>
            <section className="bg-white">

            </section>
        </div>
    </div>
  );
}
