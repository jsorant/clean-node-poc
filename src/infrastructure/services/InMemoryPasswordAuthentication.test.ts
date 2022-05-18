import {
  HashSha256,
  IPasswordAuthentication,
} from "../../domain/ports/IPasswordAuthentication";
import { InMemoryPasswordAuthentication } from "./InMemoryPasswordAuthentication";

describe("InMemoryPasswordAuthentication class", () => {
  test("should return true on a correct password", async () => {
    const passwordsMap: Map<string, HashSha256> = new Map(
      Object.entries({
        user1: "password1Hash",
        user2: "password2Hash",
        user3: "password3Hash",
      })
    );
    const passwordAuthentication: IPasswordAuthentication =
      new InMemoryPasswordAuthentication(passwordsMap);
    const isValid = passwordAuthentication.verify("user1", "password1Hash");
    expect(isValid).toBeTruthy();
  });

  test("should return false on a incorrect password", async () => {
    const passwordsMap: Map<string, HashSha256> = new Map(
      Object.entries({
        user1: "password1Hash",
        user2: "password2Hash",
        user3: "password3Hash",
      })
    );
    const passwordAuthentication: IPasswordAuthentication =
      new InMemoryPasswordAuthentication(passwordsMap);
    const isValid = passwordAuthentication.verify("user1", "password2Hash");
    expect(isValid).toBeFalsy();
  });

  test("should return false on a non existing login", async () => {
    const passwordsMap: Map<string, HashSha256> = new Map(
      Object.entries({
        user1: "password1Hash",
        user2: "password2Hash",
        user3: "password3Hash",
      })
    );
    const passwordAuthentication: IPasswordAuthentication =
      new InMemoryPasswordAuthentication(passwordsMap);
    const isValid = passwordAuthentication.verify(
      "userNonExisting",
      "password2Hash"
    );
    expect(isValid).toBeFalsy();
  });
});
