"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/search.tsx
var search_exports = {};
__export(search_exports, {
  default: () => Command
});
module.exports = __toCommonJS(search_exports);
var import_api = require("@raycast/api");
var import_react = require("react");
var import_promises = require("fs/promises");
var import_path = require("path");
var import_os = require("os");
var import_jsx_runtime = require("react/jsx-runtime");
var FAVORITES_KEY = "favorites_v1";
var HISTORY_KEY = "history_v1";
function Command() {
  const [searchText, setSearchText] = (0, import_react.useState)("");
  const [items, setItems] = (0, import_react.useState)([]);
  const [favorites, setFavorites] = (0, import_react.useState)([]);
  const [history, setHistory] = (0, import_react.useState)([]);
  const [isLoading, setIsLoading] = (0, import_react.useState)(false);
  const [isGridView, setIsGridView] = (0, import_react.useState)(true);
  const [isShowingDetail, setIsShowingDetail] = (0, import_react.useState)(false);
  const [sortValue, setSortValue] = (0, import_react.useState)("popularity");
  const [sortOrder, setSortOrder] = (0, import_react.useState)("DESCENDING");
  const [category, setCategory] = (0, import_react.useState)("TOP");
  (0, import_react.useEffect)(() => {
    async function loadStorage() {
      const storedFavs = await import_api.LocalStorage.getItem(FAVORITES_KEY);
      const storedHist = await import_api.LocalStorage.getItem(HISTORY_KEY);
      const storedDetail = await import_api.LocalStorage.getItem("show_detail_v1");
      if (storedFavs) setFavorites(JSON.parse(storedFavs));
      if (storedHist) setHistory(JSON.parse(storedHist));
      if (storedDetail) setIsShowingDetail(JSON.parse(storedDetail));
    }
    loadStorage();
  }, []);
  (0, import_react.useEffect)(() => {
    import_api.LocalStorage.setItem("show_detail_v1", JSON.stringify(isShowingDetail));
  }, [isShowingDetail]);
  (0, import_react.useEffect)(() => {
    async function fetchEmotes() {
      const query = searchText.trim();
      if (!query && !category.startsWith("TRENDING") && !category.startsWith("TOP")) {
        setItems([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const gqlQuery = {
          query: `
            query SearchEmotes($query: String!, $page: Int, $limit: Int, $sort: Sort, $filter: EmoteSearchFilter) {
              emotes(query: $query, page: $page, limit: $limit, sort: $sort, filter: $filter) {
                count
                items {
                  id
                  name
                  animated
                  owner {
                    display_name
                  }
                  host {
                    url
                    files {
                      name
                      static_name
                      width
                      height
                      format
                    }
                  }
                }
              }
            }
          `,
          variables: {
            query: query || "",
            page: 1,
            limit: 60,
            sort: {
              value: sortValue,
              order: sortOrder
            },
            filter: {
              category,
              exact_match: false,
              animated: null,
              zero_width: false
            }
          }
        };
        const response = await fetch("https://7tv.io/v3/gql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Raycast/1.0.0 (Antigravity-Vault)"
          },
          body: JSON.stringify(gqlQuery)
        });
        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`API ${response.status}: ${errBody.slice(0, 50)}`);
        }
        const resJson = await response.json();
        if (resJson.errors) {
          throw new Error(resJson.errors[0]?.message || "GQL Error");
        }
        setItems(resJson.data?.emotes?.items || []);
      } catch (error) {
        (0, import_api.showToast)({
          style: import_api.Toast.Style.Failure,
          title: "7TV Error",
          message: String(error)
        });
      } finally {
        setIsLoading(false);
      }
    }
    const delayDebounceFn = setTimeout(() => {
      fetchEmotes();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchText, sortValue, sortOrder, category]);
  const getEmoteUrl = (item, size = "4x") => {
    const hostUrl = item.host.url;
    return `https:${hostUrl}/${size}.webp`;
  };
  async function addToHistory(item) {
    const newHistory = [item, ...history.filter((h) => h.id !== item.id)].slice(
      0,
      20
    );
    setHistory(newHistory);
    await import_api.LocalStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  }
  async function toggleFavorite(item) {
    const isFav = favorites.some((f) => f.id === item.id);
    let newFavs;
    if (isFav) {
      newFavs = favorites.filter((f) => f.id !== item.id);
      await (0, import_api.showToast)({ title: "Removed from Favorites" });
    } else {
      newFavs = [item, ...favorites];
      await (0, import_api.showToast)({ title: "Added to Favorites" });
    }
    setFavorites(newFavs);
    await import_api.LocalStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
  }
  async function handleDropEmote(item, mode = "smart") {
    const url = getEmoteUrl(item, "4x");
    await addToHistory(item);
    if (mode === "url") {
      await import_api.Clipboard.paste(url);
      await (0, import_api.showToast)({ title: "URL Pasted" });
      return;
    }
    const toast = await (0, import_api.showToast)({
      style: import_api.Toast.Style.Animated,
      title: mode === "bruteforce" ? "\u{1F525} Bruteforcing..." : "Processing Emote..."
    });
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Download failed");
      const arrayBuffer = await res.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const safeName = item.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const tempPath = (0, import_path.join)((0, import_os.tmpdir)(), `vault_${safeName}_${item.id}.webp`);
      await (0, import_promises.writeFile)(tempPath, data);
      try {
        await import_api.Clipboard.copy({
          file: tempPath,
          html: `<img src="${url}" alt="${item.name}" />`
        });
        if (mode === "bruteforce") {
          await import_api.Clipboard.paste({ text: url });
          await import_api.Clipboard.paste({ file: tempPath });
        } else {
          await import_api.Clipboard.paste({ file: tempPath });
        }
        toast.style = import_api.Toast.Style.Success;
        toast.title = mode === "bruteforce" ? "Emote Bruteforced!" : "Emote Dropped!";
      } catch (clipError) {
        console.error("Drop failed:", clipError);
        await import_api.Clipboard.paste(url);
        toast.style = import_api.Toast.Style.Success;
        toast.title = "URL Pasted (Fallback)";
      }
    } catch (e) {
      console.error("Critical Error:", e);
      await import_api.Clipboard.paste(url);
      toast.style = import_api.Toast.Style.Success;
      toast.title = "URL Pasted (Error Fallback)";
    }
  }
  const renderActions = (item) => {
    const isFav = favorites.some((f) => f.id === item.id);
    const highResUrl = getEmoteUrl(item, "4x");
    const markdown = `![${item.name}](${highResUrl})`;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.ActionPanel, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.ActionPanel.Section, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_api.Action,
          {
            title: "Drop Emote",
            icon: import_api.Icon.ChevronRight,
            onAction: () => handleDropEmote(item, "smart")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_api.Action,
          {
            title: "Bruteforce Drop",
            icon: import_api.Icon.Bolt,
            onAction: () => handleDropEmote(item, "bruteforce"),
            shortcut: { modifiers: ["cmd", "shift"], key: "enter" }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_api.Action,
          {
            title: isFav ? "Unstar Emote" : "Star Emote",
            icon: isFav ? import_api.Icon.StarDisabled : import_api.Icon.Star,
            onAction: () => toggleFavorite(item),
            shortcut: { modifiers: ["cmd"], key: "s" }
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.ActionPanel.Section, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_api.Action,
          {
            title: "Force Paste URL",
            icon: import_api.Icon.Link,
            onAction: () => handleDropEmote(item, "url"),
            shortcut: { modifiers: ["cmd"], key: "enter" }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action.CopyToClipboard, { title: "Copy Emote URL", content: highResUrl }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_api.Action.CopyToClipboard,
          {
            title: "Copy as Markdown",
            content: markdown,
            shortcut: { modifiers: ["cmd"], key: "m" }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_api.Action,
          {
            title: "Copy Emote File",
            icon: import_api.Icon.Download,
            onAction: async () => {
              const toast = await (0, import_api.showToast)({
                style: import_api.Toast.Style.Animated,
                title: "Downloading Emote..."
              });
              try {
                const res = await fetch(highResUrl);
                if (!res.ok) throw new Error("Download failed");
                const data = new Uint8Array(await res.arrayBuffer());
                const safeName = item.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
                const tempPath = (0, import_path.join)((0, import_os.tmpdir)(), `copy_${safeName}.webp`);
                await (0, import_promises.writeFile)(tempPath, data);
                await import_api.Clipboard.copy({ file: tempPath });
                toast.style = import_api.Toast.Style.Success;
                toast.title = "File Copied";
                toast.message = "Ready to paste (Cmd+V)";
              } catch (e) {
                toast.style = import_api.Toast.Style.Failure;
                toast.title = "Copy Failed";
                toast.message = String(e);
              }
            }
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.ActionPanel.Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api.Action,
        {
          title: isShowingDetail ? "Hide Detail" : "Show Detail",
          icon: import_api.Icon.SidebarLeft,
          onAction: () => setIsShowingDetail(!isShowingDetail),
          shortcut: { modifiers: ["cmd", "shift"], key: "d" }
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.ActionPanel.Section, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_api.Action.OpenInBrowser,
          {
            title: "View on 7tv",
            url: `https://7tv.app/emotes/${item.id}`
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_api.Action,
          {
            title: isGridView ? "Switch to List View" : "Switch to Grid View",
            icon: isGridView ? import_api.Icon.List : import_api.Icon.Grid,
            onAction: () => setIsGridView(!isGridView),
            shortcut: { modifiers: ["cmd", "shift"], key: "v" }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_api.Action.CopyToClipboard,
          {
            title: "Copy Id",
            content: item.id,
            shortcut: { modifiers: ["cmd", "shift"], key: "i" }
          }
        )
      ] })
    ] });
  };
  const renderDetail = (item) => {
    const url = getEmoteUrl(item, "4x");
    const formats = item.host.files.map((f) => f.format).join(", ");
    const markdown = `
![${item.name}](${url})

## ${item.name}

| Property | Value |
| :--- | :--- |
| **ID** | \`${item.id}\` |
| **Owner** | ${item.owner?.display_name || "Community"} |
| **Formats** | ${formats} |
| **Animated** | ${item.animated ? "Yes \u2728" : "No"} |
| **Status** | Vibe Checked \u2705 |
    `;
    const GridDetail = import_api.Grid.Item.Detail || import_api.List.Item.Detail;
    if (GridDetail) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridDetail, { markdown });
    }
    return null;
  };
  const accessory = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_api.List.Dropdown,
    {
      tooltip: "Sort & Filter",
      storeValue: true,
      onChange: (val) => {
        const [cat, sortVal, order] = val.split(":");
        setCategory(cat);
        setSortValue(sortVal);
        setSortOrder(order);
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.List.Dropdown.Section, { title: "Top Emotes", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_api.List.Dropdown.Item,
            {
              title: "Popular (All Time)",
              value: "TOP:popularity:DESCENDING"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_api.List.Dropdown.Item,
            {
              title: "Recently Created",
              value: "TOP:created_at:DESCENDING"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Dropdown.Section, { title: "Trending", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_api.List.Dropdown.Item,
          {
            title: "Trending Right Now",
            value: "TRENDING:popularity:DESCENDING"
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.List.Dropdown.Section, { title: "Alphabetical", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Dropdown.Item, { title: "Name (A-Z)", value: "TOP:name:ASCENDING" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Dropdown.Item, { title: "Name (Z-A)", value: "TOP:name:DESCENDING" })
        ] })
      ]
    }
  );
  const renderGridItems = (data, title) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Grid.Section, { title, children: data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_api.Grid.Item,
    {
      title: item.name,
      subtitle: item.owner?.display_name,
      content: { source: getEmoteUrl(item, "2x") },
      actions: renderActions(item),
      detail: renderDetail(item),
      quickLook: { path: getEmoteUrl(item, "4x"), title: item.name }
    },
    `${title}-${item.id}`
  )) });
  const renderListItems = (data, title) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Section, { title, children: data.map((item) => {
    const url = getEmoteUrl(item, "4x");
    const detailMarkdown = `
<img src="${url}" width="200" />

## ${item.name}

| Property | Value |
| :--- | :--- |
| **ID** | \`${item.id}\` |
| **Owner** | ${item.owner?.display_name || "Community"} |
| **Animated** | ${item.animated ? "Yes \u2728" : "No"} |
| **Vault** | Verified \u{1F6E1}\uFE0F |
        `;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_api.List.Item,
      {
        title: item.name,
        subtitle: item.owner?.display_name || "Community",
        icon: {
          source: getEmoteUrl(item, "1x"),
          mask: import_api.Image.Mask.RoundedRectangle
        },
        actions: renderActions(item),
        quickLook: { path: url, title: item.name },
        detail: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item.Detail, { markdown: detailMarkdown })
      },
      `${title}-${item.id}`
    );
  }) });
  if (isGridView) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_api.Grid,
      {
        isLoading,
        onSearchTextChange: setSearchText,
        searchBarPlaceholder: "Search 7TV Emotes...",
        searchBarAccessory: accessory,
        columns: isShowingDetail ? 5 : 8,
        fit: import_api.Grid.Fit.Contain,
        isShowingDetail,
        children: [
          !searchText && favorites.length > 0 && renderGridItems(favorites, "Starred Emotes"),
          !searchText && history.length > 0 && renderGridItems(history, "Recently Used"),
          (searchText || category.startsWith("TRENDING") || items.length > 0) && renderGridItems(items, `${category} Results`)
        ]
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_api.List,
    {
      isLoading,
      onSearchTextChange: setSearchText,
      searchBarPlaceholder: "Search 7TV Emotes...",
      searchBarAccessory: accessory,
      isShowingDetail,
      throttle: true,
      children: [
        !searchText && favorites.length > 0 && renderListItems(favorites, "Starred Emotes"),
        !searchText && history.length > 0 && renderListItems(history, "Recently Used"),
        (searchText || category.startsWith("TRENDING") || items.length > 0) && renderListItems(items, `${category} Results`)
      ]
    }
  );
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyLzd0di1yYXljYXN0L3NyYy9zZWFyY2gudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQge1xuICBMaXN0LFxuICBHcmlkLFxuICBBY3Rpb25QYW5lbCxcbiAgQWN0aW9uLFxuICBJY29uLFxuICBzaG93VG9hc3QsXG4gIFRvYXN0LFxuICBJbWFnZSxcbiAgQ2xpcGJvYXJkLFxuICBMb2NhbFN0b3JhZ2UsXG59IGZyb20gXCJAcmF5Y2FzdC9hcGlcIjtcbmltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB3cml0ZUZpbGUgfSBmcm9tIFwiZnMvcHJvbWlzZXNcIjtcbmltcG9ydCB7IGpvaW4gfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgdG1wZGlyIH0gZnJvbSBcIm9zXCI7XG5cbmludGVyZmFjZSBFbW90ZSB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgb3duZXI/OiB7XG4gICAgZGlzcGxheV9uYW1lOiBzdHJpbmc7XG4gIH07XG4gIGhvc3Q6IHtcbiAgICB1cmw6IHN0cmluZztcbiAgICBmaWxlczoge1xuICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgc3RhdGljX25hbWU6IHN0cmluZztcbiAgICAgIHdpZHRoOiBudW1iZXI7XG4gICAgICBoZWlnaHQ6IG51bWJlcjtcbiAgICAgIGZvcm1hdDogc3RyaW5nO1xuICAgIH1bXTtcbiAgfTtcbiAgYW5pbWF0ZWQ/OiBib29sZWFuO1xufVxuXG5jb25zdCBGQVZPUklURVNfS0VZID0gXCJmYXZvcml0ZXNfdjFcIjtcbmNvbnN0IEhJU1RPUllfS0VZID0gXCJoaXN0b3J5X3YxXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbW1hbmQoKSB7XG4gIGNvbnN0IFtzZWFyY2hUZXh0LCBzZXRTZWFyY2hUZXh0XSA9IHVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBbaXRlbXMsIHNldEl0ZW1zXSA9IHVzZVN0YXRlPEVtb3RlW10+KFtdKTtcbiAgY29uc3QgW2Zhdm9yaXRlcywgc2V0RmF2b3JpdGVzXSA9IHVzZVN0YXRlPEVtb3RlW10+KFtdKTtcbiAgY29uc3QgW2hpc3RvcnksIHNldEhpc3RvcnldID0gdXNlU3RhdGU8RW1vdGVbXT4oW10pO1xuICBjb25zdCBbaXNMb2FkaW5nLCBzZXRJc0xvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaXNHcmlkVmlldywgc2V0SXNHcmlkVmlld10gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3QgW2lzU2hvd2luZ0RldGFpbCwgc2V0SXNTaG93aW5nRGV0YWlsXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBbc29ydFZhbHVlLCBzZXRTb3J0VmFsdWVdID0gdXNlU3RhdGU8c3RyaW5nPihcInBvcHVsYXJpdHlcIik7XG4gIGNvbnN0IFtzb3J0T3JkZXIsIHNldFNvcnRPcmRlcl0gPSB1c2VTdGF0ZTxzdHJpbmc+KFwiREVTQ0VORElOR1wiKTtcbiAgY29uc3QgW2NhdGVnb3J5LCBzZXRDYXRlZ29yeV0gPSB1c2VTdGF0ZTxzdHJpbmc+KFwiVE9QXCIpO1xuXG4gIC8vIExvYWQgUGVyc2lzdGVudCBTdGF0ZVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGFzeW5jIGZ1bmN0aW9uIGxvYWRTdG9yYWdlKCkge1xuICAgICAgY29uc3Qgc3RvcmVkRmF2cyA9IGF3YWl0IExvY2FsU3RvcmFnZS5nZXRJdGVtPHN0cmluZz4oRkFWT1JJVEVTX0tFWSk7XG4gICAgICBjb25zdCBzdG9yZWRIaXN0ID0gYXdhaXQgTG9jYWxTdG9yYWdlLmdldEl0ZW08c3RyaW5nPihISVNUT1JZX0tFWSk7XG4gICAgICBjb25zdCBzdG9yZWREZXRhaWwgPSBhd2FpdCBMb2NhbFN0b3JhZ2UuZ2V0SXRlbTxzdHJpbmc+KFwic2hvd19kZXRhaWxfdjFcIik7XG4gICAgICBpZiAoc3RvcmVkRmF2cykgc2V0RmF2b3JpdGVzKEpTT04ucGFyc2Uoc3RvcmVkRmF2cykpO1xuICAgICAgaWYgKHN0b3JlZEhpc3QpIHNldEhpc3RvcnkoSlNPTi5wYXJzZShzdG9yZWRIaXN0KSk7XG4gICAgICBpZiAoc3RvcmVkRGV0YWlsKSBzZXRJc1Nob3dpbmdEZXRhaWwoSlNPTi5wYXJzZShzdG9yZWREZXRhaWwpKTtcbiAgICB9XG4gICAgbG9hZFN0b3JhZ2UoKTtcbiAgfSwgW10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgTG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzaG93X2RldGFpbF92MVwiLCBKU09OLnN0cmluZ2lmeShpc1Nob3dpbmdEZXRhaWwpKTtcbiAgfSwgW2lzU2hvd2luZ0RldGFpbF0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hFbW90ZXMoKSB7XG4gICAgICBjb25zdCBxdWVyeSA9IHNlYXJjaFRleHQudHJpbSgpO1xuICAgICAgaWYgKFxuICAgICAgICAhcXVlcnkgJiZcbiAgICAgICAgIWNhdGVnb3J5LnN0YXJ0c1dpdGgoXCJUUkVORElOR1wiKSAmJlxuICAgICAgICAhY2F0ZWdvcnkuc3RhcnRzV2l0aChcIlRPUFwiKVxuICAgICAgKSB7XG4gICAgICAgIHNldEl0ZW1zKFtdKTtcbiAgICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZXRJc0xvYWRpbmcodHJ1ZSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBncWxRdWVyeSA9IHtcbiAgICAgICAgICBxdWVyeTogYFxuICAgICAgICAgICAgcXVlcnkgU2VhcmNoRW1vdGVzKCRxdWVyeTogU3RyaW5nISwgJHBhZ2U6IEludCwgJGxpbWl0OiBJbnQsICRzb3J0OiBTb3J0LCAkZmlsdGVyOiBFbW90ZVNlYXJjaEZpbHRlcikge1xuICAgICAgICAgICAgICBlbW90ZXMocXVlcnk6ICRxdWVyeSwgcGFnZTogJHBhZ2UsIGxpbWl0OiAkbGltaXQsIHNvcnQ6ICRzb3J0LCBmaWx0ZXI6ICRmaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICBjb3VudFxuICAgICAgICAgICAgICAgIGl0ZW1zIHtcbiAgICAgICAgICAgICAgICAgIGlkXG4gICAgICAgICAgICAgICAgICBuYW1lXG4gICAgICAgICAgICAgICAgICBhbmltYXRlZFxuICAgICAgICAgICAgICAgICAgb3duZXIge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5X25hbWVcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGhvc3Qge1xuICAgICAgICAgICAgICAgICAgICB1cmxcbiAgICAgICAgICAgICAgICAgICAgZmlsZXMge1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWVcbiAgICAgICAgICAgICAgICAgICAgICBzdGF0aWNfbmFtZVxuICAgICAgICAgICAgICAgICAgICAgIHdpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgZm9ybWF0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBgLFxuICAgICAgICAgIHZhcmlhYmxlczoge1xuICAgICAgICAgICAgcXVlcnk6IHF1ZXJ5IHx8IFwiXCIsXG4gICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgbGltaXQ6IDYwLFxuICAgICAgICAgICAgc29ydDoge1xuICAgICAgICAgICAgICB2YWx1ZTogc29ydFZhbHVlLFxuICAgICAgICAgICAgICBvcmRlcjogc29ydE9yZGVyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICBjYXRlZ29yeTogY2F0ZWdvcnksXG4gICAgICAgICAgICAgIGV4YWN0X21hdGNoOiBmYWxzZSxcbiAgICAgICAgICAgICAgYW5pbWF0ZWQ6IG51bGwsXG4gICAgICAgICAgICAgIHplcm9fd2lkdGg6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwczovLzd0di5pby92My9ncWxcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICBcIlVzZXItQWdlbnRcIjogXCJSYXljYXN0LzEuMC4wIChBbnRpZ3Jhdml0eS1WYXVsdClcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGdxbFF1ZXJ5KSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgIGNvbnN0IGVyckJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBUEkgJHtyZXNwb25zZS5zdGF0dXN9OiAke2VyckJvZHkuc2xpY2UoMCwgNTApfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzSnNvbiA9IChhd2FpdCByZXNwb25zZS5qc29uKCkpIGFzIHtcbiAgICAgICAgICBkYXRhOiB7IGVtb3RlczogeyBpdGVtczogRW1vdGVbXSB9IH07XG4gICAgICAgICAgZXJyb3JzPzogeyBtZXNzYWdlOiBzdHJpbmcgfVtdO1xuICAgICAgICB9O1xuICAgICAgICBpZiAocmVzSnNvbi5lcnJvcnMpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzSnNvbi5lcnJvcnNbMF0/Lm1lc3NhZ2UgfHwgXCJHUUwgRXJyb3JcIik7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRJdGVtcyhyZXNKc29uLmRhdGE/LmVtb3Rlcz8uaXRlbXMgfHwgW10pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgc2hvd1RvYXN0KHtcbiAgICAgICAgICBzdHlsZTogVG9hc3QuU3R5bGUuRmFpbHVyZSxcbiAgICAgICAgICB0aXRsZTogXCI3VFYgRXJyb3JcIixcbiAgICAgICAgICBtZXNzYWdlOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICB9KTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHNldElzTG9hZGluZyhmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZGVsYXlEZWJvdW5jZUZuID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBmZXRjaEVtb3RlcygpO1xuICAgIH0sIDQwMCk7XG5cbiAgICByZXR1cm4gKCkgPT4gY2xlYXJUaW1lb3V0KGRlbGF5RGVib3VuY2VGbik7XG4gIH0sIFtzZWFyY2hUZXh0LCBzb3J0VmFsdWUsIHNvcnRPcmRlciwgY2F0ZWdvcnldKTtcblxuICBjb25zdCBnZXRFbW90ZVVybCA9IChpdGVtOiBFbW90ZSwgc2l6ZTogXCIxeFwiIHwgXCIyeFwiIHwgXCI0eFwiID0gXCI0eFwiKSA9PiB7XG4gICAgY29uc3QgaG9zdFVybCA9IGl0ZW0uaG9zdC51cmw7XG4gICAgcmV0dXJuIGBodHRwczoke2hvc3RVcmx9LyR7c2l6ZX0ud2VicGA7XG4gIH07XG5cbiAgYXN5bmMgZnVuY3Rpb24gYWRkVG9IaXN0b3J5KGl0ZW06IEVtb3RlKSB7XG4gICAgY29uc3QgbmV3SGlzdG9yeSA9IFtpdGVtLCAuLi5oaXN0b3J5LmZpbHRlcigoaCkgPT4gaC5pZCAhPT0gaXRlbS5pZCldLnNsaWNlKFxuICAgICAgMCxcbiAgICAgIDIwLFxuICAgICk7XG4gICAgc2V0SGlzdG9yeShuZXdIaXN0b3J5KTtcbiAgICBhd2FpdCBMb2NhbFN0b3JhZ2Uuc2V0SXRlbShISVNUT1JZX0tFWSwgSlNPTi5zdHJpbmdpZnkobmV3SGlzdG9yeSkpO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gdG9nZ2xlRmF2b3JpdGUoaXRlbTogRW1vdGUpIHtcbiAgICBjb25zdCBpc0ZhdiA9IGZhdm9yaXRlcy5zb21lKChmKSA9PiBmLmlkID09PSBpdGVtLmlkKTtcbiAgICBsZXQgbmV3RmF2cztcbiAgICBpZiAoaXNGYXYpIHtcbiAgICAgIG5ld0ZhdnMgPSBmYXZvcml0ZXMuZmlsdGVyKChmKSA9PiBmLmlkICE9PSBpdGVtLmlkKTtcbiAgICAgIGF3YWl0IHNob3dUb2FzdCh7IHRpdGxlOiBcIlJlbW92ZWQgZnJvbSBGYXZvcml0ZXNcIiB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3RmF2cyA9IFtpdGVtLCAuLi5mYXZvcml0ZXNdO1xuICAgICAgYXdhaXQgc2hvd1RvYXN0KHsgdGl0bGU6IFwiQWRkZWQgdG8gRmF2b3JpdGVzXCIgfSk7XG4gICAgfVxuICAgIHNldEZhdm9yaXRlcyhuZXdGYXZzKTtcbiAgICBhd2FpdCBMb2NhbFN0b3JhZ2Uuc2V0SXRlbShGQVZPUklURVNfS0VZLCBKU09OLnN0cmluZ2lmeShuZXdGYXZzKSk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBoYW5kbGVEcm9wRW1vdGUoXG4gICAgaXRlbTogRW1vdGUsXG4gICAgbW9kZTogXCJzbWFydFwiIHwgXCJ1cmxcIiB8IFwiYnJ1dGVmb3JjZVwiID0gXCJzbWFydFwiLFxuICApIHtcbiAgICBjb25zdCB1cmwgPSBnZXRFbW90ZVVybChpdGVtLCBcIjR4XCIpO1xuICAgIGF3YWl0IGFkZFRvSGlzdG9yeShpdGVtKTtcblxuICAgIGlmIChtb2RlID09PSBcInVybFwiKSB7XG4gICAgICBhd2FpdCBDbGlwYm9hcmQucGFzdGUodXJsKTtcbiAgICAgIGF3YWl0IHNob3dUb2FzdCh7IHRpdGxlOiBcIlVSTCBQYXN0ZWRcIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0b2FzdCA9IGF3YWl0IHNob3dUb2FzdCh7XG4gICAgICBzdHlsZTogVG9hc3QuU3R5bGUuQW5pbWF0ZWQsXG4gICAgICB0aXRsZTpcbiAgICAgICAgbW9kZSA9PT0gXCJicnV0ZWZvcmNlXCIgPyBcIlx1RDgzRFx1REQyNSBCcnV0ZWZvcmNpbmcuLi5cIiA6IFwiUHJvY2Vzc2luZyBFbW90ZS4uLlwiLFxuICAgIH0pO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihcIkRvd25sb2FkIGZhaWxlZFwiKTtcblxuICAgICAgY29uc3QgYXJyYXlCdWZmZXIgPSBhd2FpdCByZXMuYXJyYXlCdWZmZXIoKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcik7XG5cbiAgICAgIGNvbnN0IHNhZmVOYW1lID0gaXRlbS5uYW1lLnJlcGxhY2UoL1teYS16MC05XS9naSwgXCJfXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICBjb25zdCB0ZW1wUGF0aCA9IGpvaW4odG1wZGlyKCksIGB2YXVsdF8ke3NhZmVOYW1lfV8ke2l0ZW0uaWR9LndlYnBgKTtcbiAgICAgIGF3YWl0IHdyaXRlRmlsZSh0ZW1wUGF0aCwgZGF0YSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IENsaXBib2FyZC5jb3B5KHtcbiAgICAgICAgICBmaWxlOiB0ZW1wUGF0aCxcbiAgICAgICAgICBodG1sOiBgPGltZyBzcmM9XCIke3VybH1cIiBhbHQ9XCIke2l0ZW0ubmFtZX1cIiAvPmAsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChtb2RlID09PSBcImJydXRlZm9yY2VcIikge1xuICAgICAgICAgIGF3YWl0IENsaXBib2FyZC5wYXN0ZSh7IHRleHQ6IHVybCB9KTtcbiAgICAgICAgICBhd2FpdCBDbGlwYm9hcmQucGFzdGUoeyBmaWxlOiB0ZW1wUGF0aCB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhd2FpdCBDbGlwYm9hcmQucGFzdGUoeyBmaWxlOiB0ZW1wUGF0aCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvYXN0LnN0eWxlID0gVG9hc3QuU3R5bGUuU3VjY2VzcztcbiAgICAgICAgdG9hc3QudGl0bGUgPSBtb2RlID09PSBcImJydXRlZm9yY2VcIiA/IFwiRW1vdGUgQnJ1dGVmb3JjZWQhXCIgOiBcIkVtb3RlIERyb3BwZWQhXCI7XG4gICAgICB9IGNhdGNoIChjbGlwRXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkRyb3AgZmFpbGVkOlwiLCBjbGlwRXJyb3IpO1xuICAgICAgICBhd2FpdCBDbGlwYm9hcmQucGFzdGUodXJsKTtcbiAgICAgICAgdG9hc3Quc3R5bGUgPSBUb2FzdC5TdHlsZS5TdWNjZXNzO1xuICAgICAgICB0b2FzdC50aXRsZSA9IFwiVVJMIFBhc3RlZCAoRmFsbGJhY2spXCI7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihcIkNyaXRpY2FsIEVycm9yOlwiLCBlKTtcbiAgICAgIGF3YWl0IENsaXBib2FyZC5wYXN0ZSh1cmwpO1xuICAgICAgdG9hc3Quc3R5bGUgPSBUb2FzdC5TdHlsZS5TdWNjZXNzO1xuICAgICAgdG9hc3QudGl0bGUgPSBcIlVSTCBQYXN0ZWQgKEVycm9yIEZhbGxiYWNrKVwiO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbmRlckFjdGlvbnMgPSAoaXRlbTogRW1vdGUpID0+IHtcbiAgICBjb25zdCBpc0ZhdiA9IGZhdm9yaXRlcy5zb21lKChmKSA9PiBmLmlkID09PSBpdGVtLmlkKTtcbiAgICBjb25zdCBoaWdoUmVzVXJsID0gZ2V0RW1vdGVVcmwoaXRlbSwgXCI0eFwiKTtcbiAgICBjb25zdCBtYXJrZG93biA9IGAhWyR7aXRlbS5uYW1lfV0oJHtoaWdoUmVzVXJsfSlgO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxBY3Rpb25QYW5lbD5cbiAgICAgICAgPEFjdGlvblBhbmVsLlNlY3Rpb24+XG4gICAgICAgICAgPEFjdGlvblxuICAgICAgICAgICAgdGl0bGU9XCJEcm9wIEVtb3RlXCJcbiAgICAgICAgICAgIGljb249e0ljb24uQ2hldnJvblJpZ2h0fVxuICAgICAgICAgICAgb25BY3Rpb249eygpID0+IGhhbmRsZURyb3BFbW90ZShpdGVtLCBcInNtYXJ0XCIpfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEFjdGlvblxuICAgICAgICAgICAgdGl0bGU9XCJCcnV0ZWZvcmNlIERyb3BcIlxuICAgICAgICAgICAgaWNvbj17SWNvbi5Cb2x0fVxuICAgICAgICAgICAgb25BY3Rpb249eygpID0+IGhhbmRsZURyb3BFbW90ZShpdGVtLCBcImJydXRlZm9yY2VcIil9XG4gICAgICAgICAgICBzaG9ydGN1dD17eyBtb2RpZmllcnM6IFtcImNtZFwiLCBcInNoaWZ0XCJdLCBrZXk6IFwiZW50ZXJcIiB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEFjdGlvblxuICAgICAgICAgICAgdGl0bGU9e2lzRmF2ID8gXCJVbnN0YXIgRW1vdGVcIiA6IFwiU3RhciBFbW90ZVwifVxuICAgICAgICAgICAgaWNvbj17aXNGYXYgPyBJY29uLlN0YXJEaXNhYmxlZCA6IEljb24uU3Rhcn1cbiAgICAgICAgICAgIG9uQWN0aW9uPXsoKSA9PiB0b2dnbGVGYXZvcml0ZShpdGVtKX1cbiAgICAgICAgICAgIHNob3J0Y3V0PXt7IG1vZGlmaWVyczogW1wiY21kXCJdLCBrZXk6IFwic1wiIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9BY3Rpb25QYW5lbC5TZWN0aW9uPlxuXG4gICAgICAgIDxBY3Rpb25QYW5lbC5TZWN0aW9uPlxuICAgICAgICAgIDxBY3Rpb25cbiAgICAgICAgICAgIHRpdGxlPVwiRm9yY2UgUGFzdGUgVVJMXCJcbiAgICAgICAgICAgIGljb249e0ljb24uTGlua31cbiAgICAgICAgICAgIG9uQWN0aW9uPXsoKSA9PiBoYW5kbGVEcm9wRW1vdGUoaXRlbSwgXCJ1cmxcIil9XG4gICAgICAgICAgICBzaG9ydGN1dD17eyBtb2RpZmllcnM6IFtcImNtZFwiXSwga2V5OiBcImVudGVyXCIgfX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxBY3Rpb24uQ29weVRvQ2xpcGJvYXJkIHRpdGxlPVwiQ29weSBFbW90ZSBVUkxcIiBjb250ZW50PXtoaWdoUmVzVXJsfSAvPlxuICAgICAgICAgIDxBY3Rpb24uQ29weVRvQ2xpcGJvYXJkXG4gICAgICAgICAgICB0aXRsZT1cIkNvcHkgYXMgTWFya2Rvd25cIlxuICAgICAgICAgICAgY29udGVudD17bWFya2Rvd259XG4gICAgICAgICAgICBzaG9ydGN1dD17eyBtb2RpZmllcnM6IFtcImNtZFwiXSwga2V5OiBcIm1cIiB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEFjdGlvblxuICAgICAgICAgICAgdGl0bGU9XCJDb3B5IEVtb3RlIEZpbGVcIlxuICAgICAgICAgICAgaWNvbj17SWNvbi5Eb3dubG9hZH1cbiAgICAgICAgICAgIG9uQWN0aW9uPXthc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHRvYXN0ID0gYXdhaXQgc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICBzdHlsZTogVG9hc3QuU3R5bGUuQW5pbWF0ZWQsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiRG93bmxvYWRpbmcgRW1vdGUuLi5cIixcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goaGlnaFJlc1VybCk7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihcIkRvd25sb2FkIGZhaWxlZFwiKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoYXdhaXQgcmVzLmFycmF5QnVmZmVyKCkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhZmVOYW1lID0gaXRlbS5uYW1lXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvW15hLXowLTldL2dpLCBcIl9cIilcbiAgICAgICAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBQYXRoID0gam9pbih0bXBkaXIoKSwgYGNvcHlfJHtzYWZlTmFtZX0ud2VicGApO1xuICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlRmlsZSh0ZW1wUGF0aCwgZGF0YSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgQ2xpcGJvYXJkLmNvcHkoeyBmaWxlOiB0ZW1wUGF0aCB9KTtcbiAgICAgICAgICAgICAgICB0b2FzdC5zdHlsZSA9IFRvYXN0LlN0eWxlLlN1Y2Nlc3M7XG4gICAgICAgICAgICAgICAgdG9hc3QudGl0bGUgPSBcIkZpbGUgQ29waWVkXCI7XG4gICAgICAgICAgICAgICAgdG9hc3QubWVzc2FnZSA9IFwiUmVhZHkgdG8gcGFzdGUgKENtZCtWKVwiO1xuICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Quc3R5bGUgPSBUb2FzdC5TdHlsZS5GYWlsdXJlO1xuICAgICAgICAgICAgICAgIHRvYXN0LnRpdGxlID0gXCJDb3B5IEZhaWxlZFwiO1xuICAgICAgICAgICAgICAgIHRvYXN0Lm1lc3NhZ2UgPSBTdHJpbmcoZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9BY3Rpb25QYW5lbC5TZWN0aW9uPlxuICAgICAgICA8QWN0aW9uUGFuZWwuU2VjdGlvbj5cbiAgICAgICAgICA8QWN0aW9uXG4gICAgICAgICAgICB0aXRsZT17aXNTaG93aW5nRGV0YWlsID8gXCJIaWRlIERldGFpbFwiIDogXCJTaG93IERldGFpbFwifVxuICAgICAgICAgICAgaWNvbj17SWNvbi5TaWRlYmFyTGVmdH1cbiAgICAgICAgICAgIG9uQWN0aW9uPXsoKSA9PiBzZXRJc1Nob3dpbmdEZXRhaWwoIWlzU2hvd2luZ0RldGFpbCl9XG4gICAgICAgICAgICBzaG9ydGN1dD17eyBtb2RpZmllcnM6IFtcImNtZFwiLCBcInNoaWZ0XCJdLCBrZXk6IFwiZFwiIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9BY3Rpb25QYW5lbC5TZWN0aW9uPlxuICAgICAgICA8QWN0aW9uUGFuZWwuU2VjdGlvbj5cbiAgICAgICAgICA8QWN0aW9uLk9wZW5JbkJyb3dzZXJcbiAgICAgICAgICAgIHRpdGxlPVwiVmlldyBvbiA3dHZcIlxuICAgICAgICAgICAgdXJsPXtgaHR0cHM6Ly83dHYuYXBwL2Vtb3Rlcy8ke2l0ZW0uaWR9YH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxBY3Rpb25cbiAgICAgICAgICAgIHRpdGxlPXtpc0dyaWRWaWV3ID8gXCJTd2l0Y2ggdG8gTGlzdCBWaWV3XCIgOiBcIlN3aXRjaCB0byBHcmlkIFZpZXdcIn1cbiAgICAgICAgICAgIGljb249e2lzR3JpZFZpZXcgPyBJY29uLkxpc3QgOiBJY29uLkdyaWR9XG4gICAgICAgICAgICBvbkFjdGlvbj17KCkgPT4gc2V0SXNHcmlkVmlldyghaXNHcmlkVmlldyl9XG4gICAgICAgICAgICBzaG9ydGN1dD17eyBtb2RpZmllcnM6IFtcImNtZFwiLCBcInNoaWZ0XCJdLCBrZXk6IFwidlwiIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8QWN0aW9uLkNvcHlUb0NsaXBib2FyZFxuICAgICAgICAgICAgdGl0bGU9XCJDb3B5IElkXCJcbiAgICAgICAgICAgIGNvbnRlbnQ9e2l0ZW0uaWR9XG4gICAgICAgICAgICBzaG9ydGN1dD17eyBtb2RpZmllcnM6IFtcImNtZFwiLCBcInNoaWZ0XCJdLCBrZXk6IFwiaVwiIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9BY3Rpb25QYW5lbC5TZWN0aW9uPlxuICAgICAgPC9BY3Rpb25QYW5lbD5cbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckRldGFpbCA9IChpdGVtOiBFbW90ZSkgPT4ge1xuICAgIGNvbnN0IHVybCA9IGdldEVtb3RlVXJsKGl0ZW0sIFwiNHhcIik7XG4gICAgY29uc3QgZm9ybWF0cyA9IGl0ZW0uaG9zdC5maWxlcy5tYXAoKGYpID0+IGYuZm9ybWF0KS5qb2luKFwiLCBcIik7XG4gICAgXG4gICAgY29uc3QgbWFya2Rvd24gPSBgXG4hWyR7aXRlbS5uYW1lfV0oJHt1cmx9KVxuXG4jIyAke2l0ZW0ubmFtZX1cblxufCBQcm9wZXJ0eSB8IFZhbHVlIHxcbnwgOi0tLSB8IDotLS0gfFxufCAqKklEKiogfCBcXGAke2l0ZW0uaWR9XFxgIHxcbnwgKipPd25lcioqIHwgJHtpdGVtLm93bmVyPy5kaXNwbGF5X25hbWUgfHwgXCJDb21tdW5pdHlcIn0gfFxufCAqKkZvcm1hdHMqKiB8ICR7Zm9ybWF0c30gfFxufCAqKkFuaW1hdGVkKiogfCAke2l0ZW0uYW5pbWF0ZWQgPyBcIlllcyBcdTI3MjhcIiA6IFwiTm9cIn0gfFxufCAqKlN0YXR1cyoqIHwgVmliZSBDaGVja2VkIFx1MjcwNSB8XG4gICAgYDtcblxuICAgIC8vIEZhbGxiYWNrIHRvIExpc3QuSXRlbS5EZXRhaWwgaWYgR3JpZC5JdGVtLkRldGFpbCBpcyBtaXNzaW5nIChvbGRlciBSYXljYXN0KVxuICAgIGNvbnN0IEdyaWREZXRhaWwgPSAoR3JpZC5JdGVtIGFzIGFueSkuRGV0YWlsIHx8IChMaXN0Lkl0ZW0gYXMgYW55KS5EZXRhaWw7XG4gICAgaWYgKEdyaWREZXRhaWwpIHtcbiAgICAgIHJldHVybiA8R3JpZERldGFpbCBtYXJrZG93bj17bWFya2Rvd259IC8+O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICBjb25zdCBhY2Nlc3NvcnkgPSAoXG4gICAgPExpc3QuRHJvcGRvd25cbiAgICAgIHRvb2x0aXA9XCJTb3J0ICYgRmlsdGVyXCJcbiAgICAgIHN0b3JlVmFsdWU9e3RydWV9XG4gICAgICBvbkNoYW5nZT17KHZhbCkgPT4ge1xuICAgICAgICBjb25zdCBbY2F0LCBzb3J0VmFsLCBvcmRlcl0gPSB2YWwuc3BsaXQoXCI6XCIpO1xuICAgICAgICBzZXRDYXRlZ29yeShjYXQpO1xuICAgICAgICBzZXRTb3J0VmFsdWUoc29ydFZhbCk7XG4gICAgICAgIHNldFNvcnRPcmRlcihvcmRlcik7XG4gICAgICB9fVxuICAgID5cbiAgICAgIDxMaXN0LkRyb3Bkb3duLlNlY3Rpb24gdGl0bGU9XCJUb3AgRW1vdGVzXCI+XG4gICAgICAgIDxMaXN0LkRyb3Bkb3duLkl0ZW1cbiAgICAgICAgICB0aXRsZT1cIlBvcHVsYXIgKEFsbCBUaW1lKVwiXG4gICAgICAgICAgdmFsdWU9XCJUT1A6cG9wdWxhcml0eTpERVNDRU5ESU5HXCJcbiAgICAgICAgLz5cbiAgICAgICAgPExpc3QuRHJvcGRvd24uSXRlbVxuICAgICAgICAgIHRpdGxlPVwiUmVjZW50bHkgQ3JlYXRlZFwiXG4gICAgICAgICAgdmFsdWU9XCJUT1A6Y3JlYXRlZF9hdDpERVNDRU5ESU5HXCJcbiAgICAgICAgLz5cbiAgICAgIDwvTGlzdC5Ecm9wZG93bi5TZWN0aW9uPlxuICAgICAgPExpc3QuRHJvcGRvd24uU2VjdGlvbiB0aXRsZT1cIlRyZW5kaW5nXCI+XG4gICAgICAgIDxMaXN0LkRyb3Bkb3duLkl0ZW1cbiAgICAgICAgICB0aXRsZT1cIlRyZW5kaW5nIFJpZ2h0IE5vd1wiXG4gICAgICAgICAgdmFsdWU9XCJUUkVORElORzpwb3B1bGFyaXR5OkRFU0NFTkRJTkdcIlxuICAgICAgICAvPlxuICAgICAgPC9MaXN0LkRyb3Bkb3duLlNlY3Rpb24+XG4gICAgICA8TGlzdC5Ecm9wZG93bi5TZWN0aW9uIHRpdGxlPVwiQWxwaGFiZXRpY2FsXCI+XG4gICAgICAgIDxMaXN0LkRyb3Bkb3duLkl0ZW0gdGl0bGU9XCJOYW1lIChBLVopXCIgdmFsdWU9XCJUT1A6bmFtZTpBU0NFTkRJTkdcIiAvPlxuICAgICAgICA8TGlzdC5Ecm9wZG93bi5JdGVtIHRpdGxlPVwiTmFtZSAoWi1BKVwiIHZhbHVlPVwiVE9QOm5hbWU6REVTQ0VORElOR1wiIC8+XG4gICAgICA8L0xpc3QuRHJvcGRvd24uU2VjdGlvbj5cbiAgICA8L0xpc3QuRHJvcGRvd24+XG4gICk7XG5cbiAgY29uc3QgcmVuZGVyR3JpZEl0ZW1zID0gKGRhdGE6IEVtb3RlW10sIHRpdGxlOiBzdHJpbmcpID0+IChcbiAgICA8R3JpZC5TZWN0aW9uIHRpdGxlPXt0aXRsZX0+XG4gICAgICB7ZGF0YS5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgPEdyaWQuSXRlbVxuICAgICAgICAgIGtleT17YCR7dGl0bGV9LSR7aXRlbS5pZH1gfVxuICAgICAgICAgIHRpdGxlPXtpdGVtLm5hbWV9XG4gICAgICAgICAgc3VidGl0bGU9e2l0ZW0ub3duZXI/LmRpc3BsYXlfbmFtZX1cbiAgICAgICAgICBjb250ZW50PXt7IHNvdXJjZTogZ2V0RW1vdGVVcmwoaXRlbSwgXCIyeFwiKSB9fVxuICAgICAgICAgIGFjdGlvbnM9e3JlbmRlckFjdGlvbnMoaXRlbSl9XG4gICAgICAgICAgZGV0YWlsPXtyZW5kZXJEZXRhaWwoaXRlbSl9XG4gICAgICAgICAgcXVpY2tMb29rPXt7IHBhdGg6IGdldEVtb3RlVXJsKGl0ZW0sIFwiNHhcIiksIHRpdGxlOiBpdGVtLm5hbWUgfX1cbiAgICAgICAgLz5cbiAgICAgICkpfVxuICAgIDwvR3JpZC5TZWN0aW9uPlxuICApO1xuXG4gIGNvbnN0IHJlbmRlckxpc3RJdGVtcyA9IChkYXRhOiBFbW90ZVtdLCB0aXRsZTogc3RyaW5nKSA9PiAoXG4gICAgPExpc3QuU2VjdGlvbiB0aXRsZT17dGl0bGV9PlxuICAgICAge2RhdGEubWFwKChpdGVtKSA9PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IGdldEVtb3RlVXJsKGl0ZW0sIFwiNHhcIik7XG4gICAgICAgIGNvbnN0IGRldGFpbE1hcmtkb3duID0gYFxuPGltZyBzcmM9XCIke3VybH1cIiB3aWR0aD1cIjIwMFwiIC8+XG5cbiMjICR7aXRlbS5uYW1lfVxuXG58IFByb3BlcnR5IHwgVmFsdWUgfFxufCA6LS0tIHwgOi0tLSB8XG58ICoqSUQqKiB8IFxcYCR7aXRlbS5pZH1cXGAgfFxufCAqKk93bmVyKiogfCAke2l0ZW0ub3duZXI/LmRpc3BsYXlfbmFtZSB8fCBcIkNvbW11bml0eVwifSB8XG58ICoqQW5pbWF0ZWQqKiB8ICR7aXRlbS5hbmltYXRlZCA/IFwiWWVzIFx1MjcyOFwiIDogXCJOb1wifSB8XG58ICoqVmF1bHQqKiB8IFZlcmlmaWVkIFx1RDgzRFx1REVFMVx1RkUwRiB8XG4gICAgICAgIGA7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8TGlzdC5JdGVtXG4gICAgICAgICAgICBrZXk9e2Ake3RpdGxlfS0ke2l0ZW0uaWR9YH1cbiAgICAgICAgICAgIHRpdGxlPXtpdGVtLm5hbWV9XG4gICAgICAgICAgICBzdWJ0aXRsZT17aXRlbS5vd25lcj8uZGlzcGxheV9uYW1lIHx8IFwiQ29tbXVuaXR5XCJ9XG4gICAgICAgICAgICBpY29uPXt7XG4gICAgICAgICAgICAgIHNvdXJjZTogZ2V0RW1vdGVVcmwoaXRlbSwgXCIxeFwiKSxcbiAgICAgICAgICAgICAgbWFzazogSW1hZ2UuTWFzay5Sb3VuZGVkUmVjdGFuZ2xlLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGFjdGlvbnM9e3JlbmRlckFjdGlvbnMoaXRlbSl9XG4gICAgICAgICAgICBxdWlja0xvb2s9e3sgcGF0aDogdXJsLCB0aXRsZTogaXRlbS5uYW1lIH19XG4gICAgICAgICAgICBkZXRhaWw9ezxMaXN0Lkl0ZW0uRGV0YWlsIG1hcmtkb3duPXtkZXRhaWxNYXJrZG93bn0gLz59XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgIH0pfVxuICAgIDwvTGlzdC5TZWN0aW9uPlxuICApO1xuXG4gIGlmIChpc0dyaWRWaWV3KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxHcmlkXG4gICAgICAgIGlzTG9hZGluZz17aXNMb2FkaW5nfVxuICAgICAgICBvblNlYXJjaFRleHRDaGFuZ2U9e3NldFNlYXJjaFRleHR9XG4gICAgICAgIHNlYXJjaEJhclBsYWNlaG9sZGVyPVwiU2VhcmNoIDdUViBFbW90ZXMuLi5cIlxuICAgICAgICBzZWFyY2hCYXJBY2Nlc3Nvcnk9e2FjY2Vzc29yeX1cbiAgICAgICAgY29sdW1ucz17aXNTaG93aW5nRGV0YWlsID8gNSA6IDh9XG4gICAgICAgIGZpdD17R3JpZC5GaXQuQ29udGFpbn1cbiAgICAgICAgaXNTaG93aW5nRGV0YWlsPXtpc1Nob3dpbmdEZXRhaWx9XG4gICAgICA+XG4gICAgICAgIHshc2VhcmNoVGV4dCAmJlxuICAgICAgICAgIGZhdm9yaXRlcy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgcmVuZGVyR3JpZEl0ZW1zKGZhdm9yaXRlcywgXCJTdGFycmVkIEVtb3Rlc1wiKX1cbiAgICAgICAgeyFzZWFyY2hUZXh0ICYmXG4gICAgICAgICAgaGlzdG9yeS5sZW5ndGggPiAwICYmXG4gICAgICAgICAgcmVuZGVyR3JpZEl0ZW1zKGhpc3RvcnksIFwiUmVjZW50bHkgVXNlZFwiKX1cbiAgICAgICAgeyhzZWFyY2hUZXh0IHx8IGNhdGVnb3J5LnN0YXJ0c1dpdGgoXCJUUkVORElOR1wiKSB8fCBpdGVtcy5sZW5ndGggPiAwKSAmJlxuICAgICAgICAgIHJlbmRlckdyaWRJdGVtcyhpdGVtcywgYCR7Y2F0ZWdvcnl9IFJlc3VsdHNgKX1cbiAgICAgIDwvR3JpZD5cbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8TGlzdFxuICAgICAgaXNMb2FkaW5nPXtpc0xvYWRpbmd9XG4gICAgICBvblNlYXJjaFRleHRDaGFuZ2U9e3NldFNlYXJjaFRleHR9XG4gICAgICBzZWFyY2hCYXJQbGFjZWhvbGRlcj1cIlNlYXJjaCA3VFYgRW1vdGVzLi4uXCJcbiAgICAgIHNlYXJjaEJhckFjY2Vzc29yeT17YWNjZXNzb3J5fVxuICAgICAgaXNTaG93aW5nRGV0YWlsPXtpc1Nob3dpbmdEZXRhaWx9XG4gICAgICB0aHJvdHRsZVxuICAgID5cbiAgICAgIHshc2VhcmNoVGV4dCAmJlxuICAgICAgICBmYXZvcml0ZXMubGVuZ3RoID4gMCAmJlxuICAgICAgICByZW5kZXJMaXN0SXRlbXMoZmF2b3JpdGVzLCBcIlN0YXJyZWQgRW1vdGVzXCIpfVxuICAgICAgeyFzZWFyY2hUZXh0ICYmXG4gICAgICAgIGhpc3RvcnkubGVuZ3RoID4gMCAmJlxuICAgICAgICByZW5kZXJMaXN0SXRlbXMoaGlzdG9yeSwgXCJSZWNlbnRseSBVc2VkXCIpfVxuICAgICAgeyhzZWFyY2hUZXh0IHx8IGNhdGVnb3J5LnN0YXJ0c1dpdGgoXCJUUkVORElOR1wiKSB8fCBpdGVtcy5sZW5ndGggPiAwKSAmJlxuICAgICAgICByZW5kZXJMaXN0SXRlbXMoaXRlbXMsIGAke2NhdGVnb3J5fSBSZXN1bHRzYCl9XG4gICAgPC9MaXN0PlxuICApO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBV087QUFDUCxtQkFBMkM7QUFDM0Msc0JBQTBCO0FBQzFCLGtCQUFxQjtBQUNyQixnQkFBdUI7QUFzUGY7QUFqT1IsSUFBTSxnQkFBZ0I7QUFDdEIsSUFBTSxjQUFjO0FBRUwsU0FBUixVQUEyQjtBQUNoQyxRQUFNLENBQUMsWUFBWSxhQUFhLFFBQUksdUJBQVMsRUFBRTtBQUMvQyxRQUFNLENBQUMsT0FBTyxRQUFRLFFBQUksdUJBQWtCLENBQUMsQ0FBQztBQUM5QyxRQUFNLENBQUMsV0FBVyxZQUFZLFFBQUksdUJBQWtCLENBQUMsQ0FBQztBQUN0RCxRQUFNLENBQUMsU0FBUyxVQUFVLFFBQUksdUJBQWtCLENBQUMsQ0FBQztBQUNsRCxRQUFNLENBQUMsV0FBVyxZQUFZLFFBQUksdUJBQVMsS0FBSztBQUNoRCxRQUFNLENBQUMsWUFBWSxhQUFhLFFBQUksdUJBQVMsSUFBSTtBQUNqRCxRQUFNLENBQUMsaUJBQWlCLGtCQUFrQixRQUFJLHVCQUFTLEtBQUs7QUFFNUQsUUFBTSxDQUFDLFdBQVcsWUFBWSxRQUFJLHVCQUFpQixZQUFZO0FBQy9ELFFBQU0sQ0FBQyxXQUFXLFlBQVksUUFBSSx1QkFBaUIsWUFBWTtBQUMvRCxRQUFNLENBQUMsVUFBVSxXQUFXLFFBQUksdUJBQWlCLEtBQUs7QUFHdEQsOEJBQVUsTUFBTTtBQUNkLG1CQUFl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
