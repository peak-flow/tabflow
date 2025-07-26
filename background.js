// Background script for Masonry Tab Manager

// Security validation
function isValidMessage(message) {
  return (
    message &&
    typeof message === 'object' &&
    typeof message.action === 'string' &&
    message.action.length > 0 &&
    message.action.length < 100
  );
}

// Handle messages from popup and manager
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!isValidMessage(message)) {
    sendResponse({ error: 'Invalid message format' });
    return true;
  }

  switch (message.action) {
    case 'getAllWindows':
      handleGetAllWindows(sendResponse);
      break;
    case 'focusWindow':
      handleFocusWindow(message.data, sendResponse);
      break;
    case 'closeWindow':
      handleCloseWindow(message.data, sendResponse);
      break;
    case 'focusTab':
      handleFocusTab(message.data, sendResponse);
      break;
    case 'closeTab':
      handleCloseTab(message.data, sendResponse);
      break;
    case 'moveTab':
      handleMoveTab(message.data, sendResponse);
      break;
    default:
      sendResponse({ error: 'Unknown action' });
  }
  
  return true; // Keep message channel open for async response
});

async function handleGetAllWindows(sendResponse) {
  try {
    const windows = await chrome.windows.getAll({ 
      populate: true,
      windowTypes: ['normal']
    });
    
    sendResponse({ windows });
  } catch (error) {
    sendResponse({ error: error.message });
  }
}

async function handleFocusWindow(data, sendResponse) {
  try {
    if (!data.windowId || typeof data.windowId !== 'number') {
      throw new Error('Invalid window ID');
    }
    
    await chrome.windows.update(data.windowId, { focused: true });
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ error: error.message });
  }
}

async function handleCloseWindow(data, sendResponse) {
  try {
    if (!data.windowId || typeof data.windowId !== 'number') {
      throw new Error('Invalid window ID');
    }
    
    await chrome.windows.remove(data.windowId);
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ error: error.message });
  }
}

async function handleFocusTab(data, sendResponse) {
  try {
    if (!data.tabId || typeof data.tabId !== 'number') {
      throw new Error('Invalid tab ID');
    }
    
    const tab = await chrome.tabs.get(data.tabId);
    await chrome.windows.update(tab.windowId, { focused: true });
    await chrome.tabs.update(data.tabId, { active: true });
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ error: error.message });
  }
}

async function handleCloseTab(data, sendResponse) {
  try {
    if (!data.tabId || typeof data.tabId !== 'number') {
      throw new Error('Invalid tab ID');
    }
    
    await chrome.tabs.remove(data.tabId);
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ error: error.message });
  }
}

async function handleMoveTab(data, sendResponse) {
  try {
    if (!data.tabId || typeof data.tabId !== 'number' ||
        !data.windowId || typeof data.windowId !== 'number') {
      throw new Error('Invalid tab or window ID');
    }
    
    await chrome.tabs.move(data.tabId, {
      windowId: data.windowId,
      index: -1
    });
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ error: error.message });
  }
}

// Listen for tab/window changes and notify open manager pages
function notifyManagerPages(eventType, data = {}) {
  chrome.runtime.sendMessage({
    action: 'windowsUpdated',
    eventType,
    data
  }).catch(() => {
    // Ignore errors if no listeners
  });
}

// Window events
chrome.windows.onCreated.addListener(() => {
  notifyManagerPages('windowCreated');
});

chrome.windows.onRemoved.addListener(() => {
  notifyManagerPages('windowRemoved');
});

chrome.windows.onFocusChanged.addListener(() => {
  notifyManagerPages('windowFocusChanged');
});

// Tab events
chrome.tabs.onCreated.addListener(() => {
  notifyManagerPages('tabCreated');
});

chrome.tabs.onRemoved.addListener(() => {
  notifyManagerPages('tabRemoved');
});

chrome.tabs.onUpdated.addListener(() => {
  notifyManagerPages('tabUpdated');
});

chrome.tabs.onMoved.addListener((tabId, moveInfo) => {
  notifyManagerPages('tabMoved', { tabId, moveInfo });
});

chrome.tabs.onAttached.addListener((tabId, attachInfo) => {
  notifyManagerPages('tabAttached', { tabId, attachInfo });
});

chrome.tabs.onDetached.addListener((tabId, detachInfo) => {
  notifyManagerPages('tabDetached', { tabId, detachInfo });
});