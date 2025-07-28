export interface DatesGetI {
  id: number,
  client_name: string,
  barber_name: string,
  status: string,
  appointment_date: Date,
  start_time: string,
  end_time: string,
  created_at: Date,
  created_by: string,
  updated_at: Date,
  services: string[]
}

export interface DatesPostI {
  client_id: number,
  barber_id: number,
  appointment_date: Date,
  start_time: string,
  end_time: string,
  services: number[]
}
