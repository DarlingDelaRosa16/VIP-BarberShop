import { PersonGetI } from '../../../../../interface/general.Interface';
import { ProductGetI } from '../../products/interface/product.interface';


export interface inboundI {
  id: number,
  entry_type: string,
  entry_date: Date,
  invoice_number: string
  note: string,
  total: number,
  created_by: PersonGetI
  updated_by: number,
  created_at: Date,
  updated_at: Date,
  deleted_at: null | Date,
  entry_details: entryDetailI[]
}

export interface inboundGetI {
  created_at: Date
  created_by: string
  entry_date: Date
  entry_type: string
  id: number
  invoice_number: string
  note: string
  products: {
    product_id: number
    product_name: string
    quantity: number
    subtotal: string
    unit_cost: string
  }[]
  total: string
  updated_at: Date
  updated_by: string
}

export interface entryDetailI {
  entry_id: number
  id: number
  product: ProductGetI
  product_id: number
  quantity: number
  unit_cost: string
}
