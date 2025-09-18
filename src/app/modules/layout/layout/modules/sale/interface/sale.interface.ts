export interface invoiceGetI {
  id: number,
  appointment_id: number,
  status: string,
  client_id: number,
  address: string,
  phone_number: string,
  client_name: string,
  payment_type: string,
  details: {
    type: string,
    name: string,
    quantity: number,
    price: string,
    itbis: number,
    subtotal: string
  }[]
  itbis: number,
  subtotal: string,
  total: string,
  created_at: Date
}

export interface invoicePostI {
  reference_number: string,
  aprovation_number: string,
  payment_type_id: number,
  client_id: number,
  status_id: number,
  appointment_id: number,
  products: { id: number, quantity: number }[]
}


