import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const ua = (req.headers["user-agent"] || "").toLowerCase();
    const isRoblox = ua === "" || ua.includes("roblox");

    if (isRoblox) {
      res.setHeader("Content-Type", "text/plain");
      
      // สคริปต์ตัวเต็มที่ส่งให้ Executor รันในเกมแยกบรรทัดชัดเจน ไม่รวบเป็นแถวเดียว
      const luaScript = [
        'script_key = "KEY";',
        'getgenv().discordId = "1494617292250550334";',
        'loadstring(game:HttpGet("https://api.driath.net/files/v4/loaders/61d67426af8207b22bde1afb308d9ff4.lua"))();',
        'local url = "https://raw.githubusercontent.com/Teufkijdjd/Prisonlife-zeion/main/zeion-prisonl-life.txt";',
        'local ok, data = pcall(function() return game:HttpGet(url) end);',
        'if ok and data then loadstring(data)() else warn("Load failed") end'
      ].join('\n');

      return res.status(200).send(luaScript);
    }

    // ดึงหน้าเว็บจาก public/loader.html มาเรนเดอร์ใน Browser
    const filePath = path.join(process.cwd(), 'public', 'loader.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');

    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    return res.status(200).send(htmlContent);

  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
}
