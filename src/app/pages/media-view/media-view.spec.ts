import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaView } from './media-view';

describe('MediaView', () => {
  let component: MediaView;
  let fixture: ComponentFixture<MediaView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaView],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
