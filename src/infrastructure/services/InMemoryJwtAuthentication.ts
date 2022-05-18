import {
  IJWTAuthentication,
  JwtBase64,
} from "../../domain/ports/IJWTAuthentication";

// Dummy JWT validator for test purpose
export class InMemoryJwtAuthentication implements IJWTAuthentication {
  private validJwtList: Array<JwtBase64>;
  constructor(initialList: Array<JwtBase64>) {
    this.validJwtList = initialList;
  }

  verify(jwt: JwtBase64): boolean {
    for (const itemJwt of this.validJwtList) {
      if (itemJwt === jwt) {
        return true;
      }
    }
    return false;
  }
}
