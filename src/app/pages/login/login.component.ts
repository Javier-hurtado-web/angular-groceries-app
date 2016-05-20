import {Component} from "@angular/core";
import {Router} from "@angular/router-deprecated";
import {User} from "../../shared/user/user";
import {UserService} from "../../shared/user/user.service"

@Component({
  selector: "login",
  templateUrl: "./app/pages/login/login.html",
  styleUrls: ["./app/pages/login/login.css"],
  providers: [UserService]
})
export class LoginComponent {
  user: User;
  isLoggingIn = true;

  constructor(
    private _userService: UserService,
    private _router: Router) {

    this.user = new User();
    this.user.email = "ngconf@telerik.com";
    this.user.password = "password";
  }

  submit() {
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp();
    }
  }

  login() {
    this._userService.login(this.user)
      .subscribe(
        () => this._router.navigate(["List"]),
        () => alert("Unfortunately we were not able to log you in to the system")
      );
  }

  signUp() {
    this._userService.register(this.user)
      .subscribe(
        () => {
          alert("Your account was successfully created.")
          this.toggleDisplay();
        },
        () => alert("Unfortunately we were unable to create your account.")
      );
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }
}
