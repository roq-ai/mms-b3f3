import * as yup from 'yup';

export const invalidNoteValidationSchema = yup.object().shape({
  invalidated_at: yup.date().required(),
  reason: yup.string().nullable(),
  delivery_note_id: yup.string().nullable().required(),
});
