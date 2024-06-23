import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  public name: string = 'Anonymous';
  public time: number = 0;
  constructor() { }


}
