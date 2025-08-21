import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionDetailPage } from './session-detail-page';

describe('SessionDetailPage', () => {
  let component: SessionDetailPage;
  let fixture: ComponentFixture<SessionDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
