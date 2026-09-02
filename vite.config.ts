import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    dts: {
      tsgo: true
    },
    exports: true
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true
    },
    env: {
      browser: true
    }
  },
  fmt: {
    singleQuote: true,
    sortImports: {
      newlinesBetween: false,
      sortSideEffects: true
    },
    trailingComma: 'none'
  }
});
