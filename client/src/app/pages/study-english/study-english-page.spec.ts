import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudyEnglishPage } from './study-english-page';

describe('StudyEnglishPage', () => {
  let component: StudyEnglishPage;
  let fixture: ComponentFixture<StudyEnglishPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyEnglishPage],
    }).compileComponents();

    fixture = TestBed.createComponent(StudyEnglishPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
