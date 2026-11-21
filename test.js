const assert = require("node:assert/strict");
const { createServer } = require("./app");

async function main() {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const homeResponse = await fetch(baseUrl);
    const homePage = await homeResponse.text();
    assert.equal(homeResponse.status, 200);
    assert.match(homePage, /Westeros Character Guide/);
    assert.match(homePage, /Pick a character/);

    const apiResponse = await fetch(`${baseUrl}/api/characters`);
    const characters = await apiResponse.json();
    assert.equal(apiResponse.status, 200);
    assert.ok(characters.some((character) => character.name === "Daenerys Targaryen"));
    assert.equal(characters.length, 4);

    const healthResponse = await fetch(`${baseUrl}/health`);
    assert.equal(await healthResponse.text(), "OK");

    const missingResponse = await fetch(`${baseUrl}/missing`);
    assert.equal(missingResponse.status, 404);

    console.log("Tests passed: home page, character API, health check, and 404 response.");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

