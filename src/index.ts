import { serve } from "bun";
import index from "./index.html";

const server = serve({
  port: 3000,
  routes: {
    "/assets/*": {
      GET: async (req) => {
        const url = new URL(req.url);
        const path = url.pathname.replace("/assets/", "");
        const file = Bun.file(`public/assets/${path}`);
        if (await file.exists()) {
          return new Response(file);
        }
        return new Response("Not Found", { status: 404 });
      },
    },
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);