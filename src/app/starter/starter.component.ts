import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISearchResult } from '../contracts/search/isearch-result';
import { ICategory } from '../contracts/categories/icategory';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html'
})
export class StarterComponent implements OnInit {
  private unsubscribe: Subject<any> = new Subject<any>();
  data: ISearchResult;
  categories: ICategory[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.unsubscribe))
    .subscribe((data: { data: ISearchResult, categories: ICategory[] }) => {
      this.data = data.data;
      this.categories = data.categories;
    });
  }

  /**
   * Executes copy text for clone repo.
   */
  copyText() {
    const text = `git clone ${this.data.repo_url}`;
    let textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
  }

  /**
   * Gets the category name based on the category id.
   * @param {string} categoryId 
   * @returns {string}
   */
  getCategoryName(categoryId: string): string {
    const category: ICategory = this.categories.find((category: ICategory) => category.category_id === categoryId);
    return category ? category.name : 'Not Found';
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
