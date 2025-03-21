import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: '**/*.spec.ts',
    viewportHeight: 1080,
    viewportWidth: 1920,
    baseUrl: process.env.BASE_URL
  },
});
