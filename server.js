const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 4000;

// قراءة قاعدة البيانات (JSON)
const readDB = () => {
  try {
    return JSON.parse(fs.readFileSync("db.json", "utf8"));
  } catch {
    return { data: [] };
  }
};

// كتابة قاعدة البيانات
const writeDB = (data) => {
  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
};

const server = http.createServer((req, res) => {
  // API GET
  if (req.url === "/api/data" && req.method === "GET") {
    const db = readDB();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(db));
  }

  // API POST
  else if (req.url === "/api/data" && req.method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      const db = readDB();
      const newData = JSON.parse(body);

      db.data.push(newData);
      writeDB(db);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "saved", data: newData }));
    });
  }

  // عرض الصفحة الرئيسية
  else if (req.url === "/" && req.method === "GET") {
    const filePath = path.join(__dirname, "public", "index.html");

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        return res.end("Error loading page");
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content);
    });
  }

  // أي مسار غير موجود
  else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

console.log("STARTING HUSSAM CORE AI SERVER...");

server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
