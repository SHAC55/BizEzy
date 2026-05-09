import type { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";
import { NODE_ENV } from "../constants/env";

export const REFRESH_PATH = "/auth/refresh";

const isProd = NODE_ENV === "production";

const defaults: CookieOptions = {
  sameSite: isProd ? "none" : "lax",
  httpOnly: true,
  secure: isProd,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinutesFromNow(),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  // path: REFRESH_PATH,
  path: "/",
});

type params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = ({ res, accessToken, refreshToken }: params) =>
  res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

export const clearAuthCookies = (res: Response) =>
  res
    .clearCookie("accessToken", { ...defaults })
    // .clearCookie("refreshToken", { ...defaults, path: REFRESH_PATH });
    .clearCookie("refreshToken", { ...defaults, path: "/" });
