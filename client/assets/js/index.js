import RoomModule from "./room.js";
import WebSocketFunc from "./websocket.js";
const URL = "192.168.0.105"; /* 换上自己机子的内网IP */
const PORT = "4000";
let ws = null;
let uName = null;
let nameReg = /^([\u4e00-\u9fa5]|\w){2,6}$/; // 2-6个字符或汉字

do {
  uName = prompt("请输入您的昵称 (2-6个字母，下划线，数字或汉字)");
  // uName = "彭尼玛";
} while (uName == "" || !nameReg.test(uName));

if (uName != null) {
  window.onload = function() {
    let mainBody = document.querySelector(".main-body");

    let msgObj = {
      msg: "",
      type: 1, //1：发信息 2：删除(根据id)
      id: null,
      uName
    };

    // 移动端键盘弹起
    let oldHeight = document.body.offsetHeight;
    window.onresize = function() {
      let newHeight = document.body.offsetHeight;
      if (oldHeight > newHeight) {
        mainBody.style.height = document.body.offsetHeight - 25 + "px";
      } else {
        mainBody.style.height = document.body.offsetHeight + "px";
      }
    };

    //聊天室人员显示模块
    RoomModule();

    // 如果浏览器有 WS 就执行
    if ("WebSocket" in window) {
      //WS连接模块
      WebSocketFunc(URL, PORT, ws, uName, msgObj);
    }
  };
}
