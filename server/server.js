const PORT = 4000;
const ws = require("ws");
const wss = new ws.Server({
  port: PORT
});

const webSockets = [];

/**
 * 监听 来自前端的ws请求
 */
wss.on("connection", function(ws) {
  webSockets.push(ws);
  console.log(`前端接入,存在 ${webSockets.length} 条`);

  ws.on("message", function(msg) {
    let obj = {
      msg,
      isMine: false
    };
    webSockets.forEach(item => {
      if (this != item) {
        obj.isMine = false;
        item.send(JSON.stringify(obj));
      } else {
        obj.isMine = true;
        item.send(JSON.stringify(obj));
      }
    });
  });

  ws.on("close", function() {
    console.log("前端关闭了");
    webSockets.forEach(item => {
      if (item == this) {
        let index = webSockets.indexOf(item);
        webSockets.splice(index, 1);
      }
    });
    console.log(`剩余 ${webSockets.length} 条`);
  });
});
