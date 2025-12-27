# Bug Fix: Infinite Loop in Auto-Parse

## Problem Description

The application was showing repeated "Parsed 1 SQL statement(s)" toast notifications in a loop, as shown in the screenshot. This was causing:

- Multiple duplicate toast notifications
- Performance issues
- Poor user experience

## Root Cause

The issue was in the `ManualInput.jsx` component's `useEffect` hook:

```javascript
// ❌ PROBLEMATIC CODE
useEffect(() => {
  if (sqlText.trim()) {
    const timeoutId = setTimeout(() => {
      onSubmit(sqlText);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }
}, [sqlText, onSubmit]); // ⚠️ onSubmit in dependencies
```

**Why this caused a loop:**

1. The `onSubmit` function is passed as a prop from the parent component (`App.jsx`)
2. In React, functions are recreated on every render unless wrapped in `useCallback`
3. Since `onSubmit` was in the dependency array, the effect would run every time the parent re-rendered
4. Each time the effect ran, it would call `onSubmit(sqlText)`
5. This would trigger a state update in the parent
6. The parent would re-render, creating a new `onSubmit` function
7. This would trigger the effect again → **infinite loop!**

## Solution

Used `useRef` to store a stable reference to the `onSubmit` callback:

```javascript
// ✅ FIXED CODE
import { useState, useEffect, useRef } from "react";

function ManualInput({ onSubmit }) {
  const [sqlText, setSqlText] = useState("");
  const onSubmitRef = useRef(onSubmit);

  // Update ref when onSubmit changes
  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  // Auto-parse when user types SQL (debounced)
  useEffect(() => {
    if (sqlText.trim()) {
      const timeoutId = setTimeout(() => {
        onSubmitRef.current(sqlText); // ✅ Use ref
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [sqlText]); // ✅ Only depend on sqlText

  // Also updated handlePaste
  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData("text");
    if (pastedText.trim()) {
      setSqlText(pastedText);
      setTimeout(() => onSubmitRef.current(pastedText), 100); // ✅ Use ref
    }
  };
}
```

## How the Fix Works

1. **`useRef` creates a stable reference** that persists across renders
2. **First `useEffect`** updates the ref whenever `onSubmit` changes (rare)
3. **Second `useEffect`** only depends on `sqlText`, not `onSubmit`
4. When `sqlText` changes, it calls `onSubmitRef.current(sqlText)`
5. The ref always points to the latest `onSubmit` function
6. **No infinite loop** because the effect doesn't re-run when parent re-renders

## Benefits of This Approach

✅ **Prevents infinite loops** - Effect only runs when `sqlText` changes  
✅ **Maintains functionality** - Still calls the latest `onSubmit` function  
✅ **Better performance** - Fewer unnecessary effect executions  
✅ **Cleaner code** - Follows React best practices

## Alternative Solutions

### Option 1: useCallback in Parent (Not Used)

```javascript
// In App.jsx
const handleManualInput = useCallback(
  async (sqlText) => {
    // ... implementation
  },
  [
    /* dependencies */
  ]
);
```

**Why not used:** Would require wrapping multiple functions in the parent component.

### Option 2: Remove Auto-Parse (Not Used)

Simply remove the auto-parse feature and require a button click.
**Why not used:** Would degrade user experience.

### Option 3: useRef (CHOSEN ✅)

Store the callback in a ref to break the dependency cycle.
**Why chosen:** Minimal changes, maintains functionality, follows best practices.

## Testing

After the fix:

- ✅ No more infinite loop
- ✅ Auto-parse works correctly (1-second debounce)
- ✅ Paste functionality works (immediate parse)
- ✅ Only one toast notification per parse
- ✅ Frontend running smoothly

## Files Modified

- `frontend/src/components/ManualInput.jsx`
  - Added `useRef` import
  - Created `onSubmitRef` to store callback
  - Updated `useEffect` dependencies
  - Updated `handlePaste` to use ref

## Lessons Learned

1. **Be careful with function dependencies in useEffect**

   - Functions are recreated on every render
   - Can cause infinite loops if not handled properly

2. **Use useRef for stable callback references**

   - Prevents unnecessary effect re-runs
   - Maintains access to latest function

3. **Always test auto-triggered effects**
   - Auto-parse, auto-save, etc. can cause loops
   - Monitor for repeated API calls or state updates

## Status

✅ **FIXED** - The infinite loop issue has been resolved and the application is working correctly.
