import { exampleRouter } from "./example";
import { healthRouter } from "./health";
import { filesRouter } from "./files";
import { router, _testRouter } from "./trpc";

export const appRouter = router({
  health: healthRouter,
  example: exampleRouter,
  files: filesRouter,
});

export const testRouter = _testRouter({
  health: healthRouter,
  example: exampleRouter,
  files: filesRouter,
});

export type AppRouter = typeof appRouter;
