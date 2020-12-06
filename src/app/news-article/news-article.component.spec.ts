import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsArticleComponent } from './news-article.component';

describe('NewsArticleComponent', () => {
  let component: NewsArticleComponent;
  let fixture: ComponentFixture<NewsArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewsArticleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsArticleComponent);
    component = fixture.componentInstance;
    component.article = {
      countrySlug: 'finland',
      date: new Date('2020-01-01'),
      description: 'Test',
      title: 'Test Title',
      userId: 'mock-user-id',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
