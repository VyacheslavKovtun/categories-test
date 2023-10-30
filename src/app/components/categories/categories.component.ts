import { Component, Input, OnInit } from '@angular/core';
import {FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource, MatTreeModule, MatTreeFlattener, MatTreeFlatDataSource} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CategoryService } from 'src/app/services/category.service';

export interface CategoryNode {
  name: string;
  id: number;
  parentId?: number;
  children?: CategoryNode[];
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  private _transformer = (node: CategoryNode, level: number) => {
    return {
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  constructor(private categoryService: CategoryService) {}

  async ngOnInit() {
    let categoriesData = await this.categoryService.getNodeCategories();
    
    this.dataSource.data = this.treeConstruct(categoriesData);
  }

  treeConstruct(categories: CategoryNode[]) {
    let constructedTree = [];

    let parentCategories = categories.filter(c => !c.parentId);
    
    for(let category of parentCategories) {
      let constructedCategory = this.constructCategory(category, categories);
      
      constructedTree.push(constructedCategory);
    }

    return constructedTree;
  }

  constructCategory(category, allCategories) {
    if(this.categoryService.hasChild(category.id)) {
      let childCategories = allCategories.filter(c => c.parentId == category.id);

      category.children = [];
      for(let child of childCategories) {
        child = this.constructCategory(child, allCategories);
        category.children.push(child);
      }
    }

    return category;
  }
}
