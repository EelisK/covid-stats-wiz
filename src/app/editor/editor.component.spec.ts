import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NewsService } from '../news.service';
import { StatsService } from '../stats.service';

import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorComponent],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: NewsService, useValue: {} },
        { provide: StatsService, useValue: {} },
        { provide: FormBuilder, useValue: { group: () => ({}) } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
