import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  selectedFile: ImageSnippet;
  description: string;
  file: File = null;

  constructor(private sharedServiceService: SharedServiceService) { }

  ngOnInit() {
  }

  processFile(imageInput: any) {
    this.file = imageInput.files[0];
  }

  createPost(){
      if(!this.file) return;

      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, this.file);

      this.sharedServiceService.uploadImage(this.selectedFile.file, this.description).subscribe(
        (res) => {
           console.log(res);
        },
        (err) => {
          console.log(err);
        })
    });
    reader.readAsDataURL(this.file);
  }
}
