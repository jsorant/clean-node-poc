export type ApiUrl = string;

export interface ServicesLauncher {
  start(): Promise<void>;
  apiUrl(): string;
  stop(): Promise<void>;
}
