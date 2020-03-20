export default function WebSocketFunc(URL, PORT, ws, uName, msgObj) {
  let oBtn = document.querySelector(".user-send");
  let oInput = document.querySelector(".user-input");
  let viewContent = document.querySelector(".view-content");
  // 与"ws://localhost:4000" 建立连接
  ws = new WebSocket(`ws://${URL}:${PORT}`);

  //事件open：当连接建立时触发
  ws.onopen = function() {
    console.log("已连接上后端的WSS并发送了昵称");

    //先让后端加名
    ws.send(JSON.stringify({ name: uName, type: 0 }));

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
          //创建信息DOM
          let node = _createDOM(mbd, msgObj.id);

          //追加至末尾
          viewContent.appendChild(node);
          viewContent.scrollTop = viewContent.scrollHeight;
          break;
        case 2:
          //创建聊天室人员DOM
          console.log(mbd.names);
          let roomItem = document.querySelector(".room-item");
          let barCenter = document.querySelector(".title-bar .center");
          //创建 加入小tips
          _createDOM_normal(
            viewContent,
            mbd.truename + " ->加入聊天室",
            "tips"
          );

          //创建聊天室人名
          roomItem.innerHTML = "";
          barCenter.innerText = `聊天室 (${mbd.names.length} 人)`;
          mbd.names.forEach(item => {
            _createDOM_normal(roomItem, item);
          });
          break;
        default:
          break;
      }
    };
    /**
     * 监听按钮点击 以及 输入框的回车 ===========================*/
    oInput.onkeydown = function(event) {
      let e = event || window.event;
      if (e && e.keyCode == 13) {
        sendMsg(msgObj, oInput, ws);
        oBtn.className = "user-send delivered";
        setTimeout(() => {
          oBtn.className = "user-send";
        }, 500);
      }
    };
    oBtn.onclick = function() {
      sendMsg(msgObj, oInput, ws);
      oBtn.className = "user-send delivered";
      setTimeout(() => {
        oBtn.className = "user-send";
      }, 500);
    };
    /**
     * =========================================================*/

    window.onbeforeunload = function() {
      msgObj.type = 2;
      ws.send(JSON.stringify(msgObj));
    };
  };

  /**
   * 其他函数 */
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
  function _createDOM_normal(obj, msg, cn = "") {
    let pNode = document.createElement("p");
    let txtNode = document.createTextNode(msg);
    pNode.appendChild(txtNode);
    if (cn != "") {
      pNode.className = cn;
    }
    obj.appendChild(pNode);
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
}
