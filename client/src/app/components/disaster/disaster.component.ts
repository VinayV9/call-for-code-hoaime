import { Component, OnInit } from '@angular/core';
import { WebcamImage} from 'ngx-webcam';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { CaptureComponent } from '../capture/capture.component';
import { MatDialog } from '@angular/material';


class ImageSnippet{
  constructor(public src: string, public file: File){}
}

@Component({
  selector: 'app-disaster',
  templateUrl: './disaster.component.html',
  styleUrls: ['./disaster.component.scss']
})
export class DisasterComponent implements OnInit {

  public lat = null;
  public log = null;

  constructor(private sharedService: SharedServiceService,
    private _sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
    ){ }

  public ngOnInit(): void {
    this.getLocation();
    this.sharedService.getDisasters()
    .subscribe(
      (data) => { 
        this.disasters = data;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        this.lat = position.coords.latitude;
        this.log = position.coords.longitude; 
      });
    } 
  }

  //------------------------------------------

  //upload
  selectedFile: ImageSnippet;
  file : File = null;
  uploadImg: any = null;
  isFetching: boolean = false;
  disasters: any = [];

  processFile(imageInput: any) {
    this.file = imageInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, this.file);
      this.uploadImg = this._sanitizer.bypassSecurityTrustResourceUrl(this.selectedFile.src);
    });
  }

  async analyze(){
      if(!this.selectedFile) {
         return;
      }
      //upload image in db
      this.spinner.show();
      await this.getLocation();
     
      this.sharedService.uploadImage( this.selectedFile.file, this.log, this.lat)
        .subscribe(
          data => { 
            this.spinner.hide();
            this.disasters.push({fileName: data.fileName, score: data.score, class: data.class});
            this.uploadImg = null;
          },
          err => { 
            console.log(err);
            this.spinner.hide();
          }
        )
  }

  capturedImg: WebcamImage;
  capture() {
    const dialogRef = this.dialog.open(CaptureComponent, {
      width: '50vw',
      height: '60vh',
      data: null
    });
    dialogRef.afterClosed().subscribe(
      result => { 
         if(!result) return;
         this.capturedImg = result;
         const bstr = atob(this.capturedImg.imageAsBase64);
         let n = bstr.length;
         const u8arr = new Uint8Array(n);
         while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
         }
         let f = new File([u8arr], "capture.jpeg", {type: "image/jpeg"});
         
         this.selectedFile.file = f;
         this.selectedFile.src = this.capturedImg.imageAsDataUrl;
         this.uploadImg = this._sanitizer.bypassSecurityTrustResourceUrl(this.selectedFile.src);
      }
    )
  }
}
