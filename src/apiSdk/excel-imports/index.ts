import axios from 'axios';
import queryString from 'query-string';
import { ExcelImportInterface, ExcelImportGetQueryInterface } from 'interfaces/excel-import';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getExcelImports = async (
  query?: ExcelImportGetQueryInterface,
): Promise<PaginatedInterface<ExcelImportInterface>> => {
  const response = await axios.get('/api/excel-imports', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createExcelImport = async (excelImport: ExcelImportInterface) => {
  const response = await axios.post('/api/excel-imports', excelImport);
  return response.data;
};

export const updateExcelImportById = async (id: string, excelImport: ExcelImportInterface) => {
  const response = await axios.put(`/api/excel-imports/${id}`, excelImport);
  return response.data;
};

export const getExcelImportById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/excel-imports/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteExcelImportById = async (id: string) => {
  const response = await axios.delete(`/api/excel-imports/${id}`);
  return response.data;
};
