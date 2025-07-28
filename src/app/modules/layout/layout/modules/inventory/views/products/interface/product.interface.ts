
export interface ProductPostI {
  id: number | null,
  name: string,
  description: string,
  sale_price: number,
  unit_cost: number,
  stock: number,
  itbis: number,
  status_id: number
}


export interface ProductShoppingCartI {
  itbis: number,
  name: string,
  id: number,
  sale_price: number,
  quantity: number,
  subTotal: number,
}

export interface ProductGetI {
  id: number,
  name: string,
  description: string,
  sale_price: number,
  unit_cost: number,
  stock: number,
  itbis: number,
  status_id: number,
  created_by: number,
  updated_by: Date,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date
}


