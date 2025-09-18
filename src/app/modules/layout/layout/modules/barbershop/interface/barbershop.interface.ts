import { PersonGetI } from "../../../interface/general.Interface"
import { ServiceGetI } from "../../configurations/configurationOptions/services/interface/services.interface"

export interface DatesGetToSetI {
  appointment_date: string
  barber_name: string
  client_id: number
  client_name: string
  created_at: Date
  created_by: string
  end_time: Date
  id: number
  services: {
    duration: number
    name: string
    price: number
  }[]
  start_time: Date
  status: string
  updated_at: Date
}

export interface DatesSetDetailViewI {
  barber_name: string
  client_id: number
  client_name: string
  cliente: PersonGetI
  color: { primary: string, secondary: string }
  created: Date
  created_by: string
  date: Date
  end: Date
  services: any[]
  start: Date
  status: string
  title: string
  updated: Date
}

export interface DatesGetI {
  id: number,
  client_name: string,
  barber_name: string,
  status: string,
  appointment_date: Date,
  start_time: string,
  end_time: string,
  created_at: Date,
  paid: boolean
  created_by: string,
  updated_at: Date,
  services: ServiceGetI[]
}

export interface DatesPostI {
  id?: number
  client_id: number,
  barber_id: number,
  appointment_date: Date,
  start_time: string,
  end_time: string,
  services: number[]
}
