const http = require("node:http");

const characters = [
  { name: "Daenerys Targaryen", house: "Targaryen", title: "Mother of Dragons" },
  { name: "Jon Snow", house: "Stark", title: "King in the North" },
  { name: "Arya Stark", house: "Stark", title: "A traveler with many faces" },
  { name: "Tyrion Lannister", house: "Lannister", title: "Hand of the Queen" },
];

function send(response, statusCode, contentType, body) {
  response.writeHead(statusCode, { "Content-Type": contentType });
  response.end(body);
}

function makeHomePage() {
  const cards = characters
    .map(
      (character) => `
        <article class="card">
          <h2>${character.name}</h2>
          <p><strong>House:</strong> ${character.house}</p>
          <p>${character.title}</p>
        </article>`,
    )
    .join("");

  const names = JSON.stringify(characters.map((character) => character.name));

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Westeros Character Guide</title>
    <style>
      body { font: 16px/1.5 system-ui, sans-serif; max-width: 760px; margin: 40px auto; padding: 0 20px; background: #f5f3ef; color: #252525; }
      h1 { color: #7a2929; }
      .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
      .card { background: white; border: 1px solid #ddd5ca; border-radius: 10px; padding: 16px; }
      .card h2 { margin-top: 0; }
      button { padding: 10px 14px; border: 0; border-radius: 7px; background: #7a2929; color: white; cursor: pointer; }
    </style>
  </head>
  <body>
    <h1>Westeros Character Guide</h1>
    <p>A small guide to a few Game of Thrones characters.</p>
    <section class="cards">${cards}
    </section>
    <p><button id="pick">Pick a character</button></p>
    <p id="result" aria-live="polite"></p>
    <script>
      const names = ${names};
      document.getElementById("pick").addEventListener("click", () => {
        const name = names[Math.floor(Math.random() * names.length)];
        document.getElementById("result").textContent = "Your pick: " + name;
      });
    </script>
  </body>
</html>`;
}

function createServer() {
  return http.createServer((request, response) => {
    const path = new URL(request.url, "http://localhost").pathname;

    if (request.method === "GET" && path === "/") {
      return send(response, 200, "text/html; charset=utf-8", makeHomePage());
    }

    if (request.method === "GET" && path === "/api/characters") {
      return send(response, 200, "application/json; charset=utf-8", JSON.stringify(characters));
    }

    if (request.method === "GET" && path === "/health") {
      return send(response, 200, "text/plain; charset=utf-8", "OK");
    }

    return send(response, 404, "text/plain; charset=utf-8", "Not found");
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  createServer().listen(port, "0.0.0.0", () => {
    console.log(`Westeros Character Guide is running at http://localhost:${port}`);
  });
}

module.exports = { createServer };
