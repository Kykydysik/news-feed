export class UserToken {
  public static readonly tokenName = "token";

  public static getToken() {
    return localStorage.getItem(this.tokenName);
  }

  public static saveToken(token: string) {
    localStorage.setItem("token", token);
  }

  public static removeToken() {
    localStorage.removeItem("token");
  }

  public static isUserAuth() {
    return Boolean(UserToken.getToken());
  }
}
