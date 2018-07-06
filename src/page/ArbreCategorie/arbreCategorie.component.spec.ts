import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArbreCategorieComponent } from './arbreCategorie.component';

describe('LoginComponent', () => {
  let component: ArbreCategorieComponent;
  let fixture: ComponentFixture<ArbreCategorieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArbreCategorieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArbreCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
