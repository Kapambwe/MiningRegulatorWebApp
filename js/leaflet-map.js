// Leaflet.js Interop Module for Blazor
// Modern ES6 exports for JS isolation

// Store layer groups for easy management
const maps = {};
const layerGroups = {};
const baseMaps = {};

// Create a new map instance with advanced options
export function createMap(mapElementId, options) {
    try {
        if (typeof L === 'undefined') {
            console.error('Leaflet.js is not loaded');
            return null;
        }

        const element = document.getElementById(mapElementId);
        if (!element) return null;

        // Default options
        const defaultOptions = {
            center: [-13.1339, 27.8493], // Zambia
            zoom: 6,
            scrollWheelZoom: true,
            zoomControl: true,
            attributionControl: true
        };

        const mapOptions = { ...defaultOptions, ...options };

        if (maps[mapElementId]) {
            maps[mapElementId].remove();
        }

        const map = L.map(element, mapOptions).setView(mapOptions.center, mapOptions.zoom);

        // Define Base Maps
        const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        });

        const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles © Esri'
        });

        const terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenTopoMap'
        });

        // Add default base map
        osm.addTo(map);

        // Store for layer control
        baseMaps[mapElementId] = {
            "Streets": osm,
            "Satellite": satellite,
            "Terrain": terrain
        };

        // Initialize Layer Control
        L.control.layers(baseMaps[mapElementId]).addTo(map);
        
        // Add Scale
        L.control.scale().addTo(map);

        maps[mapElementId] = map;
        layerGroups[mapElementId] = {};

        return mapElementId;
    } catch (error) {
        console.error('Error creating map:', error);
        return null;
    }
}

// Add a specific layer group
export function createLayerGroup(mapId, groupName) {
    const map = maps[mapId];
    if (!map) return;
    
    if (layerGroups[mapId][groupName]) {
        map.removeLayer(layerGroups[mapId][groupName]);
    }
    
    const group = L.layerGroup().addTo(map);
    layerGroups[mapId][groupName] = group;
}

// Clear a specific layer group
export function clearLayerGroup(mapId, groupName) {
    if (layerGroups[mapId] && layerGroups[mapId][groupName]) {
        layerGroups[mapId][groupName].clearLayers();
    }
}

// Advanced GeoJSON rendering with styles and interaction
export function addGeoJson(mapId, groupName, data, style, popupTemplate) {
    const map = maps[mapId];
    if (!map) return;
    
    const group = layerGroups[mapId][groupName] || map;

    const geoLayer = L.geoJSON(data, {
        style: style || {
            color: "#3388ff",
            weight: 2,
            opacity: 0.65,
            fillOpacity: 0.2
        },
        onEachFeature: (feature, layer) => {
            if (popupTemplate && feature.properties) {
                let popupContent = popupTemplate;
                for (const key in feature.properties) {
                    popupContent = popupContent.replace(`{${key}}`, feature.properties[key]);
                }
                layer.bindPopup(popupContent);
            }
            
            layer.on({
                mouseover: (e) => {
                    const l = e.target;
                    l.setStyle({ fillOpacity: 0.5, weight: 3 });
                },
                mouseout: (e) => {
                    geoLayer.resetStyle(e.target);
                },
                click: (e) => {
                    map.fitBounds(e.target.getBounds());
                }
            });
        }
    }).addTo(group);
    
    return true;
}

// Add markers to a specific group
export function addMarkersToGroup(mapId, groupName, markers) {
    const map = maps[mapId];
    if (!map) return;
    
    const group = layerGroups[mapId][groupName] || map;

    markers.forEach(m => {
        const marker = L.marker([m.lat, m.lng]);
        if (m.popup) marker.bindPopup(m.popup);
        marker.addTo(group);
    });
}

// Add a marker to the map
export function addMarker(mapElementId, lat, lng, popupContent, options) {
    try {
        const map = maps[mapElementId];
        if (!map) return;

        const marker = L.marker([lat, lng], options || {}).addTo(map);

        if (popupContent) {
            marker.bindPopup(popupContent);
        }

        return true;
    } catch (error) {
        console.error('Error adding marker:', error);
        return false;
    }
}

// Add multiple markers
export function addMarkers(mapElementId, markers) {
    try {
        const map = maps[mapElementId];
        if (!map) return;

        const bounds = [];

        markers.forEach(markerData => {
            const { lat, lng, popup, iconUrl } = markerData;

            let markerOptions = {};
            if (iconUrl) {
                const customIcon = L.icon({
                    iconUrl: iconUrl,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                });
                markerOptions.icon = customIcon;
            }

            const marker = L.marker([lat, lng], markerOptions).addTo(map);

            if (popup) {
                marker.bindPopup(popup);
            }

            bounds.push([lat, lng]);
        });

        // Fit map to show all markers
        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }

        return true;
    } catch (error) {
        console.error('Error adding markers:', error);
        return false;
    }
}

// Draw a polyline
export function addPolyline(mapElementId, latLngs, options) {
    try {
        const map = maps[mapElementId];
        if (!map) return;

        L.polyline(latLngs, options || {}).addTo(map);
        return true;
    } catch (error) {
        console.error('Error adding polyline:', error);
        return false;
    }
}

// Draw a polygon
export function addPolygon(mapElementId, latLngs, options) {
    try {
        const map = maps[mapElementId];
        if (!map) return;

        L.polygon(latLngs, options || {}).addTo(map);
        return true;
    } catch (error) {
        console.error('Error adding polygon:', error);
        return false;
    }
}

// Draw a circle
export function addCircle(mapElementId, lat, lng, radius, options) {
    try {
        const map = maps[mapElementId];
        if (!map) return;

        L.circle([lat, lng], { radius: radius, ...options }).addTo(map);
        return true;
    } catch (error) {
        console.error('Error adding circle:', error);
        return false;
    }
}

// Set map view
export function setView(mapElementId, lat, lng, zoom) {
    try {
        const map = maps[mapElementId];
        if (!map) return;
        map.setView([lat, lng], zoom || 13);
    } catch (error) {
        console.error('Error setting view:', error);
    }
}

// Fit bounds
export function fitBounds(mapElementId, bounds, padding) {
    try {
        const map = maps[mapElementId];
        if (!map) return;
        map.fitBounds(bounds, padding ? { padding: [padding, padding] } : {});
    } catch (error) {
        console.error('Error fitting bounds:', error);
    }
}

// Clear all relevant layers
export function clearLayers(mapElementId) {
    try {
        const map = maps[mapElementId];
        if (!map) return;

        map.eachLayer(function (layer) {
            if (layer instanceof L.Marker || layer instanceof L.Polyline ||
                layer instanceof L.Polygon || layer instanceof L.Circle) {
                map.removeLayer(layer);
            }
        });
    } catch (error) {
        console.error('Error clearing layers:', error);
    }
}

// Remove map
export function removeMap(mapElementId) {
    try {
        const map = maps[mapElementId];
        if (map) {
            map.remove();
            delete maps[mapElementId];
        }
    } catch (error) {
        console.error('Error removing map:', error);
    }
}

// Invalidate size
export function invalidateSize(mapElementId) {
    try {
        const map = maps[mapElementId];
        if (map) map.invalidateSize();
    } catch (error) {
        console.error('Error invalidating size:', error);
    }
}

// Get map bounds
export function getBounds(mapElementId) {
    try {
        const map = maps[mapElementId];
        if (!map) return null;

        const bounds = map.getBounds();
        return {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest()
        };
    } catch (error) {
        console.error('Error getting bounds:', error);
        return null;
    }
}

// Get map center
export function getCenter(mapElementId) {
    try {
        const map = maps[mapElementId];
        if (!map) return null;

        const center = map.getCenter();
        return {
            lat: center.lat,
            lng: center.lng
        };
    } catch (error) {
        console.error('Error getting center:', error);
        return null;
    }
}

// Get current zoom level
export function getZoom(mapElementId) {
    try {
        const map = maps[mapElementId];
        return map ? map.getZoom() : null;
    } catch (error) {
        console.error('Error getting zoom:', error);
        return null;
    }
}

// Specialized function for rendering transport routes
export function renderTransportMap(element, checkpoints, title) {
    try {
        if (!element) return;
        
        // Use element id if it's an element, or the element itself if it has an id
        const mapId = element.id || 'transport-map-' + Math.random().toString(36).substr(2, 9);
        if (!element.id) element.id = mapId;

        // Create map if it doesn't exist
        const map = createMap(mapId, {
            center: [checkpoints[0].latitude, checkpoints[0].longitude],
            zoom: 8
        });

        if (!map) return;

        const latLngs = [];
        const leafletMap = maps[mapId];

        checkpoints.forEach((cp, index) => {
            const pos = [cp.latitude, cp.longitude];
            latLngs.push(pos);

            const iconColor = cp.status === 'Completed' ? 'green' : cp.status === 'Delayed' ? 'red' : 'blue';
            const marker = L.marker(pos).addTo(leafletMap);
            marker.bindPopup(`<b>${cp.locationName}</b><br>Status: ${cp.status}<br>Order: ${index + 1}`);
        });

        // Draw the route line
        if (latLngs.length > 1) {
            L.polyline(latLngs, { color: 'blue', weight: 3, opacity: 0.5, dashArray: '10, 10' }).addTo(leafletMap);
            leafletMap.fitBounds(latLngs, { padding: [50, 50] });
        }

        return mapId;
    } catch (error) {
        console.error('Error rendering transport map:', error);
    }
}
