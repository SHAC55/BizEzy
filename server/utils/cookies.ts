import type { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";
<<<<<<< HEAD
export const REFRESH_PATH = "/auth/refresh";
const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure: false,
=======
import { NODE_ENV } from "../constants/env";

export const REFRESH_PATH = "/auth/refresh";

const isProd = NODE_ENV === "production";

const defaults: CookieOptions = {
  sameSite: isProd ? "none" : "lax",
  httpOnly: true,
  secure: isProd,
>>>>>>> dev
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinutesFromNow(),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  path: REFRESH_PATH,
});

type params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = ({ res, accessToken, refreshToken }: params) =>
  res
<<<<<<< HEAD
    .cookie("access-token", accessToken, getAccessTokenCookieOptions())
    .cookie("refresh-token", refreshToken, getRefreshTokenCookieOptions());

export const clearAuthCookies = (res: Response) =>
  res
    .clearCookie("accessToken")
    .clearCookie("refresh-token", { path: REFRESH_PATH });
=======
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

export const clearAuthCookies = (res: Response) =>
  res
    .clearCookie("accessToken", { ...defaults })
    .clearCookie("refreshToken", { ...defaults, path: REFRESH_PATH });
>>>>>>> dev
