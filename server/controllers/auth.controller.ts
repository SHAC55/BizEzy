import catchErrors from "../utils/catchErrors";
import {
<<<<<<< HEAD
  createAccount,
=======
  completeOnboarding,
  createAccount,
  googleAuth,
>>>>>>> dev
  loginUser,
  refreshUserAccessToken,
  resetPassword,
  sendPasswordResetEmail,
  verifyEmail,
} from "../services/auth.service";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import {
<<<<<<< HEAD
  emailSchema,
  loginSchema,
=======
  loginSchema,
  onboardingSchema,
>>>>>>> dev
  registerSchema,
  resetPasswordSchema,
  verificationCodeSchema,
} from "./auth.schemas";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../config/db";
import appAssert from "../utils/appAssert";
<<<<<<< HEAD
=======
import { APP_ORIGIN } from "../constants/env";
import {
  decodeGoogleMobileState,
  getAccessTokenFromRequest,
  getRefreshTokenFromRequest,
  isMobileAuthRequest,
} from "../utils/requestAuth";
>>>>>>> dev

export const registerHandler = catchErrors(async (req, res) => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  const { user, accessToken, refreshToken } = await createAccount(request);
<<<<<<< HEAD
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(user);
=======

  setAuthCookies({ res, accessToken, refreshToken });

  if (isMobileAuthRequest(req)) {
    return res.status(CREATED).json({ user, accessToken, refreshToken });
  }

  return res.status(CREATED).json(user);
>>>>>>> dev
});

export const loginHandler = catchErrors(async (req, res) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
<<<<<<< HEAD
  const { accessToken, refreshToken } = await loginUser(request);
  return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({
    message: "login successful",
  });
});
export const logoutHandler = catchErrors(async (req, res) => {
  const accessToken = req.cookies["access-token"] as string | undefined;

=======
  const { safeUser, accessToken, refreshToken } = await loginUser(request);

  setAuthCookies({ res, accessToken, refreshToken });

  if (isMobileAuthRequest(req)) {
    return res.status(OK).json({
      message: "login successful",
      user: safeUser,
      accessToken,
      refreshToken,
    });
  }

  return res.status(OK).json({ message: "login successful", user: safeUser });
});

export const logoutHandler = catchErrors(async (req, res) => {
  const accessToken = getAccessTokenFromRequest(req);
>>>>>>> dev
  const { payload } = verifyToken(accessToken || "");

  if (payload) {
    await prisma.session.deleteMany({
<<<<<<< HEAD
      where: {
        id: Number(payload.sessionId),
      },
    });
  }
=======
      where: { id: Number(payload.sessionId) },
    });
  }

>>>>>>> dev
  return clearAuthCookies(res).status(OK).json({
    message: "logout successful",
  });
});
<<<<<<< HEAD
export const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies["refresh-token"] as string | undefined;
  appAssert(refreshToken, UNAUTHORIZED, "missing refresh-token");
  const { accessToken, newRefreshToken } =
    await refreshUserAccessToken(refreshToken);
  if (newRefreshToken) {
    res.cookie(
      "refresh-token",
      newRefreshToken,
      getRefreshTokenCookieOptions(),
    );
  }
  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({
      message: "Access Token Refreshed",
    });
});
export const verifyEmailHandler = catchErrors(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code);
  await verifyEmail(verificationCode);
  return res.status(OK).json({
    message: "email verified",
  });
});

export const forgotPasswordHandler = catchErrors(async (req, res) => {
  const email = emailSchema.parse(req.body.email);
  await sendPasswordResetEmail(email);
  return res.status(OK).json({
    message: "password reset email send",
  });
=======

export const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = getRefreshTokenFromRequest(req);
  appAssert(refreshToken, UNAUTHORIZED, "missing refresh token");

  const { accessToken, newRefreshToken } =
    await refreshUserAccessToken(refreshToken);

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }

  res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());

  if (isMobileAuthRequest(req)) {
    return res.status(OK).json({
      message: "access token refreshed",
      accessToken,
      refreshToken: newRefreshToken || refreshToken,
    });
  }

  return res.status(OK).json({ message: "access token refreshed" });
});

export const verifyEmailHandler = catchErrors(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code);
  await verifyEmail(verificationCode);
  return res.status(OK).json({ message: "email verified" });
});

export const forgotPasswordHandler = catchErrors(async (req, res) => {
  const { email } = req.body;
  appAssert(email, 400, "email is required");
  await sendPasswordResetEmail(email);
  return res.status(OK).json({ message: "password reset email sent" });
>>>>>>> dev
});

export const resetPasswordHandler = catchErrors(async (req, res) => {
  const request = resetPasswordSchema.parse(req.body);
  await resetPassword(request);
  return clearAuthCookies(res).status(OK).json({
    message: "password reset successful",
  });
});
<<<<<<< HEAD
=======

export const googleAuthCallbackHandler = catchErrors(async (req, res) => {
  const { email, name, provider } = req.user as {
    email: string;
    name: string;
    provider: string;
  };

  const { accessToken, refreshToken, isOnboardingComplete } = await googleAuth({
    email,
    name,
    provider,
    userAgent: req.headers["user-agent"],
  });

  setAuthCookies({ res, accessToken, refreshToken });

  const mobileState = decodeGoogleMobileState(
    typeof req.query.state === "string" ? req.query.state : undefined,
  );

  if (mobileState) {
    const redirectUrl = new URL(mobileState.redirectUri);
    redirectUrl.searchParams.set("accessToken", accessToken);
    redirectUrl.searchParams.set("refreshToken", refreshToken);
    redirectUrl.searchParams.set(
      "onboarding",
      isOnboardingComplete ? "0" : "1",
    );

    return res.redirect(redirectUrl.toString());
  }

  const redirectUrl = isOnboardingComplete
    ? `${APP_ORIGIN}/dashboard`
    : `${APP_ORIGIN}/onboarding`;

  return res.redirect(redirectUrl);
});

export const onboardingHandler = catchErrors(async (req, res) => {
  const request = onboardingSchema.parse(req.body);
  const userId = req.userId;
  appAssert(userId, UNAUTHORIZED, "not authenticated");

  const user = await completeOnboarding({
    userId,
    phone: request.phone,
    username: request.username,
    businessName: request.businessName,
  });

  return res.status(OK).json({ message: "onboarding complete", user });
});
>>>>>>> dev
