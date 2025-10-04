import http from "http";
import { readFileSync, existsSync } from "fs";

const CONFIG_PATH = process.env.ICON_CONFIG_PATH || "/config/icon_gallery.json";
const PORT = process.env.PORT || 5173;

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, "http://localhost"); // 关键：解析 pathname

  if (pathname === "/icons.json") {
    try {
      if (!existsSync(CONFIG_PATH)) {
        res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: `Config not found at ${CONFIG_PATH}` }));
        return;
      }
      const json = readFileSync(CONFIG_PATH, "utf-8");
      // 简单校验是否为 JSON（可选）
      try { JSON.parse(json); } catch (e) {
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "Invalid JSON in config file", detail: String(e) }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
      res.end(json);
    } catch (e) {
      res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: String(e) }));
    }
    return;
  }

  // 其他请求都返回页面
  try {
    const html = readFileSync("./index.html");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(String(e));
  }
});

server.listen(PORT, () => {
  console.log(`Icon Gallery running: http://localhost:${PORT}`);
  console.log(`Using icon config: ${CONFIG_PATH}`);
});
