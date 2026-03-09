// rollup.config.js
import typescript from "@rollup/plugin-typescript";

export default {
  input: "index.ts",
  output: {
    name: "bully-me",
    file: `dist/bully-me`,
    format: "es",
  },
  plugins: [typescript()],
};
