import firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Awaitable } from './models/awaitable.model';
import { StatsWizUser, UserRole } from './models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginStatus: Awaitable<StatsWizUser> | null = null;
  constructor(
    private readonly afAuth: AngularFireAuth,
    private readonly firestore: AngularFirestore,
    private readonly router: Router
  ) {}

  public async getUser(): Promise<StatsWizUser | null> {
    if (this.loginStatus?.state === 'success') {
      return this.loginStatus.data;
    }

    try {
      // toPromise() is not resolving for some reason
      const firebaseUser = await new Promise<firebase.User>((resolve) =>
        this.afAuth.user.subscribe(resolve)
      );
      const user = await this.firebaseToStatsWizUser(firebaseUser);
      this.loginStatus = {
        state: 'success',
        data: user,
        lastFetched: new Date(),
      };
      return user;
    } catch (err) {
      this.loginStatus = null;
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
      await this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      const credentials = await this.afAuth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider()
      );
      const user = await this.firebaseToStatsWizUser(credentials.user);

      this.loginStatus = {
        state: 'success',
        data: user,
        lastFetched: new Date(),
      };
    } catch (error) {
      this.loginStatus = { state: 'error', error };
    }
  }

  public async setUserRole(user: StatsWizUser, role: UserRole): Promise<void> {
    await this.firestore
      .collection('users')
      .doc(user.uid)
      .set({ role }, { merge: true });
  }

  public async deleteUser(user: StatsWizUser): Promise<void> {
    await this.firestore.collection('users').doc(user.uid).delete();
  }

  public async signOut(): Promise<void> {
    await this.afAuth.signOut();
    this.loginStatus = null;
    this.router.navigate(['countries']);
  }

  private async firebaseToStatsWizUser(
    firebaseUser: firebase.User
  ): Promise<StatsWizUser> {
    const userDoc = this.firestore
      .collection('users')
      .doc<StatsWizUser>(firebaseUser.uid);
    const userDocRef = await userDoc.ref.get();
    if (userDocRef.exists) {
      return userDocRef.data() as StatsWizUser;
    }

    const { uid, email, displayName, photoURL } = firebaseUser;
    const user: StatsWizUser = {
      uid,
      email,
      photoURL,
      displayName,
      role: UserRole.VIEWER,
    };
    await userDoc.set(user);
    return user;
  }
}
