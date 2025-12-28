import { redirect } from "next/navigation";
import Form from "next/form";

export function EditCourseForm(props: any) {
  const EditCourseHandler = () => {
    alert("Successfully edit course")
    console.log("edit Course");
    props.stateChange()
    // location.reload()
  };
  const DeleteCourseHandler = () => {
    const remove = confirm("do you want to delete this course")
    if (remove) {
        console.log("delete Course");
        // redirect("/my_created_courses");
    } else {
        console.log("phewww almost delete a course")
    }
  };

  return (
    <div>
      <div>Edit course</div>
      <Form action={EditCourseHandler} className="flex flex-col mt-5 gap-5">
        <input
          name="name"
          type="text"
          required={true}
          defaultValue={"1"}
          placeholder="Name"
          className="border-1"
        />

        <input
          name="description"
          type="text"
          required={true}
          defaultValue={"stesilatf"}
          placeholder="Description"
          className="border-1"
        />
        <div className="flex gap-10">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg cursor-pointer hover:bg-blue-600"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={DeleteCourseHandler}
            className="bg-red-500 text-white p-2 rounded-lg cursor-pointer hover:bg-red-600"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={props.stateChange}
            className="bg-white text-black p-2 border-2 border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            Cancle
          </button>
        </div>
      </Form>
    </div>
  );
}
