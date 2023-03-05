window.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".icon-display .icon").addEventListener("animationend", () => {
    setTimeout(() => {
      document.querySelector(".icon-display").classList.add("progress-show");
    }, 500);
  });
  document.querySelector(".icon-display .progress").addEventListener("animationend", () => {
    setTimeout(() => {
      document.querySelector(".icon-display").classList.add("progress-end");
    }, 500);
  });
  document.querySelector(".icon-display").addEventListener("animationend", e => {
    if(e.animationName != "loaded") return;
    document.querySelector(".icon-display").classList.add("icon-show-end");
  });
  document.querySelector(".main .chat textarea").addEventListener("input", e => {
    e.target.style.height = "24px";
    e.target.style.height = (Math.floor(e.target.scrollHeight / 24) * 24) + "px";
  });
});
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
