const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");

const result = spawnSync(process.execPath, ["app.js"], { encoding: "utf8" });

assert.equal(result.status, 0, result.stderr);
assert.equal(result.stdout, "Game of Thrones\n");

console.log("Test passed: app.js prints the expected message.");
