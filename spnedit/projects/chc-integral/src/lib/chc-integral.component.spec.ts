import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChcIntegralComponent } from './chc-integral.component';

describe('ChcIntegralComponent', () => {
  let component: ChcIntegralComponent;
  let fixture: ComponentFixture<ChcIntegralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChcIntegralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChcIntegralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
