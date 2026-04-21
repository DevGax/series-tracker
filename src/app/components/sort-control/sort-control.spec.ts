import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortControl } from './sort-control';

describe('SortControl', () => {
  let component: SortControl;
  let fixture: ComponentFixture<SortControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortControl],
    }).compileComponents();

    fixture = TestBed.createComponent(SortControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
