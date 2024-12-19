import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./libs/config";
import cookieParser from "cookie-parser";

// Interens

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));

// Sessions

// Views

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routers

app.use("/", router);
app.use("/admin", routerAdmin);

export default app;
