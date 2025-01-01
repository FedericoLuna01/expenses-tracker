import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
  type UserType,
} from "@kinde-oss/kinde-typescript-sdk";
import { type Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { z } from "zod";

// const KindeEnv = z.object({
//   KINDE_DOMAIN: z.string(),
//   KINDE_CLIENT_ID: z.string(),
//   KINDE_CLIENT_SECRET: z.string(),
//   KINDE_REDIRECT_URI: z.string().url(),
//   KINDE_LOGOUT_REDIRECT_URI: z.string().url(),
// });

// throws an exception if the environment is missing something vital
// const ProcessEnv = KindeEnv.parse(process.env);

// Client for authorization code flow
export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: process.env.KINDE_ISSUER_URL!,
    clientId: process.env.KINDE_CLIENT_ID!,
    clientSecret: process.env.KINDE_CLIENT_SECRET!,
    redirectURL: process.env.KINDE_SITE_URL!,
    logoutRedirectURL: process.env.KINDE_POST_LOGOUT_REDIRECT_URL!,
  }
);

let store: Record<string, unknown> = {};

export const sessionManager: SessionManager = {
  async getSessionItem(key: string) {
    return store[key];
  },
  async setSessionItem(key: string, value: unknown) {
    store[key] = value;
  },
  async removeSessionItem(key: string) {
    delete store[key];
  },
  async destroySession() {
    store = {};
  }
};

// export const sessionManager = (c: Context): SessionManager => ({
//   async getSessionItem(key: string) {
//     const result = getCookie(c, key);
//     return result;
//   },
//   async setSessionItem(key: string, value: unknown) {
//     const cookieOptions = {
//       httpOnly: true,
//       secure: true,
//       sameSite: "Lax",
//     } as const;
//     if (typeof value === "string") {
//       setCookie(c, key, value, cookieOptions);
//     } else {
//       setCookie(c, key, JSON.stringify(value), cookieOptions);
//     }
//   },
//   async removeSessionItem(key: string) {
//     deleteCookie(c, key);
//   },
//   async destroySession() {
//     ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
//       deleteCookie(c, key);
//     });
//   },
// });