import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public name: string = 'Anonymous';
  public time: number = 0;
  public volume: number = 0.5;
  constructor() {
    if(localStorage.getItem('name')) {
      this.name = localStorage.getItem('name') ?? 'Anonymous';
    }
    if(localStorage.getItem('volume')) {
      this.volume = parseFloat(localStorage.getItem('volume') ?? '0.5');
    }
  }


}
