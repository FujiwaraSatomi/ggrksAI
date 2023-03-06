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
  document.querySelector(".main .chat button").addEventListener("click", () => {
    let value = document.querySelector(".main .chat textarea").value.replace(/^\n*(.+)\n*$/, "$1");
    if(value.replace(/\n/g, "") == "") return;
    document.querySelector(".main .chat textarea").value = "";
    document.querySelector(".main .chat textarea").style.height = "24px";
    let div = document.createElement("div");
    div.classList.add("wrap", "question");
    let div2 = document.createElement("div");
    div2.innerText = value;
    div.append(div2);
    let div3 = document.createElement("div");
    div3.classList.add("wrap", "respond");
    let div4 = document.createElement("div");
    div3.append(div4);
    document.querySelector(".main .chat .logs").append(div, div3);
    kuromoji.builder({ dicPath: "./bower_components/kuromoji/dict/" }).build((err, tokenizer) => {
      let path = tokenizer.tokenize(value);
      let pathfilter = path.filter(value => {
        return value.pos == "名詞" && value.surface_form != "何";
      }).map(value => {
        return value.surface_form;
      });
      let firstpath = path.findIndex(value => {
        return value.pos == "名詞";
      });
      let lastpath = path.findLastIndex(value => {
        return value.pos == "名詞" && value.surface_form != "何";
      });
      let contents = path.slice(firstpath, lastpath + 1).map(value => {
        return value.surface_form;
      }).join("");
      console.log(contents);
      console.log(path);
      let responce = "";
      if(!path.length) {
        responce = "申し訳ございませんが、ご質問の意図が理解できませんでした。\n\n「○○の方法について教えて」のように、簡潔にご質問ください。";
      } else {
        responce = `「${contents}」については、以下のサイトが参考になるかと思います。\n\n[${pathfilter.join(" ")}](https://www.google.com/search?q=${pathfilter.join("+")})`;
      }
      let index = 0;
      let id = setInterval(() => {
        if(index > responce.length - 2) {
          clearInterval(id);
          div4.classList.add("res-end");
        }
        div4.innerHTML = responce.slice(0, 1 + index++).replaceAll("<", "&gt;").replaceAll(">", "&lt;").replaceAll("\n", "<br>").replace(/\[(.+)\]\((.+)\)/, "<a href=\"$2\" target=\"_blank\">$1</a>");
      }, 100);
    });  
  })
  document.querySelector(".main .chat textarea").addEventListener("keydown", e => {
    if(e.code == "Enter" && e.ctrlKey) {
      document.querySelector(".main .chat button").dispatchEvent(new Event("click"));
    }
  });
});
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
