import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";

const root = normalize(process.argv[2] || "dist");
const startPort = Number(process.env.PORT || 4173);
const lastPort = startPort + 10;
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8"
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";

    let file = normalize(join(root, pathname));
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403, { "content-type": "text/plain" });
      response.end("Forbidden");
      return;
    }

    const info = await stat(file);
    if (info.isDirectory()) file = join(file, "index.html");

    const body = await readFile(file);
    response.writeHead(200, {
      "content-type": types[extname(file)] || "application/octet-stream"
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain" });
    response.end("Not found");
  }
});

function tryListen(port) {
  return new Promise((resolve, reject) => {
    const onListening = () => {
      server.off("error", onError);
      resolve(server.address().port);
    };
    const onError = (error) => {
      server.off("listening", onListening);
      reject(error);
    };
    server.once("listening", onListening);
    server.once("error", onError);
    server.listen(port);
  });
}

for (let port = startPort; ; port += 1) {
  try {
    const actual = await tryListen(port);
    console.log(`Serving ${root} at http://localhost:${actual}`);
    break;
  } catch (error) {
    if (error.code === "EADDRINUSE" && port < lastPort) {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
      continue;
    }
    if (error.code === "EADDRINUSE") {
      console.error(`Ports ${startPort}-${lastPort} are all in use. Stop the other server or run with PORT=<port>.`);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}
