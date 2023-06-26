import { Component } from '@angular/core';
import { FileHandler } from 'src/app/Models/FileHandler';
import { DomSanitizer } from '@angular/platform-browser';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';


import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import {initializeApp} from 'firebase/app';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {

  progress: Number = 0;

  loading: boolean = false;

  uploaded: boolean = false;

  url : string = '';

  firebaseConfig = {

    apiKey: "AIzaSyCG_vz5TQz9SuqYpGWk7SsEWskQopKLdII",
  
    authDomain: "image-uploader-821ab.firebaseapp.com",
  
    databaseURL: "https://image-uploader-821ab-default-rtdb.firebaseio.com",
  
    projectId: "image-uploader-821ab",
  
    storageBucket: "image-uploader-821ab.appspot.com",
  
    messagingSenderId: "268236828944",
  
    appId: "1:268236828944:web:00e135cfaf2ef11bbcf595"
  
  };

  app = initializeApp(this.firebaseConfig);
  
  constructor(private sanitizer: DomSanitizer, private clipboard: Clipboard, private snackBar: MatSnackBar) {}

  image?: FileHandler

  public onDrop(image : FileHandler){
    this.image = image;
    
    this.uploadFile(this.image);
  }

  public fileSelection(event : any){
    this.image = {
      file : event.target.files[0],
      path : this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(event.target.files[0]))
    }
    this.uploadFile(this.image);
  }

 private uploadFile(file : FileHandler){
    const storage = getStorage(this.app);

    const storageRef = ref(storage, file.file.name)
    const uploadTask = uploadBytesResumable(storageRef, file.file);

    uploadTask.on('state_changed', (snapshot)=> {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if(snapshot.state === 'running'){
          this.loading = true;
        }
    },

    (error)=> {
      console.error(error);
    },

    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        this.url = downloadURL;
      });
      this.loading = false;
      this.uploaded = true;  
    }
    )}

  public copyToClipboard(){
    this.clipboard.copy(this.url);
    this.snackBar.open('copied successfully !', 'Okay');
  }
}
