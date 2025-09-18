export interface RolI {
  id: number,
  name: string,
  description: string,
  created_at: Date,
  updated_at: Date
}

export interface MonthlyIncome {
  month: number,
  month_name: string,
  total_income: string
}

export interface PopularServicesI {
  id: number,
  name: string,
  total: number,
  percentage: number
}

export interface DailyI {
  total_scheduled: number,
  total_completed: number,
  total_income: number,
  active_barbers: number,
  errorCode: string
}

export interface PersonPostI {
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  password_confirmation: string,
  role_id: number,
  phone_number: string,
  address: string
  commission: number | null
}

export interface PersonGetI {
  id: number,
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  role_id: number,
  status: string,
  created_at: Date,
  updated_at: Date
}
