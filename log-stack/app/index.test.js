const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

const app = require("./index");

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const payload = body ? JSON.stringify(body) : null;
      const { port } = server.address();
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port,
          path,
          method,
          headers: payload
            ? {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(payload),
              }
            : undefined,
        },
        (res) => {
          let data = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            server.close(() => {
              resolve({
                statusCode: res.statusCode,
                body: data,
              });
            });
          });
        },
      );

      req.on("error", (error) => {
        server.close(() => reject(error));
      });

      if (payload) {
        req.write(payload);
      }

      req.end();
    });
  });
}

test("GET / returns Hello", async () => {
  const response = await request("GET", "/");
  assert.equal(response.statusCode, 200);
  assert.equal(response.body, "Hello");
});

test("POST /login accepts admin", async () => {
  const response = await request("POST", "/login", { username: "admin" });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(JSON.parse(response.body), { message: "success" });
});

test("POST /register validates required fields", async () => {
  const response = await request("POST", "/register", { username: "demo" });
  assert.equal(response.statusCode, 400);
  assert.deepEqual(JSON.parse(response.body), { message: "missing fields" });
});
