async function setupBrightnessScrollerWidget(uuid) {
  console.log('loading brightness config', uuid, window.widgetConfig[uuid]);
  const json = window.widgetConfig[uuid];
  let additionalData = window.widgetAdditionalData[uuid];

  let currentBrightness = await callBTT("get_number_variable", {
    variableName: "BuiltInDisplayBrightness",
  });
  const widgetContainer = document.getElementById(uuid);
  widgetContainer.onclick = () => {
    callBTT("widget_clicked", { uuid: uuid });
  };

  const btn = addOrUpdateButton(uuid + "widget", json, widgetContainer);
  updateDisplayForBrightnessScroller(btn, currentBrightness);

  if (!window.initializedCustomWidgets[uuid]) {
    setInterval(async () => {
      let checkedVolume = await callBTT("get_number_variable", {
        variableName: "BuiltInDisplayBrightness",
      });
      updateDisplayForBrightnessScroller(btn, checkedVolume);
    }, 5000);

  }

  window.initializedCustomWidgets[uuid] = true;


  let eventNum = 2;
  btn.onwheel = (e) => {
    eventNum++;
    if (eventNum % 2 !== 0) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (e.deltaY < 0) {
      if (currentBrightness - 0.01 >= -0.01) {
        currentBrightness = currentBrightness - 0.01;

        callBTT("set_number_variable", {
          variableName: "CurrentDisplayBrightness",
          to: currentBrightness,
        });
      }
    }

    if (e.deltaY > 0) {
      if (currentBrightness + 0.01 <= 1.01) {
        currentBrightness = currentBrightness + 0.01;
        callBTT("set_number_variable", {
          variableName: "CurrentDisplayBrightness",
          to: currentBrightness,
        });
      }
    }
    if (currentBrightness > 1) {
      currentBrightness = 1;
    }
    if (currentBrightness < 0) {
      currentBrightness = 0;
    }
    updateDisplayForBrightnessScroller(btn, currentBrightness);
    e.preventDefault();
    e.stopPropagation();
  };

}

async function updateDisplayForBrightnessScroller(buttonElement, brightness) {
  let icon = undefined;

  if (brightness > 0.8) {
    icon = await retrieveSFFontIconWithName("sun.max.fill");
  } else {
    icon = await retrieveSFFontIconWithName("sun.min");
  }

  let iconSize = 15;
  // todo maybe update icon size depending on brightness

  updateDisplayValueForButtonElement(
    buttonElement,
    (brightness * 100).toFixed(0) + "%",
    icon,
    {
      BTTTouchBarItemIconWidth: iconSize,
      BTTTouchBarItemIconHeight: iconSize,
      BTTTouchBarIconInvert: true,
    }
  );
}
