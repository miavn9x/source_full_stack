const path = require("path");
const fs = require("fs");

const platformDir = path.resolve(__dirname, "plasmic-studio-src/platform");
const esbuildPath = path.resolve(
  platformDir,
  "node_modules/.pnpm/esbuild@0.15.18/node_modules/esbuild"
);
const esbuild = require(esbuildPath);
const { externalGlobalPlugin } = require(
  path.resolve(
    platformDir,
    "node_modules/.pnpm/esbuild-plugin-external-global@1.0.1/node_modules/esbuild-plugin-external-global"
  )
);

const reactWebDir = path.resolve(
  platformDir,
  "node_modules/.pnpm/@plasmicapp+react-web@1.0.4_30b9e50003895b2257446da5a10164a1/node_modules/@plasmicapp/react-web"
);
const dataSourcesContextDir = path.resolve(
  platformDir,
  "node_modules/.pnpm/@plasmicapp+data-sources-context@0.1.26_react@18.3.1/node_modules/@plasmicapp/data-sources-context"
);

async function buildAll() {
  const cpDir = path.resolve(platformDir, "canvas-packages");
  const cpClient = path.resolve(cpDir, "build/client.js");

  if (!fs.existsSync(cpClient)) {
    console.log("[Build] Building canvas-packages...");
    require("child_process").execSync("node ./makePkgTypes.js", { cwd: cpDir });
    require("child_process").execSync("node ./esbuild.js", { cwd: cpDir });
  }

  console.log("[Build] Building react-web-bundle...");
  const rwbOut = path.resolve(platformDir, "react-web-bundle/build/client.js");
  fs.mkdirSync(path.dirname(rwbOut), { recursive: true });
  await esbuild.build({
    entryPoints: [path.resolve(platformDir, "react-web-bundle/src/index.ts")],
    outfile: rwbOut,
    bundle: true,
    format: "iife",
    plugins: [
      externalGlobalPlugin({
        react: "__Sub.React",
        "react-dom": "__Sub.ReactDOM",
        "@plasmicapp/host": "__Sub",
        "@plasmicapp/query": "__Sub.PlasmicQuery",
        "react/jsx-runtime": "__Sub.jsxRuntime || __Sub.React",
        "react/jsx-dev-runtime": "__Sub.jsxDevRuntime || __Sub.React",
      }),
      {
        name: "resolve-plasmic",
        setup(build) {
          build.onResolve(
            { filter: /^@plasmicapp\/react-web\/lib\/data-sources$/ },
            () => ({
              path: path.join(reactWebDir, "lib/data-sources/index.js"),
            })
          );
          build.onResolve({ filter: /^@plasmicapp\/react-web$/ }, () => ({
            path: path.join(reactWebDir, "dist/react-web.esm.js"),
          }));
          build.onResolve(
            { filter: /^@plasmicapp\/data-sources-context$/ },
            () => ({
              path: path.join(dataSourcesContextDir, "dist/index.esm.js"),
            })
          );
        },
      },
    ],
  });

  console.log("[Build] Building live-frame...");
  const lfOut = path.resolve(platformDir, "live-frame/build/client.js");
  fs.mkdirSync(path.dirname(lfOut), { recursive: true });
  await esbuild.build({
    entryPoints: [path.resolve(platformDir, "live-frame/src/index.ts")],
    outfile: lfOut,
    bundle: true,
    format: "iife",
    plugins: [
      externalGlobalPlugin({
        react: "__Sub.React",
        "react-dom": "__Sub.ReactDOM",
        "@plasmicapp/host": "__Sub",
        "@plasmicapp/query": "__Sub.PlasmicQuery",
        "react/jsx-runtime": "__Sub.jsxRuntime || __Sub.React",
        "react/jsx-dev-runtime": "__Sub.jsxDevRuntime || __Sub.React",
      }),
      {
        name: "resolve-plasmic",
        setup(build) {
          build.onResolve(
            { filter: /^@plasmicapp\/react-web\/lib\/plasmic\.css$/ },
            () => ({
              path: path.join(reactWebDir, "lib/plasmic.css"),
            })
          );
          build.onResolve(
            { filter: /^@plasmicapp\/react-web\/lib\/data-sources$/ },
            () => ({
              path: path.join(reactWebDir, "lib/data-sources/index.js"),
            })
          );
          build.onResolve({ filter: /^@plasmicapp\/react-web$/ }, () => ({
            path: path.join(reactWebDir, "dist/react-web.esm.js"),
          }));
          build.onResolve(
            { filter: /^@plasmicapp\/data-sources-context$/ },
            () => ({
              path: path.join(dataSourcesContextDir, "dist/index.esm.js"),
            })
          );
        },
      },
    ],
  });

  // Copy into wab's build directory directly
  const wabStatic = path.resolve(platformDir, "wab/build/static");
  const commitHash = "7d66db";

  const targets = [
    {
      src: rwbOut,
      dstName: "react-web-bundle/build/client",
    },
    {
      src: lfOut,
      dstName: "live-frame/build/client",
    },
    {
      src: cpClient,
      dstName: "canvas-packages/build/client",
    },
  ];

  for (const t of targets) {
    if (fs.existsSync(t.src)) {
      const dir = path.join(wabStatic, path.dirname(t.dstName));
      fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(t.src, path.join(wabStatic, `${t.dstName}.${commitHash}.js`));
      fs.copyFileSync(t.src, path.join(wabStatic, `${t.dstName}.js`));
    }
  }

  console.log("[Build] All canvas bundles successfully built and copied!");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
