import { Component, effect, EnvironmentInjector, inject, OnInit, ViewChild } from '@angular/core';
import { MaterialComponents } from '../../../../../../../helpers/material';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { NgApexchartsModule, ChartComponent, ApexChart, ApexAxisChartSeries, ApexDataLabels, ApexXAxis, ApexStroke, ApexLegend, ApexTooltip, ApexGrid, ApexPlotOptions } from 'ng-apexcharts';
import { GeneralRequestService } from '../../../../services/generalRequest.service';
import { Subject } from 'rxjs';
import { MonthlyIncome } from '../../../../interface/general.Interface';

export type ChartOptions = {
  series: ApexAxisChartSeries; // Aquí definimos que siempre será un arreglo válido
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  grid: ApexGrid;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-income-chart',
  imports: [MaterialComponents, PrimeComponentsModules, ModulesImports, NgApexchartsModule],
  templateUrl: './income-chart.component.html',
  styleUrl: './income-chart.component.css'
})
export class IncomeChartComponent implements OnInit {

  @ViewChild("activeusercardchart") chart!: ChartComponent;

  // Inicializamos con un objeto válido donde series es un arreglo vacío para evitar undefined
  activeusercardChartOptions: ChartOptions = {
    series: [{
      name: 'Ingresos Mensuales',
      data: new Array(12).fill(0),
      color: "#03c9d7",
    }],
    chart: {
      toolbar: { show: false },
      type: 'bar',
      height: 300,
      width: '100%',
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    legend: { show: false },
    tooltip: { theme: "dark" },
    grid: { show: false },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 5, colors: ['none'] },
    plotOptions: { bar: { columnWidth: '35%', borderRadius: 8 } },
  };

  monthlyIncome: string[] = [];

  private injector = inject(EnvironmentInjector);

  constructor(public generalService: GeneralRequestService) { }

  ngOnInit(): void {
    this.generalService.getMonthlyIncome();

    this.injector.runInContext(() => {
      effect(() => {
        const monthlyIncomeData = this.generalService.mounthlyIncome();

        if (!monthlyIncomeData || monthlyIncomeData.length === 0) return;

        this.monthlyIncome = monthlyIncomeData.map(item => item.total_income);
        const nums = this.monthlyIncome.map(str => Number(str.replace(/,/g, '')));

        this.activeusercardChartOptions = {
          ...this.activeusercardChartOptions,
          series: [{
            name: 'Ingresos Mensuales',
            data: nums,
            color: "#03c9d7",
          }],
        };
      });
    });
  }

}
