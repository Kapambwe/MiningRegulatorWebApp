// Leaflet.js Interop for Blazor
// Comprehensive map management system

window.leafletMaps = window.leafletMaps || {};

window.leafletInterop = {
    // Create a new map instance
    createMap: function (mapElementId, options) {
        try {
            if (typeof L === 'undefined') {
                console.error('Leaflet.js is not loaded');
                return null;
            }

            const element = document.getElementById(mapElementId);
            if (!element) {
                console.error(`Element with id '${mapElementId}' not found`);
                return null;
            }

            // Default options
            const defaultOptions = {
                center: [-13.1339, 27.8493], // Zambia coordinates
                zoom: 6,
                scrollWheelZoom: true,
                dragging: true,
                doubleClickZoom: true,
                touchZoom: true
            };

            const mapOptions = { ...defaultOptions, ...options };

            // Remove existing map if any
            if (window.leafletMaps[mapElementId]) {
                window.leafletMaps[mapElementId].remove();
            }

            // Create new map
            const map = L.map(element, {
                scrollWheelZoom: mapOptions.scrollWheelZoom,
                dragging: mapOptions.dragging,
                doubleClickZoom: mapOptions.doubleClickZoom,
                touchZoom: mapOptions.touchZoom
            }).setView(mapOptions.center, mapOptions.zoom);

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(map);

            // Store map reference
            window.leafletMaps[mapElementId] = map;

            return mapElementId;
        } catch (error) {
            console.error('Error creating map:', error);
            return null;
        }
    },

    // Add a marker to the map
    addMarker: function (mapElementId, lat, lng, popupContent, options) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            const marker = L.marker([lat, lng], options || {}).addTo(map);

            if (popupContent) {
                marker.bindPopup(popupContent);
            }

            return marker;
        } catch (error) {
            console.error('Error adding marker:', error);
        }
    },

    // Add multiple markers
    addMarkers: function (mapElementId, markers) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            const markerObjects = [];
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

                markerObjects.push(marker);
                bounds.push([lat, lng]);
            });

            // Fit map to show all markers
            if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }

            return markerObjects;
        } catch (error) {
            console.error('Error adding markers:', error);
        }
    },

    // Draw a polyline (route)
    addPolyline: function (mapElementId, latLngs, options) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            const defaultOptions = {
                color: '#3388ff',
                weight: 4,
                opacity: 0.7
            };

            const polylineOptions = { ...defaultOptions, ...options };
            const polyline = L.polyline(latLngs, polylineOptions).addTo(map);

            return polyline;
        } catch (error) {
            console.error('Error adding polyline:', error);
        }
    },

    // Draw a polygon
    addPolygon: function (mapElementId, latLngs, options) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            const defaultOptions = {
                color: '#3388ff',
                fillColor: '#3388ff',
                fillOpacity: 0.2,
                weight: 2
            };

            const polygonOptions = { ...defaultOptions, ...options };
            const polygon = L.polygon(latLngs, polygonOptions).addTo(map);

            return polygon;
        } catch (error) {
            console.error('Error adding polygon:', error);
        }
    },

    // Draw a circle
    addCircle: function (mapElementId, lat, lng, radius, options) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            const defaultOptions = {
                color: '#3388ff',
                fillColor: '#3388ff',
                fillOpacity: 0.2,
                radius: radius || 1000
            };

            const circleOptions = { ...defaultOptions, ...options };
            const circle = L.circle([lat, lng], circleOptions).addTo(map);

            return circle;
        } catch (error) {
            console.error('Error adding circle:', error);
        }
    },

    // Set map view
    setView: function (mapElementId, lat, lng, zoom) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            map.setView([lat, lng], zoom || 13);
        } catch (error) {
            console.error('Error setting view:', error);
        }
    },

    // Fit bounds
    fitBounds: function (mapElementId, bounds, padding) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            const options = padding ? { padding: [padding, padding] } : {};
            map.fitBounds(bounds, options);
        } catch (error) {
            console.error('Error fitting bounds:', error);
        }
    },

    // Clear all layers
    clearLayers: function (mapElementId) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            map.eachLayer(function (layer) {
                if (layer instanceof L.Marker || layer instanceof L.Polyline ||
                    layer instanceof L.Polygon || layer instanceof L.Circle) {
                    map.removeLayer(layer);
                }
            });
        } catch (error) {
            console.error('Error clearing layers:', error);
        }
    },

    // Remove map
    removeMap: function (mapElementId) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (map) {
                map.remove();
                delete window.leafletMaps[mapElementId];
            }
        } catch (error) {
            console.error('Error removing map:', error);
        }
    },

    // Invalidate size (useful after showing hidden map)
    invalidateSize: function (mapElementId) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            map.invalidateSize();
        } catch (error) {
            console.error('Error invalidating size:', error);
        }
    },

    // Add GeoJSON layer
    addGeoJson: function (mapElementId, geoJsonData, options) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            const geoJsonLayer = L.geoJSON(geoJsonData, options || {}).addTo(map);
            return geoJsonLayer;
        } catch (error) {
            console.error('Error adding GeoJSON:', error);
        }
    }
};

// Ensure backward compatibility with existing renderTransportMap function
// This keeps the old function working while adding new C# interop
console.log('Leaflet interop initialized');
