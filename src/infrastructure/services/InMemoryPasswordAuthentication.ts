import {
  HashSha256,
  IPasswordAuthentication,
} from "../../domain/ports/IPasswordAuthentication";

export class InMemoryPasswordAuthentication implements IPasswordAuthentication {
  private passwordsMap: Map<string, HashSha256>;
  constructor(initialMap: Map<string, HashSha256>) {
    this.passwordsMap = initialMap;
  }

  verify(login: string, passwordHashSha256: HashSha256): boolean {
    for (const [itemLogin, itemPasswordHash] of this.passwordsMap.entries()) {
      if (itemLogin === login && itemPasswordHash === passwordHashSha256) {
        return true;
      }
    }
    return false;
  }
}
