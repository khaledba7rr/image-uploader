import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { FileHandler } from '../Models/FileHandler';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {
  
  @HostBinding('class.fileover') fileOver : boolean = false;

  @HostBinding('class.filewrong') invalidFile : boolean = false;

  @Output() fileDropped = new EventEmitter<FileHandler>();

  constructor(private sanitizer: DomSanitizer) {}

  allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

  imagesExts: any[] = [
    'image/jpg',
    'image/jpeg',
    'image/png',
  ]

  @HostListener('dragover', ['$event']) onDragOver(evt : DragEvent){
    evt.preventDefault();
    evt.stopPropagation();

   if(this.imagesExts.indexOf(evt.dataTransfer?.items[0]?.type) !== -1){
    console.log('found');
    this.invalidFile = false;    
   }else{
    this.invalidFile = true;
    console.log(this.invalidFile);
    
   }

    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt : DragEvent){
    evt.preventDefault();
    evt.stopPropagation();

    this.fileOver = false;

  }

  @HostListener('drop', ['$event'])public onDrop(evt: DragEvent){
    evt.preventDefault();
    evt.stopPropagation();

    this.fileOver = false;

    let file = evt.dataTransfer?.files[0];
    
    let fileHandler : FileHandler;

    if(file){
      this.invalidFile = false;
      if(this.allowedExtensions.exec(file.name)){
        fileHandler = {
          file : file,
          path : this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))
        }
        this.fileDropped.emit(fileHandler);
      }
    }

  }
}

