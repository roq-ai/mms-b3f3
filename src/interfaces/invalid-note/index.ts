import { DeliveryNoteInterface } from 'interfaces/delivery-note';
import { GetQueryInterface } from 'interfaces';

export interface InvalidNoteInterface {
  id?: string;
  invalidated_at?: any;
  reason?: string;
  delivery_note_id: string;
  created_at?: any;
  updated_at?: any;

  delivery_note?: DeliveryNoteInterface;
  _count?: {};
}

export interface InvalidNoteGetQueryInterface extends GetQueryInterface {
  id?: string;
  reason?: string;
  delivery_note_id?: string;
}
