import axios from 'axios';
import queryString from 'query-string';
import { DeliveryNoteInterface, DeliveryNoteGetQueryInterface } from 'interfaces/delivery-note';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getDeliveryNotes = async (
  query?: DeliveryNoteGetQueryInterface,
): Promise<PaginatedInterface<DeliveryNoteInterface>> => {
  const response = await axios.get('/api/delivery-notes', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createDeliveryNote = async (deliveryNote: DeliveryNoteInterface) => {
  const response = await axios.post('/api/delivery-notes', deliveryNote);
  return response.data;
};

export const updateDeliveryNoteById = async (id: string, deliveryNote: DeliveryNoteInterface) => {
  const response = await axios.put(`/api/delivery-notes/${id}`, deliveryNote);
  return response.data;
};

export const getDeliveryNoteById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/delivery-notes/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDeliveryNoteById = async (id: string) => {
  const response = await axios.delete(`/api/delivery-notes/${id}`);
  return response.data;
};
