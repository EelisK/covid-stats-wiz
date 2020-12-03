import firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Awaitable } from './models/awaitable.model';
import { StatsWizUser, UserRole } from './models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginStatus: Awaitable<StatsWizUser> | null = null;
  constructor(
    private readonly afAuth: AngularFireAuth,
    private readonly firestore: AngularFirestore
  ) {}

  public get user(): StatsWizUser | null {
    if (this.loginStatus?.state === 'success') {
      return this.loginStatus.data;
    } else {
      return null;
    }
  }

  public async getUnconfirmedUsers(): Promise<StatsWizUser[]> {
    const collection = await this.firestore.collection('users').ref.get();
    return collection.docs
      .map((x) => x.data() as StatsWizUser)
      .filter((x) => x.role !== UserRole.EDITOR);
  }

  public async signInWithGoogle(): Promise<void> {
    try {
      this.loginStatus = { state: 'loading' };
      const credentials = await this.afAuth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider()
      );
      const { uid, email, displayName } = credentials.user;
      const user: StatsWizUser = {
        uid,
        email,
        displayName,
        role: UserRole.VIEWER,
      };
      const userDoc = this.firestore
        .collection('users')
        .doc<StatsWizUser>(user.uid);
      const userDocRef = await userDoc.ref.get();
      if (!userDocRef.exists) {
        await userDoc.set(user);
      }

      // TODO: persist user
      this.loginStatus = {
        state: 'success',
        data: user,
        lastFetched: new Date(),
      };
    } catch (error) {
      this.loginStatus = { state: 'error', error };
    }
  }

  public async signOut(): Promise<void> {
    await this.afAuth.signOut();
    this.loginStatus = null;
  }
}
