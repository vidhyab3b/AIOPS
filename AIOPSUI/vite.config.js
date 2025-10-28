
// import path from 'path';
// import framework7 from 'rollup-plugin-framework7';

// import { createHtmlPlugin } from 'vite-plugin-html';

// process.env.TARGET = process.env.TARGET || 'web';
// const isCordova = process.env.TARGET === 'cordova';
// const SRC_DIR = path.resolve(__dirname, './src');
// const PUBLIC_DIR = path.resolve(__dirname, './public');
// const BUILD_DIR = path.resolve(
//   __dirname,
//   isCordova ? './cordova/www' : './www',
// );
// export default async () => {

//   return  {
//     plugins: [
//       framework7({ emitCss: false }),
//       createHtmlPlugin({
//         minify: false,
//         inject: {
//           data: {
//             TARGET: process.env.TARGET,
//           },
//         },
//       }),
//     ],
//     root: SRC_DIR,
//     base: '',
//     publicDir: PUBLIC_DIR,
//     build: {
//       outDir: BUILD_DIR,
//       assetsInlineLimit: 0,
//       emptyOutDir: true,
//       rollupOptions: {
//         treeshake: false,
//       },
//     },
//     resolve: {
//       alias: {
//         '@': SRC_DIR,
//       },
//     },
//     server: {
//       host: true,
//       allowedhosts: ["localhost","aiopsui-aiops.apps.cluster-wkq7q.wkq7q.sandbox2937.opentlc.com"]
//     },
//     esbuild: {
//       jsxFactory: '$jsx',
//       jsxFragment: '"Fragment"',
//     },
//   };
// }
import path from 'path';
import framework7 from 'rollup-plugin-framework7';

import { createHtmlPlugin } from 'vite-plugin-html';
/* export default defineConfig({
  server: {
    cors: false, // Disables CORS headers from Vite's dev server
  },
}); */

process.env.TARGET = process.env.TARGET || 'web';
const isCordova = process.env.TARGET === 'cordova';
const SRC_DIR = path.resolve(__dirname, './src');
const PUBLIC_DIR = path.resolve(__dirname, './public');
const BUILD_DIR = path.resolve(
  __dirname,
  isCordova ? './cordova/www' : './www',
);
export default async () => {

  return  {
    plugins: [
      framework7({ emitCss: false }),
      createHtmlPlugin({
        minify: false,
        inject: {
          data: {
            TARGET: process.env.TARGET,
          },
        },
      }),
    ],
    root: SRC_DIR,
    base: '',
    publicDir: PUBLIC_DIR,
    build: {
      outDir: BUILD_DIR,
      assetsInlineLimit: 0,
      emptyOutDir: true,
      rollupOptions: {
        treeshake: false,
      },
    },
    resolve: {
      alias: {
        '@': SRC_DIR,
      },
    },
    server: {
      host: true,
      cors: false,
      allowedHosts: ['aiopsui-aiops.apps.cluster-zhg5b.zhg5b.sandbox515.opentlc.com']
    },
    esbuild: {
      jsxFactory: '$jsx',
      jsxFragment: '"Fragment"',
    },
  };
}