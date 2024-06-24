import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  public name: string = 'Anonymous';
  public time: number = 0;
  constructor() {
    if(localStorage.getItem('name')) {
      this.name = localStorage.getItem('name') ?? 'Anonymous';
    }
  }


}
