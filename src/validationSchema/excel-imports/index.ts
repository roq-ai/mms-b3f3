import * as yup from 'yup';

export const excelImportValidationSchema = yup.object().shape({
  file_name: yup.string().required(),
  imported_at: yup.date().required(),
  item_limit: yup.number().integer().nullable(),
  delivery_note_id: yup.string().nullable().required(),
});
