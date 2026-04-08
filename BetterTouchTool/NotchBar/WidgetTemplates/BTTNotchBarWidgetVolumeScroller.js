async function setupVolumeScrollerWidget(uuid) {
  console.log('loading volume config', uuid, window.widgetConfig[uuid]);

  const json = window.widgetConfig[uuid];
  let additionalData = window.widgetAdditionalData[uuid];

  let currentVolume = await callBTT("get_number_variable", {
    variableName: "OutputVolume",
  });
  const widgetContainer = document.getElementById(uuid);
  widgetContainer.onclick = () => {
    callBTT("widget_clicked", { uuid: uuid });
  };
  if (!widgetContainer) {
    console.error("volume widget container not available");
    return;
  }
  const btn = addOrUpdateButton(uuid + "widget", json, widgetContainer);
  updateDisplayForVolumeScroller(btn, currentVolume);

  if (window.initializedCustomWidgets[uuid] !== true) {
    setInterval(async () => {
      let checkedVolume = await callBTT("get_number_variable", {
        variableName: "OutputVolume",
      });
      updateDisplayForVolumeScroller(btn, checkedVolume);
    }, 5000);

    if(widgetContainer.childElementCount == 0) {
      widgetContainer.appendChild(btn);

    }
  }

  window.initializedCustomWidgets[uuid] = true;

  let eventNum = 2;
  btn.onwheel = (e) => {
    eventNum++;
    if (eventNum % 3 !== 0) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (e.deltaY < 0) {
      if (currentVolume - 0.01 >= -0.01) {
        currentVolume = currentVolume - 0.01;

        callBTT("set_number_variable", {
          variableName: "OutputVolume",
          to: currentVolume,
        });
      }
    }

    if (e.deltaY > 0) {
      if (currentVolume + 0.01 <= 1.01) {
        currentVolume = currentVolume + 0.01;
        callBTT("set_number_variable", {
          variableName: "OutputVolume",
          to: currentVolume,
        });
      }
    }
    if (currentVolume > 1) {
      currentVolume = 1;
    }
    if (currentVolume < 0) {
      currentVolume = 0;
    }
    updateDisplayForVolumeScroller(btn, currentVolume);
    e.preventDefault();
    e.stopPropagation();
  };

}

async function updateDisplayForVolumeScroller(buttonElement, volume) {
  let icon = undefined;

  if (volume > 0.95) {
    icon = await retrieveSFFontIconWithName("speaker.wave.3.fill");
  } else if (volume > 0.8) {
    icon = await retrieveSFFontIconWithName("speaker.wave.3");
  } else if (volume > 0.6) {
    icon = await retrieveSFFontIconWithName("speaker.wave.2");
  } else if (volume > 0.4) {
    icon = await retrieveSFFontIconWithName("speaker.wave.1");
  } else if (volume < 0.01) {
    icon = await retrieveSFFontIconWithName("speaker.slash");
  } else {
    icon = await retrieveSFFontIconWithName("speaker.wave.1");

  }
  let iconSize = 15;
  // todo maybe update icon size depending on volume

  updateDisplayValueForButtonElement(
    buttonElement,
    (volume * 100).toFixed(0) + "%",
    icon,
    {
      BTTTouchBarItemIconHeight: iconSize,
      BTTTouchBarIconInvert: true,
    }
  );
}
