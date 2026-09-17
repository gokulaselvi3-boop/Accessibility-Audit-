const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/api/health") {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: "success",
      message: "Accessibility Audit Server is running"
    }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({
    status: "error",
    message: "Route not found"
  }));
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
