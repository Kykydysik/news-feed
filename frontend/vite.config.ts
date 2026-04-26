import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../", "");

  return {
    plugins: [tailwindcss(), reactRouter()],
    define: {
      "import.meta.env.VITE_BACKEND_HOST": JSON.stringify(
        env.VITE_BACKEND_HOST,
      ),
      "import.meta.env.OTHER_VAR": JSON.stringify(env.OTHER_VAR),
    },
    resolve: {
      tsconfigPaths: true,
    },
  };
});
