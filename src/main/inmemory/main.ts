import "reflect-metadata";
import { Application } from "../../infrastructure/webserver/Application";
import { configureDi } from "./di";

configureDi();
const application = new Application();
application.start(3000);
