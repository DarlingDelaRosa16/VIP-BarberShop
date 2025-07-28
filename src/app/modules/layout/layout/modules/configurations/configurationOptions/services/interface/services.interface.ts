
export interface ServicePostI {
  id: number
  name: string,
  current_price: number,
  previous_price: number | null,
  duration: any
}


export interface ServiceGetI {
  id: number,
  name: string,
  current_price: number,
  previous_price: number | null,
  duration: any,
  updated_by: Date | null,
  created_at: Date,
  updated_at: Date
}
