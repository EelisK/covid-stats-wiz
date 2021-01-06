import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { NewsArticle } from './models/news';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(
    private readonly firestore: AngularFirestore,
    private readonly storage: AngularFireStorage
  ) {}

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

  public async addNewsMedia(userId: string, file: File): Promise<string> {
    const response = await this.storage.upload(
      `news-assets/${userId}/${file.name}`,
      file
    );
    const url = await this.storage
      .ref(response.metadata.fullPath)
      .getDownloadURL()
      .toPromise();
    return url;
  }
}
