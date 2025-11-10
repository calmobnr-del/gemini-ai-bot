import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UktzedPage } from './uktzed-page.component';

describe('Uktzed', () => {
  let component: UktzedPage;
  let fixture: ComponentFixture<UktzedPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UktzedPage],
    }).compileComponents();

    fixture = TestBed.createComponent(UktzedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
