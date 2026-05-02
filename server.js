const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const PORT = 3000;
const logFile = path.join(__dirname, "visitors.log");
const backupFile = path.join(__dirname, "backup.log");
function getTime(sec) {
    let h = Math.floor(sec / 3600);
    let m = Math.floor((sec % 3600) / 60);
    let s = Math.floor(sec % 60);
    return h + "h " + m + "m " + s + "s";
}
const server = http.createServer((req, res) => {
    if (req.url == "/updateUser") {
        let data = new Date() + "\n";
        fs.appendFile(logFile, data, function (err) {
            res.writeHead(200, { "Content-Type": "text/plain" });
            if (err) res.end("Error");
            else res.end("Saved");
        });
    }
    else if (req.url == "/saveLog") {
        fs.readFile(logFile, "utf8", function (err, data) {
            res.writeHead(200, { "Content-Type": "text/plain" });
            if (err) res.end("No logs");
            else res.end(data);
        });
    }
    else if (req.url == "/backup") {
        fs.copyFile(logFile, backupFile, function (err) {
            res.writeHead(200, { "Content-Type": "text/plain" });
            if (err) res.end("Copy error");
            else res.end("Copied");
        });
    }
    else if (req.url == "/clearLog") {
        fs.unlink(logFile, function () {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Deleted");
        });
    }
    else if (req.url == "/serverInfo") {
        let cpu = os.cpus();
        let info = {
            hostname: os.hostname(),
            platform: os.platform(),
            cpuModel: cpu[0].model,
            cpuCores: cpu.length,
            totalMemoryGB: (os.totalmem() / 1e9).toFixed(2),
            freeMemoryGB: (os.freemem() / 1e9).toFixed(2),
            uptime: getTime(os.uptime())
        };

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(info));
    }
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});
server.listen(PORT, function () {
    console.log("Server running on port 3000");
});