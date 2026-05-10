import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport";
import errorHandler from "./middleware/errorHandler";
import authRoutes from "./routes/auth.route";
import authenticate from "./middleware/authenticate";
import userRoutes from "./routes/user.route";
import sessionRoutes from "./routes/session.route";
import productRoutes from "./routes/product.route";
import serviceRoutes from "./routes/service.route";
import businessRoutes from "./routes/business.route";
import customerRoutes from "./routes/customer.route";
import saleRoutes from "./routes/sale.route";
const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.APP_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(passport.initialize());
app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
    msg: "healthy",
  });
});
app.use("/auth", authRoutes);
app.use("/user", authenticate, userRoutes);
app.use("/sessions", authenticate, sessionRoutes);
app.use("/business", authenticate, businessRoutes);
app.use("/products", authenticate, productRoutes);
app.use("/services", authenticate, serviceRoutes);
app.use("/customers", authenticate, customerRoutes);
app.use("/sales", authenticate, saleRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`running on port ${process.env.PORT}`),
);
