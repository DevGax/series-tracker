import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitcomForm } from './media-form';

describe('SitcomForm', () => {
  let component: SitcomForm;
  let fixture: ComponentFixture<SitcomForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SitcomForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SitcomForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
