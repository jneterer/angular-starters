import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImagesService } from 'shared/services/images/images.service';

@Component({
  selector: 'app-supabase-img',
  templateUrl: './supabase-img.component.html',
  styleUrls: ['./supabase-img.component.scss']
})
export class SupabaseImgComponent implements OnChanges {
  @Input() class: string = '';
  @Input() bucket: string = '';
  @Input() src: string = '';
  @Input() alt: string = '';
  supabaseImageUrl: SafeResourceUrl = '';

  constructor(
    private supabaseImageService: ImagesService,
    private readonly dom: DomSanitizer
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.src.currentValue) {
      this.supabaseImageService.downLoadImage(this.bucket, changes.src.currentValue)
        .subscribe((img: Blob) => {
          this.supabaseImageUrl = this.dom.bypassSecurityTrustResourceUrl(URL.createObjectURL(img));
        }, (error: Error) => {

        });
    }
  }

}
