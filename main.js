window.addEventListener("DOMContentLoaded", () => {
  let logs = [];
  let nowChat = 0;
  function newChat(title) {
    let target = document.createElement("div");
    let span = document.createElement("span");
    span.innerText = (title || "新しい会話");
    target.append(span);
    let remove = document.createElement("div");
    remove.classList.add("delete");
    target.append(remove);
    if(!title) {
      target.setAttribute("data-id", logs.length);
    } else {
      target.setAttribute("data-id", nowChat);
    }
    remove.addEventListener("click", e => {
      console.log(e);
    })
    target.addEventListener("click", e => {
      changeChat(Number(e.currentTarget.getAttribute("data-id")), document.querySelector(".main .chat textarea").value);
    });
    document.querySelector(".main .conversations .logs").append(target);
    if(!title) {
      nowChat = logs.length;
      logs.push({
        title: null,
        input: null,
        logs: [],
        target: target,
      });
    } else {
      logs[nowChat++].target = target;
    }
  }
  function updateTitle(id, title) {
    if(!logs[id]) return;
    logs[id].title = title;
    document.querySelector("title").innerText = title + " | ggrks AI";
    logs[id].target.querySelector("span").innerText = title;
  }
  function logPush(id, raw, respond) {
    logs[id].logs.push({
      raw: raw,
      respond: !!respond,
    });
  }
  function changeChat(id, input) {
    if(!logs[id]) return;
    logs[nowChat].input = input;
    let target = document.querySelector(".main .chat .logs");
    while(target.firstChild) {
      target.firstChild.remove();
    }
    logs[id].logs.forEach(value => {
      let div = document.createElement("div");
      div.classList.add("wrap", (value.respond ? "respond" : "question"));
      let div2 = document.createElement("div");
      if(value.respond) {
        div2.innerHTML = value.raw.replace(/\n/g, "<br>").replace(/\[(.+)\]\((.+)\)/, "<a href=\"$2\" target=\"_blank\">$1</a>");
      } else {
        div2.innerText = value.raw;
      }
      div.append(div2);
      target.append(div);
    });
    document.querySelector(".main .chat textarea").value = logs[id].input || "";
    document.querySelector(".main .chat textarea").focus();
    nowChat = id;
  }
  function clearChat(id) {
    if(!logs[id]) return;
    logs.splice(id, 1);
  }
  function saveChat() {
    logs[nowChat].input = document.querySelector(".main .chat textarea").value;
    localStorage.setItem("raw", JSON.stringify(logs.map(value => {
      return {
        title: value.title,
        input: value.input,
        logs: value.logs,
      }
    })));
  }
  function loadChat() {
    if(!localStorage.getItem("raw")) return;
    logs = JSON.parse(localStorage.getItem("raw"));
    logs.forEach(value => {
      newChat(value.title);
    });
  }
  document.querySelector(".icon-display .icon").addEventListener("animationend", () => {
    setTimeout(() => {
      document.querySelector(".icon-display").classList.add("progress-show");
    }, 500);
  });
  document.querySelector(".icon-display .progress").addEventListener("animationend", () => {
    setTimeout(() => {
      loadChat();
      newChat();
      changeChat(nowChat);
      document.querySelector(".main .chat textarea").focus();
      document.querySelector(".icon-display").classList.add("progress-end");
    }, 500);
  });
  document.querySelector(".icon-display").addEventListener("animationend", e => {
    if(e.animationName != "loaded") return;
    document.querySelector(".icon-display").classList.add("icon-show-end");
    document.querySelector("title").innerText = "新しい会話 | ggrks AI";
  });
  document.querySelector(".main .chat textarea").addEventListener("input", e => {
    e.target.style.height = "24px";
    e.target.style.height = (Math.floor(e.target.scrollHeight / 24) * 24) + "px";
  });
  document.querySelector(".main .chat button").addEventListener("click", () => {
    let value = document.querySelector(".main .chat textarea").value.replace(/^\n*(.+)\n*$/, "$1");
    if(value.replace(/\n/g, "") == "") return;
    let div = document.createElement("div");
    div.classList.add("wrap", "question");
    let div2 = document.createElement("div");
    div2.innerText = value;
    div.append(div2);
    let div3 = document.createElement("div");
    div3.classList.add("wrap", "respond");
    let div4 = document.createElement("div");
    div4.classList.add("responding");
    div3.append(div4);
    document.querySelector(".main .chat .logs").append(div, div3);
    document.querySelector(".main .chat textarea").value = "";
    document.querySelector(".main .chat textarea").style.height = "24px";
    kuromoji.builder({ dicPath: "./bower_components/kuromoji/dict/" }).build((_, tokenizer) => {
      let path = tokenizer.tokenize(value);
      let firstpath = path.findIndex(value => {
        return value.pos == "名詞";
      });
      let lastpath = path.findLastIndex(value => {
        return (value.pos == "名詞" || value.pos == "形容詞") && ["ん", "の", "何"].indexOf(value.surface_form) == -1;
      });
      // let pathfilter = path.filter((value, index) => {
      //   return (index >= firstpath && index <= lastpath && ["名詞", "動詞", "副詞", "形容詞"].indexOf(value.pos) != -1 && value.surface_form != "何");
      // }).map(value => {
      //   return value.surface_form;
      // });
      let contents = path.slice(firstpath, lastpath + 1).map(value => {
        return value.surface_form;
      }).join("").replace(/\n/g, "");
      logPush(nowChat, value, false);
      console.log(path);
      let rand_list = {
        sorry: [
          "申し訳ございません",
          "申し訳ありません",
        ],
        understand: [
          "ご質問の意図が理解できませんでした",
          "ご質問の意図が明確に理解できませんでした",
          "ご質問の意図が分かりませんでした",
          "ご質問の意味が分かりませんでした",
          "ご質問の趣旨が掴めませんでした",
        ],
        howto: [
          "○○の方法",
          "○○の仕方",
          "○○のやり方",
          "○○の作り方",
          "○○の食べ方",
          "○○の遊び方",
          "○○の選び方",
          "○○の買い方",
        ],
        question: [
          "簡潔にご質問ください",
          "簡潔にお尋ねください",
          "要点をまとめてご質問ください",
          "要点をまとめてお尋ねください",
        ],
        about: [
          "については",
          "につきましては",
          "においては",
          "に関しては",
        ],
        site: [
          "ウェブサイト",
          "サイト",
          "ページ",
          "リンク",
        ],
        useful: [
          "が参考になると思います",
          "が有用だと思います",
          "が役に立つと思います",
          "が役立つと思います",
          "が役に立つかもしれません",
          "が役立つかもしれません",
        ]
      }
      function rand(max) {
        let temp = Math.floor(Math.random() * (max + 1));
        return temp;
      }
      let responce = "", responce_type = true;
      if(!contents || contents.match(/^\w+$/)) {
        responce_type = false;
        if(rand(1) == 0) {
          responce += `${rand_list.sorry[rand(1)]}、${rand_list.understand[rand(4)]}。`;
        } else {
          responce += `${rand_list.understand[rand(4)]}、${rand_list.sorry[rand(1)]}。`;
        }
        responce += `\n\n「${rand_list.howto[rand(7)]}」のように、${rand_list.question[rand(3)]}。`;
      } else {
        responce = `「${contents}」${rand_list.about[rand(2)]}、以下の${rand_list.site[rand(3)]}${rand_list.useful[rand(5)]}。\n\n[${contents}](https://www.google.com/search?q=${contents.replaceAll(" ", "+")})`;
      }
      logPush(nowChat, responce, true);
      saveChat();
      let index = 0;
      let id = setInterval(() => {
        if(index > responce.length + 10) {
          clearInterval(id);
          if(responce_type) {
            updateTitle(nowChat, contents);
          }
          console.log(logs);
          div4.classList.remove("responding");
        }
        if(index > responce.length - 1) {
          index++;
          return;
        }
        div4.innerHTML = responce.slice(0, 1 + index++).replaceAll("<", "&gt;").replaceAll(">", "&lt;").replaceAll("\n", "<br>").replace(/\[(.+)\]\((.+)\)/, "<a href=\"$2\" target=\"_blank\">$1</a>");
      }, 90);
    });  
  })
  document.querySelector(".main .chat textarea").addEventListener("keydown", e => {
    if(e.code == "Enter" && e.keyCode == 13 && !e.shiftKey) {
      document.querySelector(".main .chat button").dispatchEvent(new Event("click"));
      e.preventDefault();
    }
  });
  document.querySelector(".main .conversations .new-chat").addEventListener("click", () => {
    newChat();
    changeChat(nowChat, document.querySelector(".main .chat textarea").value);
  });
});
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
