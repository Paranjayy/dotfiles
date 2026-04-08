function setupEmojiWidget(uuid) {
  json = window.widgetConfig[uuid];

  const widgetContainer = document.getElementById(uuid);
  if (!widgetContainer) {
    console.error("emoji widget container not available");
    return;
  }
  const emojiContainer = document.createElement("div");
  emojiContainer.style.display = "flex";
  emojiContainer.style.flexDirection = "row";
  emojiContainer.style.paddingRight = "300px";

  loadNext100Emoji(uuid, emojiContainer, 0);

  widgetContainer.appendChild(emojiContainer);
}

function loadNext100Emoji(uuid, emojiContainer, index) {
  console.log('load next emoji', index);
  let observer = new IntersectionObserver(
    (entries, observer) => {
      console.log('looking at', entries);
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadNext100Emoji(
            uuid,
            entry.target.parentElement,
            +entry.target.getAttribute("data-index")
          );
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0 }
  );

  const allEmojis = window.widgetAdditionalData[uuid];
  const config = window.widgetConfig[uuid];

  for (let i = index; i < index + 100 && i < allEmojis.length; i++) {
    const emoji = allEmojis[i];
    const emojiDiv = document.createElement("div");
    emojiDiv.innerHTML = emoji;
    emojiDiv.className = "button";
    emojiDiv.onclick = () => {
      callBTT("call_widget_function", {
        BTTWidgetUUID: uuid,
        BTTWidgetFunctionParam1: emoji,
        BTTWidgetFunction: "insertSmiley:",
      });
    };
    console.log("adding default variables");
    addDefaultVariablesToElement(emojiDiv, config, false);

    emojiContainer.appendChild(emojiDiv);
    if (i === index + 50) {
      console.log('emoji', i, allEmojis[i]);
      emojiDiv.setAttribute("data-index", `${index + 100}`);
      observer.observe(emojiDiv,);
      break;
    }
  }
}
