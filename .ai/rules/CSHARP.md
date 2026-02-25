# SOM Standard — C# Standards

> **Last Updated**: 2026-02-18
> **Applies To**: Rhino Plugin, Grasshopper Components, .NET Development

---

## C# Standards

### Naming
- **Namespaces**: `[Project].Core`, `[Project].UI`
- **Classes**: PascalCase, one per file.
- **Methods**: PascalCase.
- **Private fields**: `_camelCase`.
- **Filenames**: PascalCase (No spaces).

### Architecture Pattern (Webview Bridge)
- **Core**: Shared logic in a Core library.
- **UI**: WebView2 handling in a UI library.
- **Bridge**: `webView.CoreWebView2.PostWebMessageAsString(json)` for C# -> JS.
- **Format**: `{ "type": "...", "payload": { ... } }`.
- **Error Handling**: Always wrap WebView2 interface calls in try-catch.
