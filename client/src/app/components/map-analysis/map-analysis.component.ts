import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'app-map-analysis',
  templateUrl: './map-analysis.component.html',
  styleUrls: ['./map-analysis.component.scss']
})
export class MapAnalysisComponent implements OnInit {

  lat: number;
  log: number;
  zoom: number = 12;
  showCircle: boolean= false;
  pollutionData: any;
  disasterData: any;

  constructor(
    private spinner: NgxSpinnerService,
    private sharedService: SharedServiceService
    ) { }
  
  ngOnInit() {
    this.getLocation();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        this.lat = position.coords.latitude;
        this.log = position.coords.longitude; 
      });
    } 
  }

  mapClicked(coords) {
    this.showCircle = false;
    this.lat = coords.lat;
    this.log = coords.lng;
  }
  // parameters

  pollutionScore: number = 0;
  disasterScore: number = 0;
  networkScore: number = 0;
  foodAvailablityScore: number = 0;
  overAllScore: number = 0;

  analyze(){
    this.spinner.show();
   this.sharedService.getPollutionDetails(this.lat, this.log)
    .subscribe(
      (data: any) => {
        
         this.pollutionScore = this.calculatePollution(data.data);
         this.pollutionData = data;
         this.sharedService.getImageVisualizationDetails(this.lat, this.log)
        .subscribe(
          (data: any) => {
            
            this.disasterData = data;
            this.disasterScore = this.calculateDisaster(data);
            this.overAllScore = this.calculateWeightedMean();
            this.spinner.hide();
            this.showCircle = true;
          },
          (err) => { console.log(err); }
        );
       },
      (err) => { console.log(err);}
    );
  }

  // calculation
  calculatePollution(data): number{
   let score: number = 0;
   let count: number = 0;
   for(let item of data.aqiParams){
     if(item.aqi !== null){
        score += +item.aqi;
        count += 1;
     }
   }
   return Math.round(score/count);
  }

  calculateDisaster(data): number{
    if(data === null || data.length === 0) return 0;
    let score: number = 0; 
    for(let item of data){
      if(item.class === "damaged"){
        score += (+item.score) * 100;
      }else{
        score += 100 - +item.score * 100;
      }
    }
    return Math.round(score/data.length);
  }

  calculateWeightedMean(){
    console.log(this.pollutionScore);
    console.log(this.foodAvailablityScore);
    console.log(this.networkScore);
    console.log(this.disasterScore);

     let weight = {food: 5, disaster: 90, network: 5, air: 20 }
     let overalAllStatus: number = this.foodAvailablityScore*(weight.food/100) + 
     this.pollutionScore*(weight.air/100) +
     this.networkScore*(weight.network/100) +
     this.disasterScore*(weight.disaster/100);
     return Math.round(overalAllStatus);
  }

}
