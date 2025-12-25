export function Topics(items: any) {
  return (
    <div className="p-10">
      <div className="place-content-end">
        {/*  only creator can see */}
        <button className="mb-5 mr-auto min-w-[100px] bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer">
          + Add Topic
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <section className="bg-white rounded-lg border-2 border-gray-300 px-10 py-7 min-h-[100px]">
          <div className="flex gap-5">
            <div>1</div>
            <div className="flex flex-col">
              <div>topic 1</div>
              <div>description</div>
              <div>description</div>
            </div>
            <div className="ml-auto">
              <div>icon1</div>
              {/*  only creator can see */}
              <div>icon2</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function Flashcards() {
  return (
    <div className="p-10">
      <div className="place-content-end">
        {/*  only creator can see */}
        <button className="mb-5 mr-auto min-w-[100px] bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer">
          + Create Deck
        </button>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <section className="bg-white rounded-lg border-2 border-gray-300 px-10 py-7 min-h-[100px]">
          <div className="flex gap-5">
            <div>1</div>
            <div className="flex flex-col">
              <div>Deck name</div>
              <div>n topics</div>
              <div>topic : 1 2 3</div>
            </div>
            <div className="ml-auto">
              <div>edit</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function Quizzes() {
  return (
    <div className="p-10">
      <div className="place-content-end">
        {/*  only creator can see */}
        <button className="mb-5 mr-auto min-w-[100px] bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer">
          + Create Quiz
        </button>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <section className="bg-white rounded-lg border-2 border-gray-300 px-10 py-7 min-h-[100px]">
          <div className="flex gap-5">
            <div>1</div>
            <div className="flex flex-col">
              <div>Quiz name</div>
              <div>n topics</div>
              <div>topic : 1 2 3</div>
            </div>
            <div className="ml-auto">
              <div>edit</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}