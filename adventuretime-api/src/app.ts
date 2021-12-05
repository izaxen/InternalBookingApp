import Express, { Application } from "express";
import Cors from "cors";
import helmet from "helmet";
import passport from "passport";
import Compression from "compression";
import bearerStrategy from "./config/bearerStrategy";
import Routes from "./routes";





const app: Application = Express();
app.use(Cors({ origin: "*" }));
app.use(passport.initialize());
passport.use(bearerStrategy);
app.use(helmet());
app.use(Compression());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json({ type: '*/*', limit: '50mb' }));

app.enable("trust proxy");

Routes(app);

export default app;