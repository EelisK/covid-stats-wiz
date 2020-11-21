import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsWizEntityHistory } from '../models/stats-wiz';

import { SummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SummaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    component.summary = new StatsWizEntityHistory({
      entityName: 'Test Entity',
      lastUpdate: '1/1/2020',
      dayone: [
        {
          date: '1/5/2020',
        } as any,
      ],
      lastWeek: [
        {
          date: '1/5/2020',
        } as any,
      ],
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
