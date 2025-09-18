
import { EventEmitter, Injectable, inject } from '@angular/core';
import { PersonGetI } from '../layout/interface/general.Interface';

@Injectable({ providedIn: 'root' })

export class SystemInformationService {

  itbisOptions = [
    { label: '18%', value: 18.00 },
    { label: '16%', value: 16.00 },
    { label: '0%', value: 0.00 }
  ];
  get getArrayItbis(): { label: string, value: number }[] { return this.itbisOptions }

  private URLProduccion = "https://laravelbarbershop-production.up.railway.app/api"
  get getURL(): string { return this.URLProduccion }

  private userToken: string = "Bearer 3|MBqkmfYjvaiIxEPDcZyU1ibR9WQhDVleMWU33ZmEa7c5b352";
  get getToken(): string { return this.userToken }
  setUserToken(token: string) { this.userToken = `Bearer ${token}` }

  private user: any = {
    user_id: 0,
    email: "",
    full_name: "",
    role: "",
    created_at: new Date,
    updated_at: new Date,
    admin_id: 3
  };
  get getUser(): any { return JSON.parse(this.user) }
  setUser(user: string) { this.user = user }

  private logged: boolean = false;
  get getLogged(): boolean { return this.logged }
  setLogged(logged: boolean) { this.logged = logged }

  public checkIsLoggedIn() {
    let token = localStorage.getItem('token')
    let userData = localStorage.getItem('user')

    if(token && userData){
      this.setUserToken(token)
      this.setLogged(true)

      this.setUser(userData)
    }else{
      this.setLogged(false)
    }
  }
}
