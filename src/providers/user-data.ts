import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(
    public events: Events,
    public storage: Storage,
    public http: Http
  ) { }

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(email: string, password): any {
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.post(API_URL + '/api/auth/login', {
        email: email,
        password: password
    }, options).toPromise()
    .then(() => {
      this.setUsername(email);
      this.events.publish('user:login');
     });
  };

  signup(first_name: string,
    last_name: string,
    twitter_handle: string,
    email: string,
    password: string): any {
      let headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      let options = new RequestOptions({ headers: headers, withCredentials: true });

      return this.http.post(API_URL + '/api/user', {
          first_name: first_name,
          last_name: last_name,
          twitter_handle: twitter_handle,
          email: email,
          password: password
      }, options).toPromise()
      .then(res => {
        this.setUsername(email);
        this.events.publish('user:signup');
       });
  };

  logout(): void {
    let options = new RequestOptions({ withCredentials: true });
    return this.http.get(API_URL + '/api/auth/logout', options).toPromise()
    .then(res => {
      this.storage.remove('username');
      this.events.publish('user:logout');
    }).catch((err) => {
      console.log(err);
    });
  };

  setUsername(username: string): void {
    this.storage.set('username', username);
  };

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };

  hasLoggedIn(): Promise<boolean> {
    let options = new RequestOptions({ withCredentials: true });
    return this.http.get(API_URL + '/api/user', options).toPromise()
    .then(() => {
      return true
    }).catch(() => {
      return false
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  };
}
