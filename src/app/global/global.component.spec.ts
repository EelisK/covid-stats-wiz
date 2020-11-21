import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { By } from '@angular/platform-browser';
import { StatsWizEntityHistory } from '../models/stats-wiz';
import { StatsService } from '../stats.service';
import { SummaryComponent } from '../summary/summary.component';
import { GlobalComponent } from './global.component';

describe('GlobalComponent', () => {
  let component: GlobalComponent;
  let fixture: ComponentFixture<GlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalComponent],
      providers: [StatsService, { provide: AngularFirestore, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
