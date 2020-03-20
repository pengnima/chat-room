const PORT = 4000;
const ws = require("ws");
const uuId = require("node-uuid");
const wss = new ws.Server({
  port: PORT
});

let webSockets = [];
let nameArr = [];
/**
 * 监听 来自前端的ws请求
 */
wss.on("connection", function(ws) {
  let id = uuId.v1();

  webSockets.push({ ws, id });
  //第一次发送(把 id 发送过去)
  mySend(ws, { id, type: 0 });
  console.log(`前端接入,存在 ${webSockets.length} 条`);

  /**
   * 监听 来自前端的message
   */
  ws.on("message", function(msgObj_forward) {
    let msgObj = JSON.parse(msgObj_forward);
    switch (msgObj.type) {
      case 0:
        //加昵称
        nameArr.push({ name: msgObj.name, id });
        let names = [];
        nameArr.forEach(item => {
          names.push(item.name);
        });
        webSockets.forEach(item => {
          mySend(item.ws, { names, truename: msgObj.name, type: 2 });
        });
        break;
      case 1:
        //发信息
        let obj = {
          msg: msgObj.msg,
          type: 1,
          id: msgObj.id, //判断前端的用户是谁
          name: msgObj.uName
        };
        //webSockets 里存放的都是 最后一个id的信息
        webSockets.forEach(item => {
          mySend(item.ws, obj);
        });
        console.log(nameArr);
        break;
      case 2:
        //删除信息（根据id）
        let index = webSockets.indexOf(msgObj.id);
        webSockets.splice(index, 1);

        let index2 = nameArr.indexOf(msgObj.id);
        nameArr.splice(index2, 1);

        console.log(`剩余 ${webSockets.length} 条`);
        break;
      default:
        break;
    }
  });

  ws.on("close", function() {
    console.log("前端关闭了");
  });
});

function mySend(_ws, obj) {
  _ws.send(JSON.stringify(obj));
}
