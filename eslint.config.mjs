import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["./next/**", "out/**", "build/**", "next-env.d.ts"],
    extends: [nextVitals, nextTs, prettier], 
  },
]);

