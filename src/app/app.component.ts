import { Component, OnInit } from '@angular/core';
import { CategoryService } from './services/category.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private categoryService: CategoryService) {}

  async ngOnInit() {
    
  }
}
