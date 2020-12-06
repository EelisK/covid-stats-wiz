import firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NewsArticle } from './models/news';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private readonly firestore: AngularFirestore) {}

  public async getAllNews(): Promise<NewsArticle[]> {
    const collection = await this.firestore.collection('news').ref.get();
    return collection.docs.map((x) => x.data() as NewsArticle);
  }

  public async addNews(news: NewsArticle): Promise<void> {
    await this.firestore.collection('news').add(news);
  }
}
