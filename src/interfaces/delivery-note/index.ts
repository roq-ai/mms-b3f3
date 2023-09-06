import { DeliveryItemInterface } from 'interfaces/delivery-item';
import { ExcelImportInterface } from 'interfaces/excel-import';
import { InvalidNoteInterface } from 'interfaces/invalid-note';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface DeliveryNoteInterface {
  id?: string;
  note_number: string;
  issuer: string;
  addressee: string;
  company_id: string;
  created_at?: any;
  updated_at?: any;
  delivery_item?: DeliveryItemInterface[];
  excel_import?: ExcelImportInterface[];
  invalid_note?: InvalidNoteInterface[];
  company?: CompanyInterface;
  _count?: {
    delivery_item?: number;
    excel_import?: number;
    invalid_note?: number;
  };
}

export interface DeliveryNoteGetQueryInterface extends GetQueryInterface {
  id?: string;
  note_number?: string;
  issuer?: string;
  addressee?: string;
  company_id?: string;
}
