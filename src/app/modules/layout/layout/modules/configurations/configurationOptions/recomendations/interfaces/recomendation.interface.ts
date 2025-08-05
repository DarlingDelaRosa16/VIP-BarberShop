import { ServiceGetI } from "../../services/interface/services.interface"

export interface RecomendationPostI {
  service_id: number,
  name: string,
  description: string,
  created_by: number
}


export interface RecomendationGetI {
  id: number,
  service_id: number,
  name: string,
  description: string,
  created_by: number,
  updated_by: string,
  created_at: Date,
  updated_at: Date,
  deleted_at: null,
  service: ServiceGetI
}
