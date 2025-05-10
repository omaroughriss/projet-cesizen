import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080', // adapte selon ton projet
    setupNodeEvents(on, config) {
      // implement node event listeners here si besoin
    },
  },
});
