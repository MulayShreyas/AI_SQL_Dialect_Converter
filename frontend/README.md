# SQL Dialect Converter - Frontend

Modern React.js frontend for the SQL Dialect Converter application.

## Features

- **Drag & Drop Upload**: Easy file upload with visual feedback
- **Manual SQL Input**: Direct SQL text input with syntax highlighting
- **Real-time Conversion**: Live conversion with progress tracking
- **Beautiful UI**: Premium dark theme with smooth animations
- **Multiple Export Formats**: Download results in PDF, Word, Excel, or SQL
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Lightning-fast build tool
- **Axios**: HTTP client for API calls
- **React Dropzone**: Drag-and-drop file upload
- **Prism.js**: Syntax highlighting for SQL
- **React Icons**: Beautiful icon library
- **React Toastify**: Toast notifications

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment (Optional)

Create a `.env` file in the frontend directory if you need to change the API URL:

```env
VITE_API_URL=http://localhost:8000
```

By default, the app uses the proxy configured in `vite.config.js`.

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with hot reload.

### Build
```bash
npm run build
```
Creates an optimized production build in the `dist` folder.

### Preview
```bash
npm run preview
```
Preview the production build locally.

### Lint
```bash
npm run lint
```
Run ESLint to check code quality.

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── FileUpload.jsx
│   │   ├── ManualInput.jsx
│   │   ├── StatementPreview.jsx
│   │   └── ConversionResults.jsx
│   ├── services/        # API service layer
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── App.css          # App styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## Components

### Header
Displays the application title and subtitle with gradient styling.

### Sidebar
Configuration panel for:
- OpenRouter API key input
- Source/target dialect selection
- Output format selection
- Supported formats info

### FileUpload
Drag-and-drop file upload component supporting:
- PDF files
- SQL files (.sql, .txt)
- Excel files (.xlsx, .xls)

### ManualInput
Text area for manual SQL input with:
- Syntax highlighting
- Keyboard shortcuts (Ctrl+Enter to parse)
- Parse button

### StatementPreview
Displays extracted SQL statements with:
- Collapsible items
- Syntax highlighting
- Statement count

### ConversionResults
Shows conversion results with:
- Success/error metrics
- Side-by-side comparison
- Syntax highlighting
- Export buttons for all formats

## Styling

The app uses a **premium dark theme** with:
- Custom CSS variables for easy theming
- Gradient effects and animations
- Smooth transitions and hover effects
- Responsive design for all screen sizes
- Custom scrollbars
- Toast notifications

### Color Palette
- Primary: `#667eea` to `#764ba2` (gradient)
- Background: `#0f0f23`
- Surface: `#1a1a2e` / `#25253a`
- Success: `#10b981`
- Error: `#ef4444`
- Warning: `#f59e0b`

### Typography
- **Body**: Inter (Google Fonts)
- **Code**: JetBrains Mono (Google Fonts)

## API Integration

The frontend communicates with the FastAPI backend through the API service layer (`src/services/api.js`).

### API Methods

- `getDialects()`: Fetch supported dialects
- `getFormats()`: Fetch supported output formats
- `parseFile(file)`: Parse uploaded file
- `parseSQL(sqlText)`: Parse manual SQL input
- `convertSQL(...)`: Convert SQL statements
- `exportResults(...)`: Export results to file
- `validateAPIKey(apiKey)`: Validate API key

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: `http://localhost:8000`)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

### Hot Reload
Vite provides instant hot module replacement (HMR). Changes to components will reflect immediately.

### Component Development
Each component is self-contained with its own CSS file for better maintainability.

### State Management
The app uses React hooks (`useState`, `useEffect`) for state management. For larger apps, consider adding Redux or Zustand.

### API Calls
All API calls go through the centralized `api.js` service for consistency and error handling.

## Troubleshooting

### Port Already in Use
Change the port in `vite.config.js`:
```js
server: {
  port: 3001,
  // ...
}
```

### API Connection Issues
1. Ensure the backend is running on `http://localhost:8000`
2. Check CORS settings in the backend
3. Verify the proxy configuration in `vite.config.js`

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Styling Issues
- Clear browser cache
- Check for CSS conflicts
- Ensure all CSS files are imported

## Performance Optimization

### Production Build
The production build is optimized with:
- Code splitting
- Tree shaking
- Minification
- Asset optimization

### Lazy Loading
Consider implementing lazy loading for components:
```jsx
const ConversionResults = lazy(() => import('./components/ConversionResults'));
```

## Accessibility

The app includes:
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators

## Future Enhancements

- [ ] Dark/Light theme toggle
- [ ] User authentication
- [ ] Conversion history
- [ ] Batch file processing
- [ ] Real-time collaboration
- [ ] Custom dialect configurations

## License

MIT License - See LICENSE file for details
