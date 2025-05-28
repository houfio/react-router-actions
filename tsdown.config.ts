import { defineConfig } from 'tsdown/config';

export default defineConfig({
  entry: 'src/index.ts',
  dts: true,
  exports: true
});
