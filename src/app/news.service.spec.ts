import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';

import { NewsService } from './news.service';

describe('NewsService', () => {
  let service: NewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AngularFirestore, useValue: {} }],
    });
    service = TestBed.inject(NewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
