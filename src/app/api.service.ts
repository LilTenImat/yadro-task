import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_KEY, currency } from 'src/config';

interface response{
    success: boolean,
    quotes: {
        [key: string]: number 
    }
}

@Injectable({providedIn: 'root'})
export class ApiService {
    constructor(private http: HttpClient) { }
    
    getCurrency(source: 'RUB', symbols: currency[] = [currency.USD, currency.EUR, currency.GBP]){
        let httpOptions = {
            headers: {'apikey': API_KEY  }
        }

        return this.http.get<response>(`https://api.apilayer.com/currency_data/live?source=${source}&currencies=${symbols.join(',')}`, httpOptions)
    }

}