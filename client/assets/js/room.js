export default function RoomModule() {
  let mask = document.querySelector(".mask");
  let room = document.querySelector(".room");
  let rightBtn = document.querySelector(".title-bar .right");
  rightBtn.onclick = function() {
    room.className = "room is-show";
    mask.style.display = "block";
  };
  mask.onclick = function() {
    room.className = "room not-show";
    setTimeout(() => {
      room.className = "room";
    }, 400);
    mask.style.display = "none";
  };
}
