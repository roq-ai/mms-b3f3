import { DeliveryNoteInterface } from 'interfaces/delivery-note';
import { GetQueryInterface } from 'interfaces';

export interface DeliveryItemInterface {
  id?: string;
  name: string;
  quantity: number;
  price?: number;
  weight?: number;
  deadline?: any;
  delivery_note_id: string;
  created_at?: any;
  updated_at?: any;

  delivery_note?: DeliveryNoteInterface;
  _count?: {};
}

export interface DeliveryItemGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  delivery_note_id?: string;
}
