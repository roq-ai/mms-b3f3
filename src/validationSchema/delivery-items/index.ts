import * as yup from 'yup';

export const deliveryItemValidationSchema = yup.object().shape({
  name: yup.string().required(),
  quantity: yup.number().integer().required(),
  price: yup.number().integer().nullable(),
  weight: yup.number().integer().nullable(),
  deadline: yup.date().nullable(),
  delivery_note_id: yup.string().nullable().required(),
});
