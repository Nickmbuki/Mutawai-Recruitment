import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { applicationsRouter } from "./modules/applications/applications.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { companiesRouter } from "./modules/companies/companies.routes.js";
import { jobsRouter } from "./modules/jobs/jobs.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("combined"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "mutawai-recruitment-api" });
});

app.use("/api/auth", authRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/companies", companiesRouter);
app.use("/api/admin", adminRouter);

app.use("/auth", authRouter);
app.use("/jobs", jobsRouter);
app.use("/applications", applicationsRouter);
app.use("/companies", companiesRouter);
app.use("/admin", adminRouter);

app.use(errorMiddleware);
