import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonService } from '../common.service';
import { Awaitable } from '../models/awaitable.model';
import { StatsWizUser, UserRole } from '../models/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  private users: Awaitable<StatsWizUser[]> = { state: 'loading' };
  private currentUser: Awaitable<StatsWizUser> = { state: 'loading' };
  public confirmationState: Awaitable<StatsWizUser> | null = null;
  constructor(
    public readonly authService: AuthService,
    private readonly commonService: CommonService
  ) {}

  public async ngOnInit(): Promise<void> {
    await Promise.all([this.setPendingUsers(), this.setCurrentUser()]);
  }

  private async setPendingUsers(): Promise<void> {
    for await (const result of this.commonService.runAsyncForResult(() =>
      this.authService.getUnconfirmedUsers()
    )) {
      this.users = result;
    }
  }

  private async setCurrentUser(): Promise<void> {
    for await (const result of this.commonService.runAsyncForResult(() =>
      this.authService.getUser()
    )) {
      this.currentUser = result;
    }
  }

  public get currentUserIsEditor(): boolean {
    if (this.commonService.isSuccess(this.currentUser)) {
      return this.currentUser.data.role === UserRole.EDITOR;
    } else {
      return false;
    }
  }

  public get pendingUsers(): StatsWizUser[] {
    if (this.commonService.isSuccess(this.users)) {
      return this.users.data;
    } else {
      return [];
    }
  }

  public async confirmPendingUser(user: StatsWizUser): Promise<void> {
    try {
      this.confirmationState = { state: 'loading' };
      await this.authService.setUserRole(user, UserRole.EDITOR);
      this.confirmationState = {
        state: 'success',
        data: user,
        lastFetched: new Date(),
      };
    } catch (error) {
      this.confirmationState = { state: 'error', error };
    }
  }

  public async deletePendingUser(user: StatsWizUser): Promise<void> {
    try {
      this.confirmationState = { state: 'loading' };
      await this.authService.deleteUser(user);
      this.confirmationState = {
        state: 'success',
        data: user,
        lastFetched: new Date(),
      };
    } catch (error) {
      this.confirmationState = { state: 'error', error };
    }
  }
}
