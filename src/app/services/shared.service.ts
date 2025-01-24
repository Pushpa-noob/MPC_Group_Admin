import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private parentId: number = 0;
  private notificationsSource = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSource.asObservable();

  constructor() {
    const id = localStorage.getItem('admin_userId');
    this.parentId = id !== null ? parseInt(id, 10) : 0;
  }

  setParentId(id: number) {
    this.parentId = id;
  }

  getParentId() {
    return this.parentId;
  }

  broadcastNotifications(notifications: any[]) {
    this.notificationsSource.next(notifications);
  }


 
}
