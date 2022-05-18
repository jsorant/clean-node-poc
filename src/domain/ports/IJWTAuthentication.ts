export type JwtBase64 = string;

export interface IJWTAuthentication {
  verify(jwt: JwtBase64): boolean;
}
