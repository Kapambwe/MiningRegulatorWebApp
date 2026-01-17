// Transport Route Map Rendering using Leaflet.js
// This function renders a transport route map with checkpoints

window.renderTransportMap = function (mapElement, checkpoints, truckNumber) {
    try {
        // Validate mapElement
        if (!mapElement) {
            console.error('Map element is null or undefined');
            return;
        }

        // Check if Leaflet is loaded
        if (typeof L === 'undefined') {
            console.warn('Leaflet.js not loaded. Using fallback map rendering.');
            renderFallbackMap(mapElement, checkpoints, truckNumber);
            return;
        }

        // Clear existing map if any
        if (mapElement._leaflet_map) {
            mapElement._leaflet_map.remove();
        }

        // Initialize map centered on first checkpoint or default location (Zambia)
        const defaultLat = checkpoints && checkpoints.length > 0 ? checkpoints[0].Latitude : -13.1339;
        const defaultLng = checkpoints && checkpoints.length > 0 ? checkpoints[0].Longitude : 27.8493;

        const map = L.map(mapElement).setView([defaultLat, defaultLng], 10);
        mapElement._leaflet_map = map;

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);

        // Add markers for each checkpoint
        const markers = [];
        const latLngs = [];

        if (checkpoints && checkpoints.length > 0) {
            checkpoints.forEach((checkpoint, index) => {
                // Skip checkpoints with invalid coordinates
                if (checkpoint.Latitude == null || checkpoint.Longitude == null) {
                    console.warn(`Checkpoint ${index + 1} has invalid coordinates, skipping.`);
                    return;
                }

                const latLng = [checkpoint.Latitude, checkpoint.Longitude];
                latLngs.push(latLng);

                // Create marker with popup
                const marker = L.marker(latLng).addTo(map);
                const locationName = checkpoint.LocationName || `Checkpoint ${index + 1}`;
                marker.bindPopup(`
                    <strong>${locationName}</strong><br>
                    Checkpoint ${index + 1}<br>
                    Truck: ${truckNumber}
                `);

                markers.push(marker);
            });

            // Draw polyline connecting checkpoints
            if (latLngs.length > 1) {
                L.polyline(latLngs, {
                    color: '#2563eb',
                    weight: 4,
                    opacity: 0.7
                }).addTo(map);
            }

            // Fit map bounds to show all markers
            if (latLngs.length > 0) {
                const bounds = L.latLngBounds(latLngs);
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        } else {
            // No checkpoints, show default message
            L.marker([defaultLat, defaultLng]).addTo(map)
                .bindPopup('<strong>No route data available</strong>')
                .openPopup();
        }

    } catch (error) {
        console.error('Error rendering transport map:', error);
        renderFallbackMap(mapElement, checkpoints, truckNumber);
    }
};

// Fallback map rendering without Leaflet (simple visualization)
function renderFallbackMap(mapElement, checkpoints, truckNumber) {
    try {
        // Validate mapElement
        if (!mapElement) {
            console.error('Map element is null or undefined in fallback renderer');
            return;
        }

        // Clear existing content
        mapElement.innerHTML = '';

        // Create fallback visualization
        const container = document.createElement('div');
        container.style.cssText = 'width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 8px;';

        const title = document.createElement('h4');
        title.textContent = `Transport Route - ${truckNumber}`;
        title.style.cssText = 'color: #1f2937; margin-bottom: 20px;';
        container.appendChild(title);

        if (checkpoints && checkpoints.length > 0) {
            const routeContainer = document.createElement('div');
            routeContainer.style.cssText = 'display: flex; flex-direction: column; gap: 15px; max-width: 600px; width: 100%; padding: 20px;';

            checkpoints.forEach((checkpoint, index) => {
                const checkpointDiv = document.createElement('div');
                checkpointDiv.style.cssText = 'background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 15px;';

                const numberCircle = document.createElement('div');
                numberCircle.textContent = index + 1;
                numberCircle.style.cssText = 'width: 40px; height: 40px; border-radius: 50%; background: #2563eb; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;';

                const info = document.createElement('div');
                const lat = checkpoint.Latitude != null ? checkpoint.Latitude.toFixed(4) : 'N/A';
                const lng = checkpoint.Longitude != null ? checkpoint.Longitude.toFixed(4) : 'N/A';
                const locationName = checkpoint.LocationName || 'Unknown Location';

                info.innerHTML = `
                    <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">${locationName}</div>
                    <div style="font-size: 0.875rem; color: #6b7280;">Lat: ${lat}, Lng: ${lng}</div>
                `;

                checkpointDiv.appendChild(numberCircle);
                checkpointDiv.appendChild(info);

                routeContainer.appendChild(checkpointDiv);

                // Add connector line between checkpoints
                if (index < checkpoints.length - 1) {
                    const connector = document.createElement('div');
                    connector.style.cssText = 'width: 2px; height: 15px; background: #9ca3af; margin-left: 20px;';
                    routeContainer.appendChild(connector);
                }
            });

            container.appendChild(routeContainer);
        } else {
            const noData = document.createElement('p');
            noData.textContent = 'No route data available';
            noData.style.cssText = 'color: #6b7280; font-size: 1rem;';
            container.appendChild(noData);
        }

        const note = document.createElement('p');
        note.innerHTML = '<em>Note: Install Leaflet.js for interactive map visualization</em>';
        note.style.cssText = 'color: #9ca3af; font-size: 0.875rem; margin-top: 20px;';
        container.appendChild(note);

        mapElement.appendChild(container);
    } catch (error) {
        console.error('Error in fallback map rendering:', error);
    }
}
