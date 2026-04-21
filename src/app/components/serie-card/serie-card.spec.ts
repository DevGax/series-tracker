import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieCard } from './serie-card';

describe('SerieCard', () => {
  let component: SerieCard;
  let fixture: ComponentFixture<SerieCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerieCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SerieCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
