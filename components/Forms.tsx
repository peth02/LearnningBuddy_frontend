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
          <input name="isPublic" type="checkbox" defaultChecked={true} />
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
      <section className="bg-white border-1 rounded-lg bg-white border-1 rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <Form
          action={() => {
            console.log("submit name:", name, "desc :", desc, "file :", file);
          }}
        >
          {stage == 1 && (
            <div>
              <div className="flex justify-between m-5">
                <div>Name Your Course</div>
                <button
                  onClick={props.stageChange}
                  className="text-gray-400 cursor-pointer hover:underline"
                >
                  x
                </button>
              </div>
              <hr />
              <div className="flex flex-col gap-5 m-5">
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
              </div>
              <hr />
              <div className="flex m-5">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-[100px] ml-auto bg-blue-500 text-white font-bold p-2 rounded-lg cursor-pointer hover:bg-blue-600"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          {stage == 2 && (
            <div>
              <div className="flex justify-between m-5">
                <div>Upload file</div>
                <button
                  onClick={props.stageChange}
                  className="text-gray-400 cursor-pointer hover:underline"
                >
                  x
                </button>
              </div>
              <hr />
              <div className="m-5">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PDF only (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    required
                    onChange={handleFile}
                  />
                </label>
                <div className="mt-3">upload status</div>
              </div>
              <hr />
              <div className="flex justify-between m-5">
                <button onClick={handleBack} className="cursor-pointer">
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold p-2 rounded-lg cursor-pointer hover:bg-blue-600"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </Form>
      </section>
    </div>
  );
}
