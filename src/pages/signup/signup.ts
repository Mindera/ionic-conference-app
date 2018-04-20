import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

import { TabsPage } from '../tabs-page/tabs-page';


@Component({
  selector: 'page-user',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup: UserOptions = {};
  submitted = false;

  constructor(public navCtrl: NavController, public userData: UserData) {}

  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      let promise = this.userData.signup(this.signup.first_name,
        this.signup.last_name,
        this.signup.twitter_handle,
        this.signup.email,
        this.signup.password);

      promise.then((data) => {
          this.navCtrl.push(TabsPage);
      }).catch(err => {
        alert('Ops');
        console.log(err);
      });
    }
  }
}
