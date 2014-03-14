var config = module.exports;

config.server = {
    environment: "node",
    tests: ["test/**.js"]
};

// config.browser = {
//     environment: "browser",
//     sources: [
//         "node_modules/bane/lib/bane.js",
//         "src/matrix.js",
//         "src/puzzle.js"
//     ],
//     tests: [
//         "test/matrix-test.js",
//         "test/puzzle-test.js"
//     ]
// };
