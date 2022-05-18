export type HashSha256 = string;

export interface IPasswordAuthentication {
  verify(login: string, passwordHashSha256: HashSha256): boolean;
}
