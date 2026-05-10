"use client";

import css from "./NoteForm.module.css";
import { useId } from "react";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, CreateNote } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { useNoteDraftStore } from "@/lib/store/noteStore";

// const Schema = Yup.object().shape({
//   title: Yup.string()
//     .min(3, "Minimum 3 characters")
//     .max(50, "Maximum 50 characters")
//     .required("Title is required"),

//   content: Yup.string().max(500, "Maximum 500 characters"),

//   tag: Yup.string()
//     .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
//     .required("Tag is required"),
// });

function NoteForm() {
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const queryClient = useQueryClient();
  const titleFieldId = useId();
  const contentFieldId = useId();
  const tagFieldId = useId();
  const router = useRouter();

  function onClose() {
    router.back();
  }

  const { mutate: createMutate } = useMutation({
    mutationFn: async (newNote: CreateNote) => {
      return await createNote(newNote);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Notes"],
      });
      clearDraft();
      onClose();
    },
  });

  const handleSubmit = (formData: FormData) => {
    const values = Object.fromEntries(formData);
    createMutate(values as unknown as CreateNote);
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`${titleFieldId}-title`}>Title</label>
        <input
          id={`${titleFieldId}-title`}
          type="text"
          name="title"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
        />
        {/* <ErrorMessage name="title" component="span" className={css.error} /> */}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${contentFieldId}-content`}>Content</label>

        <textarea
          name="content"
          id={`${contentFieldId}-content`}
          className={css.textarea}
          rows={8}
          value={draft.content}
          onChange={handleChange}
        ></textarea>
        {/* <ErrorMessage name="content" component="span" className={css.error} /> */}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${tagFieldId}-tag`}>Tag</label>
        <select
          name="tag"
          id={`${tagFieldId}-tag`}
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {/* <ErrorMessage name="tag" component="span" className={css.error} /> */}
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={false}>
          Create note
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
