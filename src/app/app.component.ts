import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { currency } from 'src/config';
import { BehaviorSubject, Subject, concatMap, interval, of, switchMap, timer } from 'rxjs';

interface _data{
  previous: number | null,
  current: number | null
}

interface Data{
  [currency.EUR]: _data,
  [currency.GBP]: _data,
  [currency.USD]: _data,
  [currency.CNY]: _data,
  [currency.JPY]: _data,
  [currency.TRY]: _data, 
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'yadro';

  buttonListener = new BehaviorSubject<string>('');

  symbols: currency[] = [
    currency.USD,
    currency.EUR,
    currency.GBP
  ]
  loading$ = new BehaviorSubject<boolean>(false);
  data$ = new BehaviorSubject<Data>({
    'CNY': {previous: null, current: null},
    'JPY': {previous: null, current: null},
    'USD': {previous: null, current: null},
    'TRY': {previous: null, current: null},
    'EUR': {previous: null, current: null},
    'GBP': {previous: null, current: null},
  })
  
  constructor(
    private api: ApiService,
    private cdRef: ChangeDetectorRef
  ){
    this.buttonListener.asObservable().pipe(
      switchMap(() => {
        this.loading$.next(true);
        return this.api.getCurrency("RUB", this.symbols);
      })
    ).subscribe(res => {
      this.loading$.next(false);
      this.updateData(res);
    })
  }

  ngOnInit(): void {
    setInterval(() => this.buttonListener.next('update!'), 5000);
    setInterval(() => this.cdRef.markForCheck(), 1000)
  }

  updateData(res: any){
    const previous = this.data$.value;
    let data: any = {};

    for(let name of this.symbols){
      data[name] = {
        previous: previous[name].current,
        current: 1 / res.quotes['RUB'+name]
      } 
    }

    this.data$.next(data);
  }

  getDate(){
    return new Date();
  }

  getRemainingSymbols(): currency[]{
    return Object.values(currency).filter(cur => (this.symbols.indexOf(cur) == -1));
  }

  addCurrency(cur: currency){
    this.symbols.push(cur);
  }

  getValue(cur: currency): _data{
    return this.data$.value[cur]
  }
}
