import { DeliveryNoteInterface } from 'interfaces/delivery-note';
import { GetQueryInterface } from 'interfaces';

export interface ExcelImportInterface {
  id?: string;
  file_name: string;
  imported_at?: any;
  item_limit?: number;
  delivery_note_id: string;
  created_at?: any;
  updated_at?: any;

  delivery_note?: DeliveryNoteInterface;
  _count?: {};
}

export interface ExcelImportGetQueryInterface extends GetQueryInterface {
  id?: string;
  file_name?: string;
  delivery_note_id?: string;
}
