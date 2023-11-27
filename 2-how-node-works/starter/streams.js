const fs = require("fs");
const server = require("http").createServer();

// server.on("request", (req, res) => {
//   fs.readFile("./test-file.txt", (err, data) => {
//     res.end(data);
//   });
// });

// server.on("request", (req, res) => {
//   const readableStream = fs.createReadStream("./test-file.txt");
//
//   readableStream.on("data", (chunk) => {
//     res.write(chunk);
//   });
//
//   readableStream.on("end", () => {
//     res.end();
//   });
// });

server.on("request", (req, res) => {
  const readableStream = fs.createReadStream("./test-file.txt");
  readableStream.pipe(res);
});

server.listen(8000, "127.0.0.1");
