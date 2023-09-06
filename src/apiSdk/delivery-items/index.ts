import axios from 'axios';
import queryString from 'query-string';
import { DeliveryItemInterface, DeliveryItemGetQueryInterface } from 'interfaces/delivery-item';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getDeliveryItems = async (
  query?: DeliveryItemGetQueryInterface,
): Promise<PaginatedInterface<DeliveryItemInterface>> => {
  const response = await axios.get('/api/delivery-items', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createDeliveryItem = async (deliveryItem: DeliveryItemInterface) => {
  const response = await axios.post('/api/delivery-items', deliveryItem);
  return response.data;
};

export const updateDeliveryItemById = async (id: string, deliveryItem: DeliveryItemInterface) => {
  const response = await axios.put(`/api/delivery-items/${id}`, deliveryItem);
  return response.data;
};

export const getDeliveryItemById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/delivery-items/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDeliveryItemById = async (id: string) => {
  const response = await axios.delete(`/api/delivery-items/${id}`);
  return response.data;
};
