import {
  IJWTAuthentication,
  JwtBase64,
} from "../../domain/ports/IJWTAuthentication";
import { InMemoryJwtAuthentication } from "./InMemoryJwtAuthentication";

describe("InMemoryJwtAuthentication class", () => {
  test("should return true on a correct JWT", async () => {
    const validJwtList: Array<JwtBase64> = ["jwt1", "jwt2", "jwt3"];
    const jwtAuthentication: IJWTAuthentication = new InMemoryJwtAuthentication(
      validJwtList
    );
    const isValid = jwtAuthentication.verify("jwt1");
    expect(isValid).toBeTruthy();
  });

  test("should return false on a incorrect JWT", async () => {
    const validJwtList: Array<JwtBase64> = ["jwt1", "jwt2", "jwt3"];
    const jwtAuthentication: IJWTAuthentication = new InMemoryJwtAuthentication(
      validJwtList
    );
    const isValid = jwtAuthentication.verify("jwtOther");
    expect(isValid).toBeFalsy();
  });
});
