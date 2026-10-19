(() => {
  const themes = [
    ["crimson", "Crimson"],
    ["nord", "Nord"],
    ["graphite", "Graphite"],
  ];
  const storageKey = "debian-docs-theme";
  let selected = "crimson";
  try {
    const saved = localStorage.getItem(storageKey);
    if (themes.some(([value]) => value === saved)) selected = saved;
  } catch { /* Themes also work when browser storage is disabled. */ }

  function applyTheme(value) {
    document.documentElement.dataset.docsTheme = value;
  }
  applyTheme(selected);

  function mountPicker() {
    const header = document.querySelector(".md-header__inner");
    if (!header || header.querySelector(".theme-picker")) return;
    const picker = document.createElement("select");
    picker.className = "theme-picker";
    picker.setAttribute("aria-label", "Site theme");
    picker.title = "Try a different site theme";
    for (const [value, label] of themes) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      picker.append(option);
    }
    picker.value = selected;
    picker.addEventListener("change", () => {
      selected = picker.value;
      applyTheme(selected);
      try { localStorage.setItem(storageKey, selected); } catch { /* Optional. */ }
    });
    const palette = header.querySelector("[data-md-component='palette']");
    header.insertBefore(picker, palette);
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(mountPicker);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountPicker);
  } else {
    mountPicker();
  }
})();
