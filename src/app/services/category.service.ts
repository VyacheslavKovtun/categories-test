import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.model';
import { CategoryNode } from '../components/categories/categories.component';

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

  async getAllInheritedCategories(categoryId: number) {
    let category = await this.getCategoryById(categoryId);

    return await this.getParentCategories(category);
  }

  private async getParentCategories(category?: Category) {
    if(category?.parentCategoryId) {
      let parent = await this.getCategoryById(category.parentCategoryId);
      category.parentCategory = parent;

      await this.getParentCategories(parent);
    }

    return category;
  }

  async getChildCategories(parentId: number) {
    let allCategories = await this.getAllCategories();

    let childCategories = allCategories.filter(c => c.parentCategoryId == parentId);

    return childCategories ?? [];
  }

  async hasChild(parentId: number) {
    return (await this.getChildCategories(parentId))?.length > 0;
  }

  async getNodeCategories() {
    let categories = await this.getAllCategories();
    let nodes: CategoryNode[] = [];
    for(let category of categories) {
      nodes.push({ name: category.categoryName, id: category.categoryId, parentId: category.parentCategoryId })
    }

    return nodes;
  }
}
