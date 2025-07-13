# LocationDialog Component

## Overview
LocationDialog is a custom location selection dialog that opens when the "custom" option is selected in the location type field. It provides an interactive map interface for selecting branch locations.

## Features

### 🗺️ Interactive Map
- **Real Map**: Uses `react-leaflet` with OpenStreetMap tiles
- **Click to Select**: Click anywhere on the map to set new coordinates
- **Custom Marker**: Pink marker with white center matching the app's theme
- **Responsive**: Adapts to different screen sizes

### 🏢 Branch Management
- **Multi-Branch Support**: Switch between different branches (Riyadh, Jeddah)
- **Individual Settings**: Each branch maintains its own location data
- **Default Coordinates**: 
  - Riyadh: 24.7136, 46.6753
  - Jeddah: 21.4858, 39.1925

### ⚙️ Smart Location Handling
- **Default Location Toggle**: Checkbox to use branch's default location
- **Auto-Reset**: When default is checked, coordinates reset to branch defaults
- **Auto-Uncheck**: When coordinates are manually changed, default is unchecked
- **Map Interaction**: Clicking map updates coordinates and unchecks default

### 📍 Coordinate Input
- **Manual Entry**: Direct input fields for latitude and longitude
- **Real-time Updates**: Changes reflect immediately on the map
- **Validation**: Proper coordinate formatting

## Component Structure

```
LocationDialog/
├── LocationDialog.tsx          # Main dialog component
├── context/
│   └── LocationDialogContext.tsx  # State management
├── components/
│   ├── BranchSelector.tsx      # Branch selection buttons
│   ├── CoordinatesInput.tsx    # Lat/Lng input fields
│   ├── DefaultLocationCheckbox.tsx # Default location toggle
│   ├── DialogHeader.tsx        # Dialog title and close button
│   ├── LoadingState.tsx        # Loading spinner
│   ├── MapComponent.tsx        # Interactive map
│   ├── MapComponent.css        # Map styling
│   ├── NoDataState.tsx         # No branches message
│   └── SaveButton.tsx          # Save action button
└── README.md                   # This file
```

## Usage

The dialog automatically opens when:
1. User selects "custom" in the `location_type` field
2. Form has selected branches in the `branches` field

### State Flow
1. **Branch Selection** → Updates all location data for selected branch
2. **Coordinate Input** → Updates map position + unchecks default
3. **Map Click** → Updates coordinates + unchecks default  
4. **Default Toggle ON** → Resets to branch default coordinates
5. **Default Toggle OFF** → Keeps current coordinates

## Technical Details

### Dependencies
- `react-leaflet`: Interactive map component
- `leaflet`: Map library
- `lucide-react`: Icons
- `tailwindcss`: Styling

### Context Management
- `LocationDialogContext`: Manages branch data and state
- Form integration via `useFormInstance` and `useFormStore`
- Automatic loading states and data validation

### Styling
- Dark theme (#2A1B3D background)
- Pink accents (#ec4899) for interactive elements
- Responsive design with proper z-indexing
- Custom CSS for Leaflet map styling

## Browser Compatibility
- Modern browsers with ES6+ support
- Requires internet connection for map tiles
- Mobile-friendly touch interactions
