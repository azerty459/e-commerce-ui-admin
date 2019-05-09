import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AlerteSnackBarComponent} from './alerteSnackBar.component';

describe('AlerteSnackBarComponent', () => {
  let component: AlerteSnackBarComponent;
  let fixture: ComponentFixture<AlerteSnackBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [AlerteSnackBarComponent]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlerteSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
