export class Login {
    LoginId: string;
    Password: string;
    Domain: string;

    constructor(LoginId: string, Password: string,Domain: string) {
      this.LoginId = LoginId,
        this.Password = Password,
        this.Domain = Domain
    }
  }