# TabFlow

A Chrome extension for managing browser windows and tabs with a beautiful masonry layout interface.

## Features

- **Masonry Layout**: Tabs and windows displayed in a Pinterest-style masonry grid that efficiently uses screen space
- **Window Management**: View all open windows and tabs in one place
- **Drag & Drop**: Move tabs between windows with intuitive drag and drop
- **Bulk Operations**: Select multiple tabs and move them to a new window
- **Domain Grouping**: Group tabs by domain for better organization
- **Search**: Quickly find tabs by URL
- **Multiple View Modes**: 
  - Masonry (default) - Column-based layout
  - List - Single column view
  - Full Masonry - Uses full screen width
- **View Sizes**: Normal, Compact, and Ultra-compact modes

## Architecture

### Core Components

#### 1. **Background Service Worker** (`background.js`)
- Handles all Chrome API interactions
- Implements secure message passing between extension components
- Manages window and tab operations (create, close, move, focus)
- Validates all incoming messages for security

#### 2. **Popup Interface** (`popup.html`, `popup.js`, `popup.css`)
- Quick access view from the extension icon
- Shows all windows with their tabs
- Allows quick focusing and closing of windows/tabs
- Links to full manager interface

#### 3. **Manager Interface** (`manager.html`, `manager.js`, `manager.css`)
- Full-featured tab management interface
- Implements the `WindowManager` class that handles:
  - Window and tab rendering
  - Drag and drop functionality
  - Search and filtering
  - Bulk selections
  - Domain grouping
  - View mode switching

#### 4. **Masonry Layout Engine** (`masonry-layout.js`)
- JavaScript-based layout system (avoids CSP violations)
- Calculates optimal column placement
- Responsive column count based on viewport
- Debounced resize handling
- Mutation observer for dynamic content

### Data Flow

1. **Chrome APIs → Background Script**
   - All Chrome API calls go through the background service worker
   - Ensures consistent error handling and security

2. **Background Script ↔ UI Components**
   - Secure message passing using Chrome runtime messaging
   - All messages validated before processing
   - Async/await pattern for clean error handling

3. **UI State Management**
   - WindowManager class maintains UI state
   - Real-time updates via Chrome event listeners
   - Optimistic UI updates with rollback on error

### Security Features

- **Input Validation**: All user inputs sanitized and validated
- **Message Validation**: Background script validates all incoming messages
- **Content Security Policy**: No inline scripts, all JavaScript in separate files
- **HTML Escaping**: All dynamic content properly escaped to prevent XSS

### Key Design Decisions

1. **Masonry Layout**: Uses absolute positioning with JavaScript calculations instead of CSS Grid/Flexbox to achieve true masonry effect

2. **Domain Grouping**: Tabs grouped by domain when enabled, with collapsible sections and bulk actions per domain

3. **Drag & Drop**: Native HTML5 drag and drop API with visual feedback and drop zones

4. **Performance**: Debounced operations, efficient DOM updates, and lazy loading for large tab counts

## File Structure

```
tabflow/
├── manifest.json          # Extension manifest (Manifest V3)
├── background.js          # Service worker for Chrome API operations
├── popup.html            # Popup interface HTML
├── popup.js              # Popup interface logic
├── popup.css             # Popup interface styles
├── manager.html          # Full manager interface HTML
├── manager.js            # Manager interface logic (WindowManager class)
├── manager.css           # Manager interface styles
├── masonry-layout.js     # Masonry layout calculations
└── assets/
    └── icons/            # Extension icons (16x16 to 128x128)
```

## Development

The extension uses vanilla JavaScript with no build process required. Simply load the unpacked extension in Chrome to test changes.

### Chrome APIs Used

- `chrome.tabs.*` - Tab management
- `chrome.windows.*` - Window management
- `chrome.runtime.*` - Extension messaging
- `chrome.storage.*` - Preference storage (prepared for future use)

### Browser Compatibility

- Chrome/Chromium browsers with Manifest V3 support
- Requires Chrome 88+ for full feature support