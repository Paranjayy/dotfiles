function setupBTTShortcutsWidget(uuid) {
  const shortcutsToShow = window.widgetAdditionalData[uuid];
  const config = window.widgetConfig[uuid];
  const widgetContainer = document.getElementById(uuid);
  if (!widgetContainer) {
    console.error("shortcuts widget container not available");
    return;
  }

  widgetContainer.style.display = "inline-flex";
  widgetContainer.style.gap = 'var(--notchbar-button-gap, 2px)';
  if (shortcutsToShow) {
    for (const folder of Object.keys(shortcutsToShow)) {
      for (const shortcut of shortcutsToShow[folder]) {
        const btn = addOrUpdateButton(
          uuid + shortcut.name,
          Object.assign(config, {
            BTTTouchBarButtonName: shortcut.name,
            BTTIconData: shortcut.icon,
          }),
          widgetContainer
        );
        btn.setAttribute("data-shortcut-name", shortcut.name);
        btn.setAttribute("data-shortcut-input", shortcut.inputFrom);
        btn.onclick = async (e) => {
          const shortcutName = e.target.getAttribute("data-shortcut-name");
          const shortcutInput = e.target.getAttribute("data-shortcut-input");
          const result = await runAppleShortcut({
            name: shortcutName,
            input: "",
          });
          // TODO do something with the return value of the shortcut
        };
        btn.style.background = shortcut.color;
      }
    }
  }
}
