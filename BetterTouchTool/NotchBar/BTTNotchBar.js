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

function BTTInitialize() {
  window.isInitialized = true;
}

const BTTNotchBarVisibility = {
  Hidden: -1,
  AlwaysVisible: 0,
  OnlyInWidgetMode: 1,
  OnlyInMenubarMode: 2,
};

const widgetTypes = {
  BTTGestureNotchBarButton: 696,
  BTTGestureNotchBarGroup: 697,
  BTTGestureNotchBarPlugin: 698,
  BTTGestureNotchBarStatusItemsWidget: 699,
  BTTGestureNotchBarCustomHTMLWidget: 700,
  BTTGestureNotchBarDateTimeWidget: 701,
  BTTGestureNotchBarWeatherWidget: 702,
  BTTGestureNotchBarRunAppleScriptWidget: 703,
  BTTGestureNotchBarNowPlayingWidget: 704,
  BTTGestureNotchBarEmojiWidget: 708,
  BTTGestureNotchBarBrightnessScrollerWidget: 709,
  BTTGestureNotchBarVolumeScrollerWidget: 710,
  BTTGestureNotchBarNextEventsWidget: 711,
  BTTGestureNotchBarShortcutsWidget: 712,
  BTTGestureNotchBarShellScriptWidget: 713,
  BTTGestureNotchBarWidgetAppleShortcut: 714,
  BTTGestureNotchBarWidgetClipboard: 715,
  BTTGestureNotchBarMenuItemsWidget: 741,
  BTTGestureNotchBarMiniMenuItemsWidget: 742,
  BTTGestureNotchBarOriginalStatusItems: 743,
};

// this keeps the identifiers of initialized widgets
window.initializedHTMLWidgets = {};
window.initializedCustomWidgets = {};
window.widgetCache = {};
window.widgetConfig = {};
window.widgetAdditionalData = {};
window.longPressed = false;
window.scrollCount = 0;

// this lists all the available configuration options
window.notchBarConfig = {
  BTTNotchBarBackgroundImage: "",

  BTTNotchBarSwitchModesByScrolling: false,

  // is this a standard or a notch bar screen?
  BTTNotchBarIsOnStandardScreen: false,

  BTTNotchBarStandardMenubarAlwaysShowMenubar: false,
};

function longPress(e) {
  window.longPressed = true;
  console.log("long press 1", e);
  const triggerName = e.target.getAttribute("data-long-press-action");
  if (triggerName && window.isInitialized) {
    callBTT("trigger_named_async_without_response", {
      trigger_name: triggerName,
    });
    return;
  }

  console.log("long press 2", e);
  const constWidgetUUID = e.target.getAttribute("data-widget-uuid");
  const widgetFunctionToCall = e.target.getAttribute(
    "data-long-press-function"
  );
  const widgetParam1 = e.target.getAttribute("data-long-press-param1");
  const widgetParam2 = e.target.getAttribute("data-long-press-param2");

  callBTT("call_widget_function", {
    BTTWidgetUUID: constWidgetUUID,
    BTTWidgetFunctionParam1: widgetParam1,
    BTTWidgetFunctionParam2: widgetParam2,

    BTTWidgetFunction: widgetFunctionToCall,
  });
}

function setupStandardWidgets(config) {
  //TODO: BTTShowStandardMenubar and BTTShowMiniMenubar are now using visibility parameters
  console.log("config", config);
  window.notchBarConfig.BTTShowStandardMenuBar = config.BTTShowStandardMenuBar;
  window.notchBarConfig.BTTShowMiniMenuBar = config.BTTShowMiniMenuBar;

  if (window.menubarOnlyMode === true) {
    if (
      window.notchBarConfig.BTTShowStandardMenuBar ==
      BTTNotchBarVisibility.Hidden
    ) {
      addClassToElements("menubar-disabled-menubarmode", ["BTTNotchMenuBar"]);
    } else if (
      window.notchBarConfig.BTTShowStandardMenuBar ==
      BTTNotchBarVisibility.AlwaysVisible
    ) {
      removeClassFromElements("menubar-disabled-menubarmode", [
        "BTTNotchMenuBar",
      ]);
    } else if (
      window.notchBarConfig.BTTShowStandardMenuBar ==
      BTTNotchBarVisibility.OnlyInWidgetMode
    ) {
      addClassToElements("menubar-disabled-menubarmode", ["BTTNotchMenuBar"]);
    } else if (
      window.notchBarConfig.BTTShowStandardMenuBar ==
      BTTNotchBarVisibility.OnlyInMenubarMode
    ) {
      removeClassFromElements("menubar-disabled-menubarmode", [
        "BTTNotchMenuBar",
      ]);
    }

    if (
      window.notchBarConfig.BTTShowMiniMenuBar == BTTNotchBarVisibility.Hidden
    ) {
      addClassToElements("menubar-disabled-widgetmode", ["BTTNotchMenuBar"]);
    } else if (
      window.notchBarConfig.BTTShowMiniMenuBar ==
      BTTNotchBarVisibility.AlwaysVisible
    ) {
      removeClassFromElements("menubar-disabled-widgetmode", [
        "BTTNotchMenuBar",
      ]);
    } else if (
      window.notchBarConfig.BTTShowMiniMenuBar ==
      BTTNotchBarVisibility.OnlyInWidgetMode
    ) {
      addClassToElements("menubar-disabled-widgetmode", ["BTTNotchMenuBar"]);
    } else if (
      window.notchBarConfig.BTTShowMiniMenuBar ==
      BTTNotchBarVisibility.OnlyInMenubarMode
    ) {
      removeClassFromElements("menubar-disabled-widgetmode", [
        "BTTNotchMenuBar",
      ]);
    }
  } else {
    // widget mode

    if (
      window.notchBarConfig.BTTShowStandardMenuBar ==
      BTTNotchBarVisibility.Hidden
    ) {
      addClassToElements("menubar-disabled-menubarmode", ["BTTNotchMenuBar"]);
    } else if (
      window.notchBarConfig.BTTShowStandardMenuBar ==
      BTTNotchBarVisibility.AlwaysVisible
    ) {
      removeClassFromElements("menubar-disabled-menubarmode", [
        "BTTNotchMenuBar",
      ]);
    } else if (
      window.notchBarConfig.BTTShowStandardMenuBar ==
      BTTNotchBarVisibility.OnlyInWidgetMode
    ) {
      removeClassFromElements("menubar-disabled-menubarmode", [
        "BTTNotchMenuBar",
      ]);
    } else if (
      window.notchBarConfig.BTTShowStandardMenuBar ==
      BTTNotchBarVisibility.OnlyInMenubarMode
    ) {
      addClassToElements("menubar-disabled-menubarmode", ["BTTNotchMenuBar"]);
    }

    if (
      window.notchBarConfig.BTTShowMiniMenuBar == BTTNotchBarVisibility.Hidden
    ) {
      addClassToElements("menubar-disabled-widgetmode", ["BTTNotchMenuBar"]);
    } else if (
      window.notchBarConfig.BTTShowMiniMenuBar ==
      BTTNotchBarVisibility.AlwaysVisible
    ) {
      removeClassFromElements("menubar-disabled-widgetmode", [
        "BTTNotchMenuBar",
      ]);
    } else if (
      window.notchBarConfig.BTTShowMiniMenuBar ==
      BTTNotchBarVisibility.OnlyInWidgetMode
    ) {
      removeClassFromElements("menubar-disabled-widgetmode", [
        "BTTNotchMenuBar",
      ]);
    } else if (
      window.notchBarConfig.BTTShowMiniMenuBar ==
      BTTNotchBarVisibility.OnlyInMenubarMode
    ) {
      addClassToElements("menubar-disabled-widgetmode", ["BTTNotchMenuBar"]);
    }
  }
}

function setup(config) {
  console.log("setup1", config);
  if (
    config.BTTNotchBarIsOnStandardScreen === 1 ||
    config.BTTNotchBarIsOnStandardScreen === true
  ) {
    addClassToElements("standard-screen", ["BTTNotchBarBody"]);
  } else {
    addClassToElements("notch-screen", ["BTTNotchBarBody"]);
  }

  if (
    config.BTTNotchBarMiniItemsOnTop === 1 ||
    config.BTTNotchBarMiniItemsOnTop === true
  ) {
    addClassToElements("mini-menubar-at-top-edge", ["BTTNotchBarBody"]);
  } else {
    removeClassFromElements("mini-menubar-at-top-edge", ["BTTNotchBarBody"]);
  }

  window.BTTNotchBarIsOnStandardScreen = config.BTTNotchBarIsOnStandardScreen;

  setupStandardWidgets(config);
  if (window.repeatActionInterval) {
    clearInterval(window.repeatActionInterval);
  }
  window.notchBarConfig = config;
  console.log("did configure Notch Bar", config);

  if (window.menubarOnlyMode) {
    setMenubarOnlyModeEnabled(window.menubarOnlyMode);
  }

  document.removeEventListener("long-press", longPress);
  document.addEventListener("long-press", longPress);

  document.addEventListener("wheel", function (e) {
    if (
      window.notchBarConfig.BTTNotchBarSwitchModesByScrolling === 1 ||
      window.notchBarConfig.BTTNotchBarSwitchModesByScrolling === true
    ) {
      if (Math.abs(e.deltaX) > 5) {
        window.scrollCount = 0;
      }
      if (window.scrollResetTimeout) {
        clearTimeout(window.scrollResetTimeout);
      }
      window.scrollResetTimeout = setTimeout(() => {
        window.lastWheelDirection = undefined;
      }, 150);
      if (e.deltaY < -4 && window.lastWheelDirection != "down") {
        window.scrollCount--;

        if (window.scrollCount < -7) {
          window.lastWheelDirection = "down";

          setMenubarOnlyModeEnabled(!window.menubarOnlyMode);
          window.scrollCount = 0;
        }
      } else if (e.deltaY > 4 && window.lastWheelDirection != "up") {
        window.scrollCount++;

        if (window.scrollCount > 7) {
          window.lastWheelDirection = "up";
          setMenubarOnlyModeEnabled(!window.menubarOnlyMode);
          window.scrollCount = 0;
        }
      }
    }
  });

  if (window.notchBarConfig.BTTNotchBarBackgroundImage.length > 0) {
    const backgroundBase64 = `url("${window.notchBarConfig.BTTNotchBarBackgroundImage}")`;

    window.backgroundBase64 = backgroundBase64;

    setVariableForElement(
      "--notchbar-background-image",
      backgroundBase64,
      "BTTNotchBarBody"
    );
  } else {
    setVariableForElement(
      "--notchbar-background-image",
      "unset",
      "BTTNotchBarBody"
    );
  }

  //reinitialize on config change
  setMenubarOnlyModeEnabled(window.menubarOnlyMode);
}

function toggleMenubarOnlyMode() {
  console.log("toggle menubar only mode");
  setMenubarOnlyModeEnabled(!window.menubarOnlyMode);
}

function setMenubarOnlyModeEnabled(mode) {
  if (!window.isInitialized) {
    setTimeout(() => {
      setMenubarOnlyModeEnabled(mode);
    }, 300);
    return;
  }
  if (mode === true) {
    activateMenubarOnlyMode();
  } else {
    activateWidgetMode();
  }
}

function activateMenubarOnlyMode() {
  if (!window.isInitialized) {
    setTimeout(() => {
      activateMenubarOnlyMode();
    }, 300);
    return;
  }
  console.log("switching to menubar only mode");
  // activate big menubar mode

  removeClassFromElements("widget-mode-active", ["BTTNotchBarContainer"]);

  // remove the big menubar class
  removeClassFromElements("menubar-mode", ["BTTNotchMenuBar"]);

  removeClassFromElements("mini-menubar-hidden", ["BTTNotchMenuBar"]);

  removeClassFromElements("widget-mode-active", ["BTTNotchBarContainer"]);
  addClassToElements("menubar-mode-active", ["BTTNotchBarContainer"]);

  // make menubar bigger
  document.getElementById("BTTNotchMenuBar").classList.add("menubar-mode");

  // TODO: option to hide the mini status bar in widget mode, even if the original status items are not shown

  window.menubarOnlyMode = true;
  callBTT("notchbar_mode_changed", { BTTNotchBarMode: 2 });

  setupStandardWidgets(window.notchBarConfig);
}

function activateWidgetMode() {
  if (!window.isInitialized) {
    setTimeout(() => {
      activateWidgetMode();
    }, 300);
    return;
  }
  // activate widget mode
  console.log("switching to notchbar widget mode");

  removeClassFromElements("mini-statusbar-hidden", ["BTTNotchStatusBar"]);

  const statusBarItems = document.getElementsByClassName("statusbar-item");
  for (let statusBarItem of statusBarItems) {
    statusBarItem.style.display = "unset";
  }

  // switch from big menubar mode to widget mode
  removeClassFromElements("menubar-mode-notchbar", [
    "BTTNotchBar",
    "BTTNotchBarFixedLeft",
    "BTTNotchBarScrollableLeftOfNotch",
    "BTTNotchBarScrollableRightOfNotch",
    "BTTNotchBarFixedRight",
  ]);
  addClassToElements("widget-mode", [
    "BTTNotchBar",
    "BTTNotchBarFixedLeft",
    "BTTNotchBarScrollableLeftOfNotch",
    "BTTNotchBarScrollableRightOfNotch",
    "BTTNotchBarFixedRight",
  ]);

  addClassToElements("widget-mode-active", ["BTTNotchBarContainer"]);
  removeClassFromElements("menubar-mode-active", ["BTTNotchBarContainer"]);
  // make menubar small again

  removeClassFromElements("menubar-mode", ["BTTNotchMenuBar"]);

  document.getElementById("BTTNotchBar").style.display = "flex";

  window.menubarOnlyMode = false;

  callBTT("notchbar_mode_changed", { BTTNotchBarMode: 1 });
  setupStandardWidgets(window.notchBarConfig);
}

function addOrUpdateStatusBarItem(
  containerID,
  base64,
  x,
  y,
  elementID,
  sourceNotch
) {
  const containerElement = document.getElementById(containerID);
  if (!containerElement) {
    return;
  }

  let dataXChanged = false;

  let div = document.getElementById(elementID + containerID);
  if (!div) {
    div = document.createElement("div");
    div.alt = "status icon";
    div.id = elementID + containerID;
    div.setAttribute("data-use-for-highlight", "true");
    div.classList.add("statusbar-item");
    containerElement.appendChild(div);
    div.onmouseup = function () {
      callBTT("click_status_item", { id: elementID });
    };
  }

  let img = document.getElementById(elementID + containerID + "img");

  // create html image tag using js
  if (!img) {
    img = document.createElement("img");
    img.alt = "status icon";
    img.id = elementID + containerID + "img";
    img.setAttribute("x-apple-data-detectors", "false");
    // set class for img tag
    img.classList.add("statusbar-item-image");

    div.appendChild(img);
  }

  if (+div.getAttribute("data-x") !== x) {
    div.setAttribute("data-x", x);
    img.setAttribute("data-x", x);

    dataXChanged = true;
  }

  if (sourceNotch === 1) {
    div.classList.add("source-notch");

    img.classList.add("source-notch");
    div.classList.remove("source-standard");
    img.classList.remove("source-standard");
  } else {
    div.classList.add("source-standard");
    img.classList.add("source-standard");

    div.classList.remove("source-notch");
    img.classList.remove("source-notch");
  }

  let children = Array.prototype.slice.call(containerElement.children, 0);

  children.sort(function (a, b) {
    var aord = +a.getAttribute("data-x");
    var bord = +b.getAttribute("data-x");
    return aord - bord;
  });

  if (dataXChanged === true) {
    removeAllChildrenForElement(containerElement);
    for (var i = 0, l = children.length; i < l; i++) {
      containerElement.appendChild(children[i]);
    }
  }

  if (base64 && base64.length > 0) {
    img.src = `data:image/png;base64,${base64}`;
  }
}

function updateDisplayValue(
  elementID,
  widgetType,
  value,
  imageBase64,
  json,
  invert
) {
  const element = document.getElementById(elementID);
  if (element) {
    switch (widgetType) {
      case widgetTypes.BTTGestureNotchBarNowPlayingWidget:
      case widgetTypes.BTTGestureNotchBarRunAppleScriptWidget:
      case widgetTypes.BTTGestureNotchBarWeatherWidget:
      case widgetTypes.BTTGestureNotchBarDateTimeWidget:
      case widgetTypes.BTTGestureNotchBarShellScriptWidget:
      case widgetTypes.BTTGestureNotchBarShortcutsWidget:
      case widgetTypes.BTTGestureNotchBarWidgetClipboard:

      case widgetTypes.BTTGestureNotchBarButton:
        updateDisplayValueForButtonElement(
          element,
          value,
          imageBase64,
          json,
          invert
        );
        break;

      default:
        break;
    }
  }
}

function addOrUpdateButtonFromBTT(elementID, jsonDescription) {
  addOrUpdateButton(elementID, jsonDescription);
}
/*
This function is called by BTT to add or update the standard Notch Bar buttons
*/
function addOrUpdateButton(
  elementID,
  jsonDescription,
  existingContainer,
  doNotAdd = false
) {
  console.log("update button", elementID, jsonDescription);

  if (window.repeatActionInterval) {
    clearInterval(window.repeatActionInterval);
    window.repeatActionInterval = null;
  }
  let btn = document.getElementById(elementID);
  let img;
  let containerElement = existingContainer;
  if (!containerElement) {
    const containerID = getPlacementContainer(jsonDescription);

    containerElement = document.getElementById(containerID);
    if (!containerElement) {
      console.log("container not found", containerID);
      return;
    }
  }

  if (!btn || +btn.getAttribute("data-order") != jsonDescription.order) {
    if (btn) {
      removeElementWithID(elementID);
    }

    btn = document.createElement("div");
    btn.id = elementID;
    btn.alt = jsonDescription.BTTTouchBarButtonName;
    btn.classList.add("button");

    if (jsonDescription.BTTMergeIntoTouchBarGroups) {
      btn.classList.add("needs-reset-on-update-group");
    } else {
      btn.classList.add("needs-reset-on-update");
    }

    addVisibilityInfoToElement(jsonDescription, btn);

    btn.setAttribute("data-order", jsonDescription.order);

    btn.setAttribute("x-apple-data-detectors", "false");
    btn.setAttribute("data-use-for-highlight", "true");

    if (
      jsonDescription.BTTNotchBarActionRepeatRate &&
      jsonDescription.BTTNotchBarActionRepeatRate > 0.01
    ) {
      btn.onmousedown = () => {
        if (jsonDescription.BTTTriggerType == 630) {
          callBTT("open_notchbar_group", { uuid: elementID });
        } else {
          callBTT("widget_clicked", { uuid: elementID });
        }
        const repeatDelay =
          jsonDescription.BTTNotchBarActionRepeatDelay > 0.01
            ? jsonDescription.BTTNotchBarActionRepeatDelay
            : 0;

        setTimeout(() => {
          window.repeatActionInterval = setInterval(() => {
            if (jsonDescription.BTTTriggerType == 630) {
              callBTT("open_notchbar_group", { uuid: elementID });
            } else {
              callBTT("widget_clicked", { uuid: elementID });
            }
          }, jsonDescription.BTTNotchBarActionRepeatRate * 1000);
        }, repeatDelay * 1000);
      };

      btn.onmouseup = () => {
        if (window.repeatActionInterval) {
          clearInterval(window.repeatActionInterval);
          window.repeatActionInterval = null;
        }
        setTimeout(() => {
          window.longPressed = false;
        });
      };
    } else {
      btn.onclick = function () {
        if (window.longPressed === true) {
          window.longPressed = false;
          return;
        }
        if (window.repeatActionInterval) {
          clearInterval(window.repeatActionInterval);
          window.repeatActionInterval = null;
        }

        if (
          !jsonDescription.BTTNotchBarActionRepeatDelay ||
          jsonDescription.BTTNotchBarActionRepeatDelay < 0.01 ||
          jsonDescription.BTTTouchBarLongPressActionName ||
          jsonDescription.BTTTouchBarLongPressActionName.length > 0
        ) {
          if (jsonDescription.BTTTriggerType == 630) {
            callBTT("open_notchbar_group", { uuid: elementID });
          } else {
            callBTT("widget_clicked", { uuid: elementID });
          }
        }
      };
    }

    // custom styling

    if (doNotAdd !== true) {
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
    }
  }

  addDefaultVariablesToElement(btn, jsonDescription, false);

  const userStyles = jsonDescription.BTTNotchBarCSSStyles;
  const userClass = jsonDescription.BTTNotchBarCSSClass;
  if (userStyles && userStyles.length > 0) {
    btn.style.cssText += ";" + userStyles;
  }

  if (userClass && userClass.length > 0) {
    btn.classList.add(userClass);
  }

  //longpress
  if (
    jsonDescription.BTTTouchBarLongPressActionName &&
    jsonDescription.BTTTouchBarLongPressActionName.length > 0
  ) {
    const repeatDelay =
      jsonDescription.BTTNotchBarActionRepeatDelay > 0.01
        ? jsonDescription.BTTNotchBarActionRepeatDelay
        : 0;
    btn.setAttribute("data-long-press-delay", repeatDelay * 1000);
    btn.setAttribute(
      "data-long-press-action",
      jsonDescription.BTTTouchBarLongPressActionName
    );
  }

  if (jsonDescription.BTTIconData) {
    img = btn.querySelector(".btn-img");
    if (!img) {
      img = document.createElement("img");
      btn.appendChild(img);
    }
    img.src = `data:image/png;base64,${jsonDescription.BTTIconData}`;
    img.className = "btn-img";
    img.style.width = `${jsonDescription.BTTTouchBarItemIconWidth}px`;
    img.style.height = `${jsonDescription.BTTTouchBarItemIconHeight}px`;

    if (
      jsonDescription.BTTTouchBarIconInvert === 1 ||
      jsonDescription.BTTTouchBarIconInvert === true
    ) {
      img.style.filter = "invert(100%)";
    } else {
      img.style.filter = "invert(0%)";
    }
  }

  if (jsonDescription.BTTTouchBarButtonName || jsonDescription.BTTGroupName) {
    updateDisplayValueForButtonElement(
      btn,
      jsonDescription.BTTTouchBarButtonName
        ? jsonDescription.BTTTouchBarButtonName
        : jsonDescription.BTTGroupName,
      jsonDescription.BTTIconData,
      jsonDescription
    );
  }

  return btn;
}

/*
 * This function is called by BTT to add HTML/JS widgets.
 */
function addHTMLWidget(jsonDescription, elementID, order, additionalData) {
  console.log("adding html widget");

  if (additionalData) {
    additionalData = JSON.parse(decodeBase64(additionalData));
  }

  window.widgetAdditionalData[elementID] = additionalData;
  window.widgetConfig[elementID] = jsonDescription;

  console.log("addHTMLWidget", elementID);
  let didInitialize = false;

  const containerID = getPlacementContainer(jsonDescription);
  let btn = document.getElementById(elementID);

  if (!btn || +btn.getAttribute("data-order") !== order) {
    if (btn) {
      removeElementWithID(elementID);
    }

    btn = document.createElement("div");
    btn.id = elementID;
    btn.className = "notchbar-html-widget";
    btn.setAttribute("data-use-for-highlight", "true");

    addVisibilityInfoToElement(jsonDescription, btn);

    if (jsonDescription.BTTMergeIntoTouchBarGroups) {
      btn.classList.add("needs-reset-on-update-group");
    } else {
      btn.classList.add("needs-reset-on-update");
    }
    /*
   BTTNotchBarJSFunctionOnHighlight
     BTTNotchBarJSFunctionOnRefresh
     BTTNotchBarJSFunctionOnLoad
     BTTNotchBarCSS
     BTTNotchBarJS
     BTTNotchBarHTML*/

    // add html
    if (jsonDescription.BTTNotchBarHTML) {
      btn.innerHTML = jsonDescription.BTTNotchBarHTML;
    }

    if (window.initializedHTMLWidgets[elementID] === undefined) {
      // add css
      if (
        jsonDescription.BTTNotchBarCSS &&
        jsonDescription.BTTNotchBarCSS.length > 0
      ) {
        const style = document.createElement("style");
        style.textContent = jsonDescription.BTTNotchBarCSS;
        document.head.append(style);
      }

      if (
        !jsonDescription.BTTNotchBarJS &&
        jsonDescription.BTTNotchBarJSBase64
      ) {
        jsonDescription.BTTNotchBarJS = decodeBase64(
          jsonDescription.BTTNotchBarJSBase64
        );
      }

      // add java script
      if (
        jsonDescription.BTTNotchBarJS &&
        jsonDescription.BTTNotchBarJS.length > 0
      ) {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.id = elementID + "script";

        if (
          jsonDescription.BTTNotchBarJSFunctionOnLoad &&
          jsonDescription.BTTNotchBarJSFunctionOnLoad.length > 0
        ) {
          setTimeout(() => {
            const jsFunctionOnLoad =
              jsonDescription.BTTNotchBarJSFunctionOnLoad.replace(
                "BTTWidgetUUID",
                elementID
              );
            eval(jsFunctionOnLoad);
          }, 1);
        }

        script.text = jsonDescription.BTTNotchBarJS;
        head.appendChild(script);
        didInitialize = true;
      } else {
        const script = document.getElementById(elementID + "script");
        if (
          jsonDescription.BTTNotchBarJS &&
          script.text != jsonDescription.BTTNotchBarJS
        ) {
          script.text = jsonDescription.BTTNotchBarJS.replace(
            "BTTWidgetUUID",
            elementID
          );
        }
      }

      if (
        jsonDescription.BTTNotchBarJSFunctionOnHighlight &&
        jsonDescription.BTTNotchBarJSFunctionOnHighlight.length > 0
      ) {
        btn.setAttribute(
          "data-on-highlight",
          jsonDescription.BTTNotchBarJSFunctionOnHighlight.replace(
            "BTTWidgetUUID",
            elementID
          )
        );
      }
    }
    addDefaultVariablesToElement(btn, jsonDescription, true);

    btn.setAttribute("data-order", order);

    window.initializedHTMLWidgets[elementID] = true;
  }

  // refresh js

  if (didInitialize === false) {
    if (
      jsonDescription.BTTNotchBarJSFunctionOnRefresh &&
      jsonDescription.BTTNotchBarJSFunctionOnRefresh.length > 0
    ) {
      setTimeout(() => {
        eval(
          jsonDescription.BTTNotchBarJSFunctionOnRefresh.replace(
            "BTTWidgetUUID",
            elementID
          )
        );
      }, 1);
    }
  }

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

function toggleBlack() {
  let blackOverlay = document.getElementById("BTTNotchBarBlackOverlay");

  if (!blackOverlay) {
    blackOverlay = document.createElement("div");
    blackOverlay.id = "BTTNotchBarBlackOverlay";
    blackOverlay.style.background = "black";
    blackOverlay.style.zIndex = 2147483647;
    blackOverlay.style.margin = "0px";
    blackOverlay.style.width = "100vw";
    blackOverlay.style.height = "100vh";
    blackOverlay.style.position = "absolute";
    blackOverlay.style.left = "0px";
    blackOverlay.style.bottom = "0px";
    blackOverlay.style.top = "0px";
    blackOverlay.style.right = "0px";
    document.body.appendChild(blackOverlay);
    document.body.classList.add("black-background");
  } else {
    removeElementWithID("BTTNotchBarBlackOverlay");
    document.body.classList.remove("black-background");
  }
}

function exitFullScreen() {
  if (window.backgroundBase64) {
    setVariableForElement(
      "--notchbar-background-image",
      backgroundBase64,
      "BTTNotchBarBody"
    );
  }

  console.log("exit fullscreen");
  this.isFullScreen = false;
  const exitFullScreen = { BTTPredefinedActionType: 112 };
  callBTT("trigger_action", { json: JSON.stringify(exitFullScreen) });
}

function didEnterFullscreenMode() {
  console.log("did enter fullscreen mode");

  
  window.isFullScreen = true;
  
}

function didLeaveFullscreenMode() {

  console.log("did leave fullscreen mode");
  window.isFullScreen = false;
  
}
