import firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NewsArticle } from './models/news';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private readonly firestore: AngularFirestore) {}

  public async getNewsForCountry(
    countrySlug: string | null
  ): Promise<NewsArticle[]> {
    const documentId = countrySlug ?? 'worldwide';
    const newsCollection = await this.firestore
      .collection('countries')
      .doc(documentId)
      .collection('news')
      .ref.get();
    return newsCollection.docs.map((x) => x.data() as NewsArticle);
  }

  public async addNews(news: NewsArticle): Promise<void> {
    const id = news.countrySlug ?? 'worldwide';
    await this.firestore
      .collection('countries')
      .doc(id)
      .collection('news')
      .add(news);
  }
}
