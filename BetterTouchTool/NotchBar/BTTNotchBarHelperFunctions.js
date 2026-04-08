/*
 * By default this file will be overridden with every BetterTouchTool update.
 * If you make changes to this file, BTT will not update the file, however
 * features might not work correctly anymore.
 *
 * If possible only override the BTTNochBarUser.css and BTTNotchBarUser.js.
 *
 * If you absolutely need to make changes to this file, make sure to integrate the
 * changes from /Applications/BetterTouchTool.app/Contents/Resources/NotchBar/
 */

/*
 * The function in this file are mostly little helper functions or functions used internally by BTT.
 * You should not need to modify them.
 */

function removeAllChildrenForElement(element) {
  var range = document.createRange();
  range.selectNodeContents(element);
  range.deleteContents();
}

function removeElementWithID(elementID) {
  console.log("remove element", elementID);
  let elem = document.getElementById(elementID);
  if (elem) {
    elem.parentElement.removeChild(elem);
  }
}

function removeClassFromAllElements(className) {
  console.log("remove class", className);
  const menubarButtons = document.getElementsByClassName(className);

  for (const button of menubarButtons) {
    button.classList.remove(className);
  }
}

function addClassToElements(className, elements) {
  console.log("add class", className, elements);
  for (const element of elements) {
    if (document.getElementById(element)) {
      document.getElementById(element).classList.add(className);
    }
  }
}

function removeClassFromElements(className, elements) {
  console.log("remove class", className, elements);
  for (const element of elements) {
    if (
      document.getElementById(element) &&
      document.getElementById(element).classList
    ) {
      document.getElementById(element).classList.remove(className);
    }
  }
}

/*
 * This removes all user customizable widgets apart from those that are always visible
 */
function removeNonGroupItems() {
  document
    .querySelectorAll(".needs-reset-on-update")
    .forEach((e) => e.remove());

  if (window.repeatActionInterval) {
    clearInterval(window.repeatActionInterval);
  }
}

/*
 * This removes all user customizable widgets from the NotchBar
 */
function resetNotchBar() {
  console.log("reset notchbar");

  document
    .querySelectorAll(".needs-reset-on-update")
    .forEach((e) => e.remove());

  document
    .querySelectorAll(".needs-reset-on-update-group")
    .forEach((e) => e.remove());

  if (window.repeatActionInterval) {
    clearInterval(window.repeatActionInterval);
  }
}

/*
 * This function is used to generate the menubar in BTT.
 */
function updateMenubar(menubarArray) {
  console.log("update menubar", menubarArray);

  const menubarElement = document.getElementById("BTTNotchMenuBar");
  if(menubarElement.classList.contains("menubar-disabled")) {
    menubarElement.style.setProperty(
      "--container-possible-insert-x",
      `0 px`
    );

    const notchBarContainer = document.getElementById("BTTNotchBarContainer");
    notchBarContainer.style.setProperty(
      "--menubar-area-size",
      `0 px`
    );
    return;
  }
  const elements = document.getElementsByClassName("menubar-button");
  while (elements.length > 0) elements[0].remove();

  let i = 0;
  for (let item of menubarArray) {
    let menubarBtnDiv = document.createElement("div");
    menubarBtnDiv.className = "menubar-button";
    menubarBtnDiv.style.position = "absolute";
    menubarBtnDiv.style.left = item.x;
    menubarBtnDiv.style.width = (i === 0 ? "40" : item.width) + "px";
    menubarBtnDiv.style.fontWeight = i === 1 ? "bold" : "unset";
    menubarBtnDiv.onmousedown = () => {
      callBTT("click_menu_item", {});
    };
    menubarBtnDiv.innerText = item.title;
    menubarElement.appendChild(menubarBtnDiv);

    menubarElement.setAttribute("data-menubar-width", item.x + item.width);

    menubarElement.style.setProperty(
      "--container-possible-insert-x",
      `${item.x + item.width}px`
    );
    
    const notchBarContainer = document.getElementById("BTTNotchBarContainer");
    notchBarContainer.style.setProperty(
      "--menubar-area-size",
      `${item.x + item.width}px`
    );
    i++;
  }
}

function addVisibilityInfoToElement(jsonDescription, btn) {

  const notchScreenVisibility = jsonDescription.BTTNotchBarVisibilityNotchScreen;
  const standardScreenVisibility = jsonDescription.BTTNotchBarVisibilityStandardScreen;

  if(window.BTTNotchBarIsOnStandardScreen === false || window.BTTNotchBarIsOnStandardScreen === 0) {
    if(notchScreenVisibility === -1) {
      btn.classList.add("mode-hidden");
    } else if(notchScreenVisibility === 0) {
      btn.classList.add("mode-any");
    } else if(notchScreenVisibility === 1) {
      btn.classList.add("mode-widget");
    }else if(notchScreenVisibility === 2) {
      btn.classList.add("mode-menubar");
    } else {
      btn.classList.add("mode-any");
    }
  } else {
    if(standardScreenVisibility === -1) {
      btn.classList.add("mode-hidden");
    } else if(standardScreenVisibility === 0) {
      btn.classList.add("mode-any");
    } else if(standardScreenVisibility === 1) {
      btn.classList.add("mode-widget");
    }else if(standardScreenVisibility === 2) {
      btn.classList.add("mode-menubar");
    } else {
      btn.classList.add("mode-any");
    }
  }


}


/*
 * This function is called by BTT to add placeholder containers.
 */
function addOrUpdatePlaceholder(jsonDescription, elementID, order) {
  console.log("add or update placeholder", jsonDescription, elementID, order);

  const containerID = getPlacementContainer(jsonDescription);

  let btn = document.getElementById(elementID);
  if (!btn) {
    btn = document.createElement("div");
    btn.id = elementID;
    btn.setAttribute("data-use-child-for-highlight", true);
    btn.className = "placeholder-container";

    addVisibilityInfoToElement(jsonDescription, btn);
    
    if (jsonDescription.BTTMergeIntoTouchBarGroups) {
      btn.classList.add("needs-reset-on-update-group");
    } else {
      btn.classList.add("needs-reset-on-update");
    }

    console.log("add placeholder", jsonDescription, elementID, order);
  }
  const userStyles = jsonDescription.BTTNotchBarCSSStyles;
  const userClass = jsonDescription.BTTNotchBarCSSClass;
  if (userStyles && userStyles.length > 0) {
    btn.style.cssText += ";" + userStyles;
  }

  if (userClass && userClass.length > 0) {
    btn.classList.add(userClass);
  }

  if (jsonDescription.BTTTouchBarItemIconHeight) {
    btn.style.setProperty(
      "--notchbar-statusbar-icon-height",
      `${jsonDescription.BTTTouchBarItemIconHeight}px`
    );
  }
  btn.setAttribute("data-order", order);

  const containerElement = document.getElementById(containerID);
  if (containerElement) {
    containerElement.appendChild(btn);

    let children = Array.prototype.slice.call(containerElement.children, 0);

    children.sort(function (a, b) {
      var aord = +a.getAttribute("data-order");
      var bord = +b.getAttribute("data-order");
      return aord - bord;
    });

    removeAllChildrenForElement(containerElement);

    for (var i = 0, l = children.length; i < l; i++) {
      containerElement.appendChild(children[i]);
    }
  } else {
    console.error("container element does not exist", containerID);
  }
}

function triggerAssignedActions(element) {
  var closestElement = element.closest(".notchbar-html-widget");
  if (closestElement && closestElement.id) {
    callBTT("execute_assigned_actions_for_trigger", {
      uuid: closestElement.id,
    });
  }
}

function highlightElementAt(x, y) {
  let newMouseOverElements = document.elementsFromPoint(x, y);
  if (newMouseOverElements.length > 0) {
    for (let i = 0; i < newMouseOverElements.length; i++) {
      let elI = newMouseOverElements[i];

      if (elI && elI.getAttribute("data-use-for-highlight")) {
        newMouseOverElement = newMouseOverElements[i];
        break;
      } else if (elI && elI.id && elI.id.startsWith("BTTNotch")) {
        newMouseOverElement = newMouseOverElements[i > 0 ? i - 1 : i];
        break;
      }
    }
    if (!newMouseOverElement) {
      newMouseOverElement = newMouseOverElements[0];
    }
  }
  if (
    newMouseOverElement !== window.elementMouseIsOver ||
    (window.elementMouseIsOver &&
      window.elementMouseIsOver.classList &&
      !window.elementMouseIsOver.classList.contains("manualhover"))
  ) {
    if (window.elementMouseIsOver) {
      window.elementMouseIsOver.classList.remove("manualhover");
    }

    if (newMouseOverElement.getAttribute("data-on-highlight")) {
      console.log("triggering on hover function");
      eval(newMouseOverElement.getAttribute("data-on-highlight"));
    }

    if (newMouseOverElement) {
      newMouseOverElement.classList.add("manualhover");
      window.elementMouseIsOver = newMouseOverElement;
    }
  }
}

function addDefaultVariablesToElement(
  element,
  jsonDescription,
  includeImage = false
) {
  let btn = element;
  if (jsonDescription.BTTMergeIntoTouchBarGroups) {
    btn.classList.add("needs-reset-on-update-group");
  } else {
    btn.classList.add("needs-reset-on-update");
  }

  btn.setAttribute("data-use-for-highlight", "true");

  if (jsonDescription.BTTTouchBarButtonColor != undefined) {
    btn.style.setProperty(
      "--notchbar-standard-button-background",
      convertBTTRGBAToCSSRGBA(jsonDescription.BTTTouchBarButtonColor)
    );
  }

  if (jsonDescription.BTTTouchBarButtonHoverColor !== undefined) {
    btn.style.setProperty(
      "--notchbar-standard-button-hover-background",
      convertBTTRGBAToCSSRGBA(jsonDescription.BTTTouchBarButtonHoverColor)
    );
  }

  if (jsonDescription.BTTTouchBarButtonFontSize !== undefined) {
    btn.style.setProperty(
      "--notchbar-standard-button-font-size",
      `${jsonDescription.BTTTouchBarButtonFontSize}px`
    );
  }

  if (
    jsonDescription.BTTTouchBarButtonUseFixedWidth === 1 ||
    jsonDescription.BTTTouchBarButtonUseFixedWidth === true
  ) {
    if (jsonDescription.BTTTouchBarButtonWidth !== undefined) {
      btn.style.setProperty(
        "--notchbar-standard-button-fixed-width",
        `${jsonDescription.BTTTouchBarButtonWidth}px`
      );
    }
  }

  if (
    jsonDescription.BTTTouchBarButtonUseFixedHeight === 1 ||
    jsonDescription.BTTTouchBarButtonUseFixedHeight === true
  ) {
    if (jsonDescription.BTTTouchBarButtonHeight !== undefined) {
      btn.style.setProperty(
        "--notchbar-standard-button-fixed-height",
        `${jsonDescription.BTTTouchBarButtonHeight}px`
      );
    }
  }

  if (jsonDescription.BTTTouchBarButtonBorderColor !== undefined) {
    btn.style.setProperty(
      "--notchbar-standard-button-border-color",
      `${jsonDescription.BTTTouchBarButtonBorderColor}px`
    );
  }

  if (jsonDescription.BTTTouchBarButtonFontSize !== undefined) {
    btn.style.setProperty(
      "--notchbar-standard-button-font-size-line1",
      `${jsonDescription.BTTTouchBarButtonFontSize}px`
    );
  }

  if (jsonDescription.BTTTouchBarButtonFontSizeLine2 !== undefined) {
    btn.style.setProperty(
      "--notchbar-standard-button-font-size-line2",
      `${jsonDescription.BTTTouchBarButtonFontSizeLine2}px`
    );
  }

  if (jsonDescription.BTTTouchBarApplyCornerRadiusTo !== undefined) {
    console.log(
      "corner radius",
      jsonDescription.BTTTouchBarApplyCornerRadiusTo
    );
    switch (jsonDescription.BTTTouchBarApplyCornerRadiusTo) {
      case -1:
      case 0:
        btn.style.setProperty(
          "--notchbar-standard-button-border-radius",
          `${jsonDescription.BTTTouchBarButtonCornerRadius}px`
        );

        break;
      case 1:
        btn.style.setProperty(
          "--notchbar-standard-button-border-top-left-radius",
          `${jsonDescription.BTTTouchBarButtonCornerRadius}px`
        );

        btn.style.setProperty(
          "--notchbar-standard-button-border-bottom-left-radius",
          `${jsonDescription.BTTTouchBarButtonCornerRadius}px`
        );

        btn.style.setProperty(
          "--notchbar-standard-button-border-top-right-radius",
          `0px`
        );

        btn.style.setProperty(
          "--notchbar-standard-button-border-bottom-right-radius",
          `0px`
        );
        break;
      case 2:
        btn.style.setProperty(
          "--notchbar-standard-button-border-top-left-radius",
          `0px`
        );

        btn.style.setProperty(
          "--notchbar-standard-button-border-bottom-left-radius",
          `0px`
        );

        btn.style.setProperty(
          "--notchbar-standard-button-border-top-right-radius",
          `${jsonDescription.BTTTouchBarButtonCornerRadius}px`
        );

        btn.style.setProperty(
          "--notchbar-standard-button-border-bottom-right-radius",
          `${jsonDescription.BTTTouchBarButtonCornerRadius}px`
        );

        break;
    }
  } else {
    if (jsonDescription.BTTTouchBarButtonCornerRadius !== undefined) {
      btn.style.setProperty(
        "--notchbar-standard-button-border-radius",
        `${jsonDescription.BTTTouchBarButtonCornerRadius}px`
      );
    }
  }

  if (
    jsonDescription.BTTTouchBarItemPadding !== undefined &&
    jsonDescription.BTTTouchBarItemPadding !== 0
  ) {
    btn.style.setProperty(
      "--notchbar-standard-button-padding-left-and-right",
      `${jsonDescription.BTTTouchBarItemPadding}px`
    );
  }

  if (jsonDescription.BTTTouchBarItemPaddingTopBottom !== undefined) {
    btn.style.setProperty(
      "--notchbar-standard-button-padding-top-and-bottom",
      `${jsonDescription.BTTTouchBarItemPaddingTopBottom}px`
    );
  }
  if (
    element &&
    element.parentElement &&
    element.parentElement.id === "BTTNotchMenuBar" &&
    (!btn.previousSibling ||
      (btn.previousSibling &&
        btn.previousSibling.classList.contains("menubar-button")))
  ) {
    if (jsonDescription.BTTTouchBarFreeSpaceBeforeButton !== undefined) {
      btn.style.setProperty(
        "--notchbar-standard-button-margin-left",
        `calc(${jsonDescription.BTTTouchBarFreeSpaceBeforeButton}px + var(--container-possible-insert-x))`
      );
    }
  } else {
    if (jsonDescription.BTTTouchBarFreeSpaceBeforeButton !== undefined) {
      btn.style.setProperty(
        "--notchbar-standard-button-margin-left",
        `${jsonDescription.BTTTouchBarFreeSpaceBeforeButton}px`
      );
    }
  }

  if (jsonDescription.BTTTouchBarFreeSpaceAfterButton !== undefined) {
    btn.style.setProperty(
      "--notchbar-standard-button-margin-right",
      `${jsonDescription.BTTTouchBarFreeSpaceAfterButton}px`
    );
  }

  if (jsonDescription.BTTTouchBarFontFamily !== undefined) {
    btn.style.setProperty(
      "--notchbar-standard-button-font-family",
      `${jsonDescription.BTTTouchBarFontFamily}`
    );
  }

  if (jsonDescription.BTTTouchBarFontColor !== undefined) {
    btn.style.setProperty(
      "--notchbar-standard-button-color",
      convertBTTRGBAToCSSRGBA(jsonDescription.BTTTouchBarFontColor)
    );
  }

  if (jsonDescription.BTTTouchBarBorderColor) {
    btn.style.setProperty(
      "--notchbar-standard-button-border-color",
      convertBTTRGBAToCSSRGBA(jsonDescription.BTTTouchBarBorderColor)
    );
  }

  if (jsonDescription.BTTIconData && jsonDescription.BTTIconData.length > 0) {
    if (includeImage === true) {
      btn.style.setProperty(
        "--notchbar-standard-button-icon",
        `url(data:image/png;base64,${jsonDescription.BTTIconData})`
      );
    }

    if (jsonDescription.BTTTouchBarItemIconWidth) {
      btn.style.setProperty(
        "--notchbar-standard-button-icon-width",
        `${jsonDescription.BTTTouchBarItemIconWidth}px`
      );
    }
    if (jsonDescription.BTTTouchBarItemIconHeight) {
      btn.style.setProperty(
        "--notchbar-standard-button-icon-height",
        `${jsonDescription.BTTTouchBarItemIconHeight}px`
      );
    }

    if (jsonDescription.BTTTouchBarIconInvert) {
      btn.style.setProperty(
        "--notchbar-standard-button-icon-invert",
        jsonDescription.BTTTouchBarIconInvert === 1 ||
          jsonDescription.BTTTouchBarIconInvert === true
          ? "invert(100%)"
          : "invert(0%)"
      );
    }
  }
}

function convertBTTRGBAToCSSRGBA(bttRGBA) {
  const colors = bttRGBA.split(",");
  const color = `rgba(${parseFloat(colors[0]).toFixed(0)},${parseFloat(
    colors[1]
  ).toFixed(0)},${parseFloat(colors[2]).toFixed(0)},${(
    parseFloat(colors[3]) / 255
  ).toFixed(2)})`;

  return color;
}

function updateDisplayValueForButtonElement(
  element,
  value,
  imageBase64,
  json,
  invert
) {
  if (!element) {
    return;
  }

  if (typeof json === "string") {
    json = JSON.parse(json);
  }
  let onlyShowIcon =
    json &&
    (json.BTTTouchBarOnlyShowIcon === 1 ||
      json.BTTTouchBarOnlyShowIcon === true);

  let btnTextContainer = element.querySelector(".btn-text-container");
  if (!btnTextContainer) {
    btnTextContainer = document.createElement("span");
    btnTextContainer.className = "btn-text-container";
    element.appendChild(btnTextContainer);
  }

  let img = element.querySelector(".btn-img");
  if (imageBase64 && imageBase64.length > 0) {
    if (!img) {
      img = document.createElement("img");

      img.className = "btn-img";

      element.insertBefore(img, element.firstChild);
    }
    if (json) {
      img.style.width = `${json.BTTTouchBarItemIconWidth}px`;
      img.style.height = `${json.BTTTouchBarItemIconHeight}px`;
    }
    img.src = `data:image/png;base64,${imageBase64}`;
    img.alt = value;
    if (invert === 1 || invert === true) {
      img.style.filter = "invert(100%)";
    } else {
      if (
        json &&
        (json.BTTTouchBarIconInvert === 1 ||
          json.BTTTouchBarIconInvert === true)
      ) {
        img.style.filter = "invert(100%)";
      } else {
        img.style.filter = "invert(0%)";
      }
    }
  }
  if (!value) {
    value = "";
  }
  let lines = value.split("\n");
  if (lines.length > 0) {
    let line1 = element.querySelector(".btn-line1");
    if (!line1) {
      line1 = document.createElement("span");
      line1.className = "btn-line1";
      btnTextContainer.appendChild(line1);
    }

    if (onlyShowIcon === undefined) {
      line1.innerText = lines[0];
    } else if (onlyShowIcon !== true) {
      if (img) {
        img.style.marginRight = "4px";
      }

      line1.innerText = lines[0];
    } else {
      if (img) {
        img.style.marginRight = "0px";
      }
      line1.innerText = "";
    }
  }
  if (lines.length > 1) {
    let line2 = element.querySelector(".btn-line2");
    if (!line2) {
      line2 = document.createElement("span");
      line2.className = "btn-line2";
      btnTextContainer.appendChild(line2);
    }

    if (onlyShowIcon === undefined) {
      line2.innerText = lines[1];
    } else if (onlyShowIcon !== true) {
      line2.innerText = lines[1];
    } else {
      line2.innerText = "";
    }
  }
}

async function retrieveSFFontIconWithName(sfSymbolName) {
  if (!window.sfSymbols) {
    window.sfSymbols = {};
  }
  if (window.sfSymbols[sfSymbolName]) {
    return window.sfSymbols[sfSymbolName];
  }

  let icon = await callBTT("retrieve_sf_symbol", { name: sfSymbolName });
  if (icon) {
    window.sfSymbols[sfSymbolName] = icon;
  }
  return icon;
}

function decodeBase64(base64) {
  if (!base64) {
    return undefined;
  }

  try {
    const text = atob(base64);
    const length = text.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = text.charCodeAt(i);
    }
    const decoder = new TextDecoder(); // default is utf-8
    return decoder.decode(bytes);
  } catch (e) {
    console.error("e", e);
  }
}

function setVariableForElement(variable, value, elementID) {
  let elem = document.getElementById(elementID);
  if (elem) {
    elem.style.setProperty(variable, value);
  }
}

// this retrieves the placement container ID for the BTT internal container ID
function getPlacementContainer(json) {
  let containerID = "BTTNotchBarFixedLeft";
  if (json.BTTTouchBarItemPlacement === 0) {
    //left
    containerID = "BTTNotchBarScrollableLeftOfNotch";
  } else if (json.BTTTouchBarItemPlacement === 1) {
    containerID = "BTTNotchBarFixedLeft";
  } else if (json.BTTTouchBarItemPlacement === 2) {
    //right
    containerID = "BTTNotchBarFixedRight";
  } else if (json.BTTTouchBarItemPlacement === 3) {
    //right
    containerID = "BTTNotchBarScrollableRightOfNotch";
  } else if (json.BTTTouchBarItemPlacement === 4) {
    // mini menubar
    containerID = "BTTNotchMenuBar";
  } else if (json.BTTTouchBarItemPlacement === 5) {
    // mini status bar
    containerID = "BTTNotchStatusBar";
  } else if (json.BTTTouchBarItemPlacement === 6) {
    //right
    containerID = json.BTTNotchBarContainerID;
  }

  return containerID;
}
