// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { userRouter } from "./user";
import { authRouter } from "./auth";
import { listItemRouter } from "./listItem";
import { mediaRouter } from "./media";

export const appRouter = router({
  user: userRouter,
  auth: authRouter,
  listItem: listItemRouter,
  media: mediaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
