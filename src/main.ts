import "reflect-metadata";
import { configureDi } from "./di";
import { Application } from "./infrastructure/webserver/Application";

configureDi();
const application = new Application();
application.start(3000);
