import { Routes } from '@angular/router';
import { LogInComponent } from './modules/auth/log-in/log-in.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { LayoutComponent } from './modules/layout/layout/layout.component';
import { ConfigurationsComponent } from './modules/layout/layout/modules/configurations/configurations.component';
import { ServicesComponent } from './modules/layout/layout/modules/configurations/configurationOptions/services/services.component';
import { BarbersComponent } from './modules/layout/layout/modules/configurations/configurationOptions/barbers/barbers.component';
import { RevenueModelComponent } from './modules/layout/layout/modules/configurations/configurationOptions/revenue-model/revenue-model.component';
import { ClientsComponent } from './modules/layout/layout/modules/configurations/configurationOptions/clients/clients.component';
import { InventoryRouterComponent } from './modules/layout/layout/modules/inventory/inventory-router.component';
import { DashboardInventoryComponent } from './modules/layout/layout/modules/inventory/views/dashboard-inventory/dashboard-inventory.component';
import { ProductsComponent } from './modules/layout/layout/modules/inventory/views/products/products.component';
import { InboundComponent } from './modules/layout/layout/modules/inventory/views/inbound/inbound.component';
import { OutboundComponent } from './modules/layout/layout/modules/inventory/views/outbound/outbound.component';
import { ReportsComponent } from './modules/layout/layout/modules/reports/reports.component';
import { HomeComponent } from './modules/layout/layout/modules/home/home.component';
import { BarbershopComponent } from './modules/layout/layout/modules/barbershop/barbershop.component';
import { DashboardReportsComponent } from './modules/layout/layout/modules/reports/views/dashboard-reports/dashboard-reports.component';
import { DatesComponent } from './modules/layout/layout/modules/barbershop/views/dates/dates.component';
import { ListDatesComponent } from './modules/layout/layout/modules/barbershop/views/list-dates/list-dates.component';
import { authGuard, authGuardBackToLogIn } from './guards/auth.guard';
import { BarbersReportsComponent } from './modules/layout/layout/modules/reports/views/barbers-reports/barbers-reports.component';
import { SaleComponent } from './modules/layout/layout/modules/sale/sale.component';
import { SalesListComponent } from './modules/layout/layout/modules/sale/view/sales-list/sales-list.component';
import { RecomendationsComponent } from './modules/layout/layout/modules/configurations/configurationOptions/recomendations/recomendations.component';
import { ReviewsComponent } from './modules/layout/layout/modules/reviews/reviews.component';
import { ShiftComponent } from './modules/layout/layout/modules/shift/shift.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LogInComponent,
    canActivate: [authGuardBackToLogIn]
  },
  // {
  //   path:'register',
  //   component: RegisterComponent,
  // },

  {
    path: 'layout',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'ventas',
        component: SaleComponent,
      },
      {
        path: 'listado-facturas',
        component: SalesListComponent,
      },
      {
        path: 'mantenimiento',
        component: ConfigurationsComponent,
        children: [
          {
            path: 'crear-servicios',
            component: ServicesComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'recomendaciones',
            component: RecomendationsComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'crear-colaboradores',
            component: BarbersComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'porcentaje-de-pago',
            component: RevenueModelComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'crear-clientes',
            component: ClientsComponent,
            outlet: 'mantenimiento'
          }
        ]
      },
      {
        path: 'productos',
        component: ProductsComponent,
      },
      {
        path: 'horarios',
        component: ShiftComponent,
      },
      {
        path: 'resenas',
        component: ReviewsComponent,
      },
      {
        path: 'entradas',
        component: InboundComponent,
      },
      {
        path: 'salidas',
        component: OutboundComponent,
        // outlet: 'inventario'
      },
      // {
      //   path: 'inventario',
      //   component: InventoryRouterComponent,
      //   children: [
      //     {
      //       path: '',
      //       component: DashboardInventoryComponent,
      //       outlet: 'inventario'
      //     },


      //   ]
      // },
      {
        path: 'reportes',
        component: ReportsComponent,
        // children: [
        //   {
        //     path: '',
        //     component: DashboardReportsComponent,
        //     outlet: 'reportes'
        //   },
        //   {
        //     path: 'reportes-barberos',
        //     component: BarbersReportsComponent,
        //     outlet: 'reportes'
        //   }
        // ]
      },
      {
        path: 'reporte-existencia',
        component: DashboardReportsComponent,
        // outlet: 'reportes'
      },
      {
        path: 'reportes-barberos',
        component: BarbersReportsComponent,
        // outlet: 'reportes'
      },
      {
        path: 'inicio',
        component: HomeComponent,
      },
      {
        path: 'estado-barberia',
        component: BarbershopComponent,
        children: [
          {
            path: '',
            component: DatesComponent,
            outlet: 'barberia'
          },
          {
            path: 'listado-citas',
            component: ListDatesComponent,
            outlet: 'barberia'
          }
        ]
      }
    ]
  },
  { path: '', pathMatch: 'full', redirectTo: 'layout/inicio' },
  { path: '**', redirectTo: '/login' },
];
