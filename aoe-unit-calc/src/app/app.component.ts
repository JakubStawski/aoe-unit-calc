import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from "@angular/forms";
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  title = 'aoe-unit-calc';
  unitName: string;
  allUnits: any;
  unitsResult: any = [];

  woodFC = new FormControl("", [
    Validators.pattern("^[0-9]*$")
  ]);

  foodFC = new FormControl("", [
    Validators.pattern("^[0-9]*$")
  ]);

  stoneFC = new FormControl("", [
    Validators.pattern("^[0-9]*$")
  ]);

  goldFC = new FormControl("", [
    Validators.pattern("^[0-9]*$")
  ]);

  avaibleResources = this.formBuilder.group({
    wood: this.woodFC,
    food: this.foodFC,
    stone: this.stoneFC,
    gold: this.goldFC,
  }); 

  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.unitName = 'Crossbowman';
    let res = this.http.get(`https://age-of-empires-2-api.herokuapp.com/api/v1/units`);
    res.subscribe((data) => {
      this.allUnits = data;
    });
  }

  calcUnits(): void {
    const avaibleResources = this.avaibleResources.value;
    let canRecruit: number;
    let woodLimit: number, foodLimit: number, stoneLimit: number, goldLimit: number;

    for(let i = 0; i < this.allUnits.units.length; i++) {
      woodLimit = Math.floor(avaibleResources.wood / this.allUnits.units[i].cost.Wood);
      foodLimit = Math.floor(avaibleResources.food / this.allUnits.units[i].cost.Food);
      stoneLimit = Math.floor(avaibleResources.stone / this.allUnits.units[i].cost.Stone);
      goldLimit = Math.floor(avaibleResources.gold / this.allUnits.units[i].cost.Gold);

      canRecruit = Math.min(isNaN(woodLimit) ? Infinity : woodLimit, 
                            isNaN(foodLimit) ? Infinity : foodLimit,
                            isNaN(stoneLimit) ? Infinity : stoneLimit,
                            isNaN(goldLimit) ? Infinity : goldLimit)

      this.unitsResult[i] = 
        {
          id: i + 1,
          name: this.allUnits.units[i].name,
          canRecruit: canRecruit
        };      
    };
  }
  
}
