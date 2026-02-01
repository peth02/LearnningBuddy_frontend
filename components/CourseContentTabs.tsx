export function Topics() {
  return (
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
  );
}

export function Flashcards() {
  return (
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
  );
}

export function Quizzes() {
  return (
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
  );
}
