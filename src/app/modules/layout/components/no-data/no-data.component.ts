import { Component, input } from '@angular/core';

@Component({
  selector: 'app-no-data',
  imports: [],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.css'
})
export class NoDataComponent {
  icon = input<string>()
  titleNoData = input<string>()
  subTitleNoData = input<string>()
}
