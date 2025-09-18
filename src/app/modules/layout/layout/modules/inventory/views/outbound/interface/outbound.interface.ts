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
  status_id: number,
  products: OutboundProductI[]
}

export interface OutboundProductI {
  product_id: number,
  quantity: number
}

export interface OutboundGetI {
  id: number,
  exit_type: string,
  exit_date: Date,
  note: string,
  products:
    {
      product_id: number,
      product_name: string,
      quantity: number,
      unit_cost: number,
      subtotal: number
    }[],
  total: number,
  created_at: Date,
  created_by: string,
  updated_at: Date,
  updated_by: Date
}

export interface OutboundGetDispacthI {
  id: number,
  barber_name: string,
  dispatch_date: Date,
  note: string,
  products:
    {
      product_id: number,
      product_name: string,
      quantity: number,
      unit_cost: number,
      subtotal: number
    }[],
  total: number,
  created_at: Date,
  created_by: string,
  updated_at: Date,
  updated_by: Date
}

