import * as yup from 'yup';

export const deliveryNoteValidationSchema = yup.object().shape({
  note_number: yup.string().required(),
  issuer: yup.string().required(),
  addressee: yup.string().required(),
  company_id: yup.string().nullable().required(),
});
