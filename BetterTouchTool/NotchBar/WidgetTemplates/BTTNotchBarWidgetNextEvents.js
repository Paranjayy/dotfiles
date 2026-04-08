function setupBTTNextEventsWidget(uuid) {}

async function updateBTTNextCalendarEvents(base64Events, uuid) {
  try {
    const events = JSON.parse(decodeBase64(base64Events));
    console.log("setting up next events", uuid, window.widgetConfig[uuid]);

    const json = window.widgetConfig[uuid];
    let additionalData = window.widgetAdditionalData[uuid];
    const widgetContainer = document.getElementById(uuid);
    widgetContainer.style.display = "flex";
    widgetContainer.style.minWidth = "max-content";
    if (!widgetContainer) {
      console.error("next events widget container not available");

      return "";
    }

    if (window.initializedCustomWidgets[uuid] !== true) {
    }

    window.initializedCustomWidgets[uuid] = true;

    removeAllChildrenForElement(widgetContainer);

    const numberOfEvents = events.length;
    let currentIndex = 0;
    for (const event of events) {
      let btn;
      if (event.isDateBadge === true) {
        btn = addOrUpdateButton(
          event.eventIdentifier + "daybadge",
          event,
          widgetContainer
        );
        if (!btn.classList.contains("BTTNextEventsWidgetDay")) {
          btn.classList.add("BTTNextEventsWidgetDay");

          if (
            event.BTTTouchBarCalendarHideBadge !== 1 &&
            event.BTTTouchBarCalendarHideBadge !== true
          ) {
            const div = document.createElement("div");
            if (event.badgeNumber.length > 0) {
              div.style.background =
                "var(--btt-notch-bar-calendar-badge-color, rgb(219, 23, 23))";
            } else {
              div.style.background =
                "var(--btt-notch-bar-calendar-badge-color-no-events, rgba(0, 0, 0, 0.8))";
            }
            div.style.padding = "3px";
            div.style.borderRadius = "10px";
            div.style.marginRight = "3px";
            div.style.fontSize = event.BTTTouchBarButtonFontSizeLine2
              ? event.BTTTouchBarButtonFontSizeLine2 + "px"
              : "10px";
            div.style.textAlign = "center";
            div.style.minWidth = "10px";
            div.innerHTML =
              event.badgeNumber.length > 0 ? event.badgeNumber : "0";
            div.className = "BTTNextEventsWidgetDayBadge";
            btn.insertBefore(div, btn.firstChild);
          }
        }
        console.log("date badge", event);
        // render the date badge
      } else {
        btn = addOrUpdateButton(event.eventIdentifier, event, widgetContainer);
      }

      // override the overall margin setting
      btn.style.margin = "0px";
      btn.setAttribute("data-eventidentifier", event.eventIdentifier);
      btn.setAttribute("data-tag", event.tag);

      // -(void)calendarButtonLongPressed:(NSString*)eventIdentifier tag:(NSNumber*)tagN
      const eventIdentifier = btn.getAttribute("data-eventidentifier");
      const btnTag = btn.getAttribute("data-tag");

      // long press setup
      btn.setAttribute(
        "data-long-press-function",
        "calendarButtonLongPressed:tag:"
      );
      btn.setAttribute("data-widget-uuid", uuid);
      btn.setAttribute("data-long-press-param1", eventIdentifier);
      btn.setAttribute("data-long-press-param2", btnTag);

      btn.onclick = (e) => {
        const eventIdentifier = btn.getAttribute("data-eventidentifier");
        const btnTag = btn.getAttribute("data-tag");

        callBTT("call_widget_function", {
          BTTWidgetUUID: uuid,
          BTTWidgetFunctionParam1: eventIdentifier,
          BTTWidgetFunctionParam2: btnTag,

          BTTWidgetFunction: "calendarButtonTapped:tag:",
        });
      };

      if (currentIndex == 0 && numberOfEvents == 1) {
      } else {
        if (currentIndex === 0) {
          btn.style.borderTopRightRadius = "0px";
          btn.style.borderBottomRightRadius = "0px";
        } else if (currentIndex > 0 && currentIndex < numberOfEvents - 1) {
          btn.style.borderRadius = "0px";
        } else {
          btn.style.borderTopLeftRadius = "0px";
          btn.style.borderBottomLeftRadius = "0px";
        }
      }
      currentIndex++;
    }
  } catch (err) {
    console.error("updateBTTNextCalendarEventsError", err);
    debugger;
    return 'updateBTTNextCalendarEventsError';
  }
    
    return '';
}
