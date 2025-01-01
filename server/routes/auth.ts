import { Hono } from "hono";
import { kindeClient, sessionManager } from "../kinde.js";

export const authRoute = new Hono()
  .get("/login", async (c) => {
    const loginUrl = await kindeClient.login(sessionManager);
    return c.redirect(loginUrl.toString());
  })
  .get("/register", async (c) => {
    const registerUrl = await kindeClient.register(sessionManager);
    return c.redirect(registerUrl.toString());
  })
  .get("/callback", async (c) => {
    console.log(c.req.url)
    const url = new URL(c.req.url);
    await kindeClient.handleRedirectToApp(sessionManager, url);
    return c.redirect("/");
  })
  .get("/logout", async (c) => {
    const logoutUrl = await kindeClient.logout(sessionManager);
    return c.redirect(logoutUrl.toString());
  })
  .get("/me", async (c) => {
    const isAuthenticated = await kindeClient.isAuthenticated(sessionManager);
    return c.json({ isAuthenticated, test: process.env.KINDE_ISSUER_URL, a: "a" });
    if (isAuthenticated) {
      return
    }
  })