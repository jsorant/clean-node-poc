import "reflect-metadata";
import { Application } from "../../infrastructure/webserver/Application";
import { configureDi } from "./di";

configureDi().then(() => {
  const application = new Application();
  application.start(3000);
});
