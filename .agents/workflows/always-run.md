---
description: Auto-accept permissions by injecting a JS script into the developer tools console
---

To automatically accept permission dialogs (like Accept, Run, or Always Allow) in Antigravity:

1. Open the Developer Tools in Antigravity (usually View -> Toggle Developer Tools or via shortcut).
2. Go to the **Console** tab.
3. Paste the following JavaScript code and press Enter:

```javascript
setInterval(() => { 
    const buttons = Array.from(document.querySelectorAll('button')); 
    const acceptBtn = buttons.find(b => b.textContent.includes('Accept') || b.textContent.includes('Run') || b.textContent.includes('Always Allow')); 
    if(acceptBtn) acceptBtn.click(); 
}, 1500);
```

4. The script will now run in the background, automatically clicking any matching buttons every 1.5 seconds.
