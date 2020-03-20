const URL = "192.168.0.105"; /* 换上自己机子的内网IP */
const PORT = "4000";
let ws = null;
let uName = null;
let nameReg = /^([\u4e00-\u9fa5]|\w){2,6}$/; // 2-6个字符或汉字

do {
  // uName = prompt("请输入您的昵称 (2-6个字母，下划线，数字或汉字)");
  uName = "彭尼玛";
} while (uName == "" || !nameReg.test(uName));

if (uName != null) {
  window.onload = function() {
    /*
     * 获取各个元素
     */
    let sendContent = document.querySelector(".send-content");
    let mainBody = document.querySelector(".main-body");
    let oBtn = document.querySelector(".user-send");
    let oInput = document.querySelector(".user-input");
    let viewContent = document.querySelector(".view-content");
    let msgObj = {
      msg: "",
      type: 1, //1：发信息 2：删除(根据id)
      id: null,
      uName
    };

    // 如果浏览器有 WS 就执行
    if ("WebSocket" in window) {
      // 与"ws://localhost:4000" 建立连接
      ws = new WebSocket(`ws://${URL}:${PORT}`);

      //事件open：当连接建立时触发
      ws.onopen = function() {
        console.log("已连接上后端的WSS并发送了昵称");

        //先让后端加名
        ws.send(JSON.stringify({ name: uName, type: 0 }));

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

        //监听按钮点击 以及 输入框的回车
        oInput.onkeydown = function(event) {
          let e = event || window.event;
          if (e && e.keyCode == 13) {
            sendMsg(msgObj, oInput, ws);
          }
        };
        oBtn.onclick = function() {
          sendMsg(msgObj, oInput, ws);
        };
      };

      //接受 由 后端发送回来的 数据
      ws.onmessage = function(msgObj_back) {
        // console.log(msgObj_back);
        let mbd = JSON.parse(msgObj_back.data);
        switch (mbd.type) {
          case 0:
            //后端给前端加 id
            msgObj.id = mbd.id;
            break;

          case 1:
            //创建DOM
            let node = _createDOM(mbd, msgObj.id);

            //追加至末尾
            viewContent.appendChild(node);
            viewContent.scrollTop = viewContent.scrollHeight;
          default:
            break;
        }
      };

      window.onbeforeunload = function() {
        msgObj.type = 2;
        ws.send(JSON.stringify(msgObj));
      };
    }
  };
}

//创建发送消息的DOM
function _createDOM(obj, id) {
  let node = document.createElement("div");
  if (obj.id == id) {
    node.className = "msg my-msg";
  } else {
    node.className = "msg other-msg";
  }
  node.setAttribute("uname", obj.name.substring(0, 1));

  let oText = document.createTextNode(obj.msg);
  node.appendChild(oText);
  return node;
}

//发送消息
function sendMsg(obj, input, _ws) {
  if (input.value != "") {
    obj.msg = input.value;
    obj.type = 1;
    _ws.send(JSON.stringify(obj));
    input.value = "";
  }
}
