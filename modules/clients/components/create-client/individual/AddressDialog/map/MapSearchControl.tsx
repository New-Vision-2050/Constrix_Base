import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

interface MapSearchControlProps {
  onLocationSelected?: (lat: string, lng: string) => void;
  position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
  style?: 'bar' | 'button';
  autoComplete?: boolean;
  autoClose?: boolean;
}

export default function MapSearchControl({
  onLocationSelected,
  position = 'topleft',
  style = 'bar',
  autoComplete = true,
  autoClose = true,
}: MapSearchControlProps) {
  const map = useMap();

  useEffect(() => {
    // Create a basic search provider
    const provider = new OpenStreetMapProvider();
    
    // Define a simple custom control without markers
    const customSearch = {
      addTo: (map: any) => {
        // Create container
        const container = L.DomUtil.create('div', 'leaflet-control leaflet-control-custom-search');
        container.style.backgroundColor = 'white';
        container.style.borderRadius = '4px';
        container.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.padding = '0';
        container.style.overflow = 'hidden';
        container.style.transition = 'all 0.3s ease';
        
        // Create search icon
        const searchIcon = document.createElement('div');
        searchIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#555" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>`;
        searchIcon.style.padding = '0 8px';
        searchIcon.style.display = 'flex';
        searchIcon.style.alignItems = 'center';
        searchIcon.style.justifyContent = 'center';
        
        // Create search input
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'ابحث عن موقع...';
        input.style.padding = '10px 8px 10px 0';
        input.style.border = 'none';
        input.style.outline = 'none';
        input.style.width = '0';
        input.style.backgroundColor = 'white';
        input.style.direction = 'rtl';
        input.style.fontFamily = 'inherit';
        input.style.fontSize = '14px';
        input.style.color = '#333';
        input.style.transition = 'width 0.3s ease';
        input.style.opacity = '0';
        input.style.cursor = 'pointer';
        
        // Create results container
        const results = document.createElement('div');
        results.className = 'search-results';
        results.style.display = 'none';
        results.style.backgroundColor = 'white';
        results.style.color = '#333';
        results.style.marginTop = '5px';
        results.style.borderRadius = '4px';
        results.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
        results.style.maxHeight = '200px';
        results.style.overflowY = 'auto';
        results.style.direction = 'rtl';
        
        // Add elements to container
        container.appendChild(searchIcon);
        container.appendChild(input);
        container.appendChild(results);
        
        // Make search icon clickable to expand/collapse search bar
        let isExpanded = false;
        searchIcon.style.cursor = 'pointer';
        
        const toggleSearch = () => {
          isExpanded = !isExpanded;
          
          if (isExpanded) {
            // Expand search
            input.style.width = '250px';
            input.style.opacity = '1';
            setTimeout(() => {
              input.focus();
            }, 300); // Wait for animation to complete
          } else {
            // Collapse search if input is empty
            if (!input.value.trim()) {
              input.style.width = '0';
              input.style.opacity = '0';
              // Hide results when collapsing
              results.style.display = 'none';
              results.innerHTML = '';
            }
          }
        };
        
        // Toggle on search icon click
        searchIcon.addEventListener('click', toggleSearch);
        
        // Handle input change
        let timeoutId: NodeJS.Timeout;
        input.addEventListener('input', (e) => {
          const value = (e.target as HTMLInputElement).value;
          clearTimeout(timeoutId);
          
          if (value.length < 3) {
            results.style.display = 'none';
            results.innerHTML = '';
            return;
          }
          
          timeoutId = setTimeout(async () => {
            try {
              const searchResults = await provider.search({ query: value });
              results.innerHTML = '';
              
              if (searchResults.length === 0) {
                results.style.display = 'block';
                const noResults = document.createElement('div');
                noResults.textContent = 'لا توجد نتائج للبحث';
                noResults.style.padding = '10px';
                results.appendChild(noResults);
                return;
              }
              
              searchResults.forEach((result) => {
                const item = document.createElement('div');
                item.textContent = result.label;
                item.style.padding = '8px 10px';
                item.style.borderBottom = '1px solid #f0f0f0';
                item.style.cursor = 'pointer';
                
                item.addEventListener('mouseover', () => {
                  item.style.backgroundColor = '#f0f0f0';
                });
                
                item.addEventListener('mouseout', () => {
                  item.style.backgroundColor = 'white';
                });
                
                item.addEventListener('click', () => {
                  if (onLocationSelected) {
                    // Extract coordinates and pass them to the handler
                    onLocationSelected(
                      result.y.toFixed(4),
                      result.x.toFixed(4)
                    );
                    
                    // Center map on result
                    map.setView([result.y, result.x], 13);
                    
                    // Hide results and clear input
                    results.style.display = 'none';
                    if (autoClose) {
                      input.value = '';
                    } else {
                      input.value = result.label;
                    }
                  }
                });
                
                results.appendChild(item);
              });
              
              results.style.display = 'block';
            } catch (error) {
              console.error('Search error:', error);
            }
          }, 500);
        });
        
        // Handle click outside to close results
        document.addEventListener('click', (e) => {
          if (!container.contains(e.target as Node)) {
            results.style.display = 'none';
          }
        });
        
        // Prevent map click events when interacting with the search
        L.DomEvent.disableClickPropagation(container);
        
        return container;
      },
    };
    
    // Create a Leaflet control using the custom search
    const searchControl = new (L.Control.extend({
      options: { position },
      onAdd: () => customSearch.addTo(map),
    }))();
    
    // Add control to map
    map.addControl(searchControl);
    
    // Highlight search box on load
    setTimeout(() => {
      const searchContainer = document.querySelector('.leaflet-control-custom-search');
      if (searchContainer) {
        searchContainer.classList.add('search-highlight');
        setTimeout(() => {
          searchContainer.classList.remove('search-highlight');
        }, 1500);
      }
    }, 1000);
    
    // Cleanup
    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onLocationSelected, position, style, autoComplete, autoClose]);

  return null;
}
