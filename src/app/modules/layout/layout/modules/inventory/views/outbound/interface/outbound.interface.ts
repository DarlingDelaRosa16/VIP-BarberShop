export interface OutboundPostI {
  id: number | null
  exit_type: string,
  exit_date: Date,
  note: string,
  products: OutboundProductI[]
}

export interface OutboundDispatchPostI {
  barber_id: number,
  dispatch_date: Date,
  note: string,
  status_id: number ,
  products: OutboundProductI[]
}

export interface OutboundProductI {
  product_id: number,
  quantity: number
}

export interface OutboundGetI {
  exit_type: string,
  exit_date: Date,
  note: string,
  total: number,
  created_by: number,
  updated_at: Date,
  created_at: Date,
  id: number
}

