import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseCategoryApiUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseCategoryApiUrl = environment.API_URL + 'category';
  }

  async getAllCategories() {
    let categories = await this.httpClient.get<Category[]>(this.baseCategoryApiUrl).toPromise() ?? [];

    return categories;
  }

  async getCategoryById(categoryId: number) {
    let category = await this.httpClient.get<Category>(this.baseCategoryApiUrl + `/${categoryId}`).toPromise();

    return category;
  }

  async getFullInheritance(categoryId: number) {
    let category = await this.getCategoryById(categoryId);

    return await this.getParents(category);
  }

  private async getParents(category?: Category) {
    if(category?.parentCategoryId) {
      let parent = await this.getCategoryById(category.parentCategoryId);
      category.parentCategory = parent;

      await this.getParents(parent);
    }

    return category;
  }
}
