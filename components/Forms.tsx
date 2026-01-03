import { redirect } from "next/navigation";
import Form from "next/form";
import React, { ChangeEvent, useState } from "react";

export function EditCourseForm(props: any) {
  const EditCourseHandler = () => {
    alert("Successfully edit course");
    console.log("edit Course");
    props.stateChange();
    // location.reload()
  };
  const DeleteCourseHandler = () => {
    const remove = confirm("do you want to delete this course");
    if (remove) {
      console.log("delete Course");
      // redirect("/my_created_courses");
    } else {
      console.log("phewww almost delete a course");
    }
  };

  return (
    <section>
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
        <label>
          <input 
            name="isPublic"
            type="checkbox"
            defaultChecked={true}
          />
          <span>Public</span>
        </label>
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
    </section>
  );
}

export function CreateCourseForm(props: any) {
  type Status = "idle" | "loading" | "error";

  const [stage, setStage] = useState(1);
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [uploadProgress, SetUploadProgress] = useState();

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.closest("form");
    if (form) {
      if (form.checkValidity()) {
        setStage((prev) => prev + 1);
      } else {
        form.reportValidity();
      }
    }
  };
  const handleBack = () => {
    setStage((prev) => prev - 1);
  };
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const handleSubmit = () => {
    const form = new FormData();
  };
  return (
    <div>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={props.stageChange}
      />
      <section className="bg-white border-1 rounded-lg bg-white border-1 rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-5">
        <button
          onClick={props.stageChange}
          className="absolute top-2 right-5 text-gray-400 cursor-pointer"
        >
          x
        </button>
        <Form
          action={() => {
            console.log("submit name:", name, "desc :", desc, "file :", file);
          }}
        >
          {stage == 1 && (
            <div className="flex flex-col">
              <div>Name Your Course</div>
              <p>Give your Course a descriptive name and description</p>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={name}
                required={true}
                onChange={(e) => setName(e.target.value)}
                className="border-1"
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={desc}
                required={true}
                onChange={(e) => setDesc(e.target.value)}
                className="border-1"
              />
              <button
                type="button"
                onClick={handleNext}
                className="w-[100px] ml-auto bg-blue-500 text-white font-bold p-2 rounded-lg cursor-pointer hover:bg-blue-600"
              >
                Continue
              </button>
            </div>
          )}
          {stage == 2 && (
            <div>
              <div>submit</div>
              <input
                type="file"
                accept=".pdf"
                required={true}
                onChange={handleFile}
              />
              <button onClick={handleBack}>Back</button>
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold p-2 rounded-lg cursor-pointer hover:bg-blue-600"
              >
                Continue
              </button>
            </div>
          )}
        </Form>
      </section>
    </div>
  );
}
