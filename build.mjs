import esbuild from "esbuild";
import extensibilityMap from "@neos-project/neos-ui-extensibility/extensibilityMap.json" with { type: "json" };

const watch = process.argv.includes("--watch");
const dev = process.argv.includes("--dev");
const minify = !dev && !watch;

/** @type {import("esbuild").BuildOptions} */
const options = {
    logLevel: "info",
    bundle: true,
    minify,
    sourcemap: watch,
    legalComments: "none",
    entryPoints: ["Resources/Private/NeosUI/Plugin.js"],
    outdir: "Resources/Public",
    alias: extensibilityMap,
    format: "iife",
    target: "es2020",
    loader: {
        ".js": "jsx",
    },
};

if (minify) {
    options.drop = ["debugger"];
    options.pure = ["console.log"];
    options.dropLabels = ["DEV"];
}

if (watch) {
    esbuild.context(options).then((ctx) => ctx.watch());
} else {
    esbuild.build(options);
}
