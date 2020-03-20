const URL = "192.168.0.105";
const PORT = "4000";
let uName = null;
let nameReg = /^([\u4e00-\u9fa5]|\w){3,6}$/; // 3-6个字符或汉字
do {
  uName = prompt("请输入您的昵称 (3-6个字母，下划线，数字或汉字)");
} while (uName == null || uName == "" || !nameReg.test(uName));

window.onload = function() {
  /*
   * 获取各个元素
   */
  let oBtn = document.querySelector(".user-send");
  let oInput = document.querySelector(".user-input");
  let viewContent = document.querySelector(".view-content");
  let msgObj = {
    msg: "",
    type: 0, // 0: 加人名  1：发信息 2：删除
    id: ""
  };

  // 如果浏览器有 WS 就执行
  if ("WebSocket" in window) {
    // 与"ws://localhost:4000" 建立连接
    let ws = new WebSocket(`ws://${URL}:${PORT}`);

    //事件open：当连接建立时触发
    ws.onopen = function() {
      console.log("已连接上后端的WSS并发送了昵称");
      msgObj.msg = uName;

      ws.send(JSON.stringify(msgObj));

      oBtn.onclick = function() {
        if (oInput.value != "") {
          msgObj.msg = uName;
          msgObj.type = 1;
          ws.send(JSON.stringify(msgObj));
          oInput.value = "";
        }
      };
    };

    //接受 由 后端发送回来的 数据
    ws.onmessage = function(msg) {
      // console.log(msg);
      let obj = JSON.parse(msg.data);

      //创建DOM
      let node = _createDOM(obj);

      //追加至末尾
      viewContent.appendChild(node);
      viewContent.appendChild(document.createElement("br"));
      viewContent.scrollTop = viewContent.scrollHeight;
    };
  }
};

function _createDOM(obj) {
  let node = document.createElement("div");
  if (obj.isMine) {
    node.className = "msg my-msg";
  } else {
    node.className = "msg other-msg";
  }

  let oText = document.createTextNode(obj.msg);
  node.appendChild(oText);
  return node;
}
