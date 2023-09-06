import axios from 'axios';
import queryString from 'query-string';
import { InvalidNoteInterface, InvalidNoteGetQueryInterface } from 'interfaces/invalid-note';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getInvalidNotes = async (
  query?: InvalidNoteGetQueryInterface,
): Promise<PaginatedInterface<InvalidNoteInterface>> => {
  const response = await axios.get('/api/invalid-notes', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createInvalidNote = async (invalidNote: InvalidNoteInterface) => {
  const response = await axios.post('/api/invalid-notes', invalidNote);
  return response.data;
};

export const updateInvalidNoteById = async (id: string, invalidNote: InvalidNoteInterface) => {
  const response = await axios.put(`/api/invalid-notes/${id}`, invalidNote);
  return response.data;
};

export const getInvalidNoteById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/invalid-notes/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteInvalidNoteById = async (id: string) => {
  const response = await axios.delete(`/api/invalid-notes/${id}`);
  return response.data;
};
