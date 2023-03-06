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
    document.querySelector(".main .chat textarea").focus();
    document.querySelector("title").innerText = "新しい会話";
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
    div3.append(div4);
    document.querySelector(".main .chat .logs").append(div, div3);
    document.querySelector(".main .chat textarea").value = "";
    document.querySelector(".main .chat textarea").style.height = "24px";
    kuromoji.builder({ dicPath: "./bower_components/kuromoji/dict/" }).build((err, tokenizer) => {
      let path = tokenizer.tokenize(value);
      let firstpath = path.findIndex(value => {
        return value.pos == "名詞";
      });
      let lastpath = path.findLastIndex(value => {
        return (value.pos == "名詞" || value.pos == "形容詞") && ["ん", "の", "何"].indexOf(value.surface_form) == -1;
      });
      let pathfilter = path.filter((value, index) => {
        return (index >= firstpath && index <= lastpath && ["名詞", "動詞", "副詞", "形容詞"].indexOf(value.pos) != -1 && value.surface_form != "何");
      }).map(value => {
        return value.surface_form;
      });
      let contents = path.slice(firstpath, lastpath + 1).map(value => {
        return value.surface_form;
      }).join("").replace(/\n/g, "");
      console.log(contents);
      console.log(path);
      let responce = "";
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
          "が参考になると思います",
          "が役に立つと思います",
          "が役立つと思います",
          "が役に立つかもしれません",
          "が役立つかもしれません",
        ]
      }
      function rand(max) {
        let temp = Math.floor(Math.random() * (max + 1));
        console.log(temp);
        return temp;
      }
      if(!contents) {
        if(rand(1) == 0) {
          responce += `${rand_list.sorry[rand(1)]}、${rand_list.understand[rand(4)]}。`;
        } else {
          responce += `${rand_list.understand[rand(4)]}、${rand_list.sorry[rand(1)]}。`;
        }
        responce += `\n\n「${rand_list.howto[rand(7)]}」のように、${rand_list.question[rand(3)]}。`;
      } else {
        responce = `「${contents}」${rand_list.about[rand(2)]}、以下の${rand_list.site[rand(2)]}${rand_list.useful[rand(3)]}。\n\n[${pathfilter.join(" ")}](https://www.google.com/search?q=${pathfilter.join("+")})`;
      }
      let index = 0;
      let id = setInterval(() => {
        if(index > responce.length - 2) {
          clearInterval(id);
          div4.classList.add("res-end");
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
});
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
