import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryDataItem } from './history-data-item.component';

describe('ChatItem', () => {
  let component: HistoryDataItem;
  let fixture: ComponentFixture<HistoryDataItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryDataItem],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryDataItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
