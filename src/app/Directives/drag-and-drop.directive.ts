import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { FileHandler } from '../Models/FileHandler';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {
  
  @HostBinding('class.fileover') fileOver : boolean = false;

  @Output() fileDropped = new EventEmitter<FileHandler>();

  constructor(private sanitizer: DomSanitizer) {        
  }

  @HostListener('dragover', ['$event']) onDragOver(evt : DragEvent){
    evt.preventDefault();
    evt.stopPropagation();

    this.fileOver = true;
    console.log('drag over');
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt : DragEvent){
    evt.preventDefault();
    evt.stopPropagation();

    this.fileOver = false;

    console.log('drag leave');
  }

  @HostListener('drop', ['$event'])public onDrop(evt: DragEvent){
    evt.preventDefault();
    evt.stopPropagation();

    this.fileOver = false;
    console.log('dropped');

    let file = evt.dataTransfer?.files[0];

    let fileHandler : FileHandler;

    if(file){
        fileHandler = {
          file : file,
          path : this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))
        }
        this.fileDropped.emit(fileHandler);
    }

  }
}

