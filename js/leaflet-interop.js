// Leaflet.js Interop for Blazor
// Comprehensive map management system

// Initialize global storage for map instances
window.leafletMaps = window.leafletMaps || {};

// Export leafletInterop as a module
export const leafletInterop = {
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

            // Add tile layer - use custom URL if provided, otherwise default to OpenStreetMap
            const tileLayerUrl = mapOptions.tileLayerUrl || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            const tileLayerAttribution = mapOptions.tileLayerUrl ? 
                '&copy; Map data providers' : 
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
            
            L.tileLayer(tileLayerUrl, {
                attribution: tileLayerAttribution,
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
    },

    // Add tile layer (for switching base maps)
    addTileLayer: function (mapElementId, tileUrl, options) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            const defaultOptions = {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 19
            };

            const tileOptions = { ...defaultOptions, ...options };
            L.tileLayer(tileUrl, tileOptions).addTo(map);
        } catch (error) {
            console.error('Error adding tile layer:', error);
        }
    },

    // Add WMS layer (for specialized map services)
    addWMSLayer: function (mapElementId, url, options) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            L.tileLayer.wms(url, options || {}).addTo(map);
        } catch (error) {
            console.error('Error adding WMS layer:', error);
        }
    },

    // Add rectangle (for area selection)
    addRectangle: function (mapElementId, bounds, options) {
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

            const rectOptions = { ...defaultOptions, ...options };
            const rectangle = L.rectangle(bounds, rectOptions).addTo(map);

            return rectangle;
        } catch (error) {
            console.error('Error adding rectangle:', error);
        }
    },

    // Measure distance between two points
    measureDistance: function (lat1, lng1, lat2, lng2) {
        try {
            const point1 = L.latLng(lat1, lng1);
            const point2 = L.latLng(lat2, lng2);
            return point1.distanceTo(point2); // Returns distance in meters
        } catch (error) {
            console.error('Error measuring distance:', error);
            return 0;
        }
    },

    // Calculate polygon area
    calculatePolygonArea: function (latLngs) {
        try {
            const polygon = L.polygon(latLngs);
            const area = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]);
            return area; // Returns area in square meters
        } catch (error) {
            console.error('Error calculating area:', error);
            return 0;
        }
    },

    // Get map bounds
    getBounds: function (mapElementId) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return null;
            }

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
    },

    // Get map center
    getCenter: function (mapElementId) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return null;
            }

            const center = map.getCenter();
            return {
                lat: center.lat,
                lng: center.lng
            };
        } catch (error) {
            console.error('Error getting center:', error);
            return null;
        }
    },

    // Get current zoom level
    getZoom: function (mapElementId) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return null;
            }

            return map.getZoom();
        } catch (error) {
            console.error('Error getting zoom:', error);
            return null;
        }
    },

    // Add scale control
    addScaleControl: function (mapElementId, options) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            const defaultOptions = {
                metric: true,
                imperial: false,
                position: 'bottomleft'
            };

            const scaleOptions = { ...defaultOptions, ...options };
            L.control.scale(scaleOptions).addTo(map);
        } catch (error) {
            console.error('Error adding scale control:', error);
        }
    },

    // Add custom control
    addCustomControl: function (mapElementId, html, position) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            const CustomControl = L.Control.extend({
                onAdd: function () {
                    const div = L.DomUtil.create('div', 'custom-control');
                    div.innerHTML = html;
                    return div;
                }
            });

            new CustomControl({ position: position || 'topleft' }).addTo(map);
        } catch (error) {
            console.error('Error adding custom control:', error);
        }
    },

    // Pan to location with animation
    panTo: function (mapElementId, lat, lng, options) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            map.panTo([lat, lng], options || { animate: true });
        } catch (error) {
            console.error('Error panning to location:', error);
        }
    },

    // Fly to location with animation
    flyTo: function (mapElementId, lat, lng, zoom, options) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            const defaultOptions = {
                duration: 2,
                easeLinearity: 0.25
            };

            const flyOptions = { ...defaultOptions, ...options };
            map.flyTo([lat, lng], zoom || 13, flyOptions);
        } catch (error) {
            console.error('Error flying to location:', error);
        }
    },

    // Add layer group for organized layer management
    createLayerGroup: function (mapElementId, layerGroupId) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            if (!window.leafletLayerGroups) {
                window.leafletLayerGroups = {};
            }

            const layerGroup = L.layerGroup().addTo(map);
            window.leafletLayerGroups[layerGroupId] = layerGroup;
        } catch (error) {
            console.error('Error creating layer group:', error);
        }
    },

    // Remove layer group
    removeLayerGroup: function (mapElementId, layerGroupId) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map || !window.leafletLayerGroups || !window.leafletLayerGroups[layerGroupId]) {
                return;
            }

            map.removeLayer(window.leafletLayerGroups[layerGroupId]);
            delete window.leafletLayerGroups[layerGroupId];
        } catch (error) {
            console.error('Error removing layer group:', error);
        }
    },

    // Add popup at location
    addPopup: function (mapElementId, lat, lng, content, options) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            L.popup(options || {})
                .setLatLng([lat, lng])
                .setContent(content)
                .openOn(map);
        } catch (error) {
            console.error('Error adding popup:', error);
        }
    },

    // Close all popups
    closePopups: function (mapElementId) {
        try {
            const map = window.leafletMaps[mapElementId];
            if (!map) {
                console.error(`Map '${mapElementId}' not found`);
                return;
            }

            map.closePopup();
        } catch (error) {
            console.error('Error closing popups:', error);
        }
    },

    // Check if point is inside polygon
    isPointInPolygon: function (lat, lng, polygonLatLngs) {
        try {
            const point = L.latLng(lat, lng);
            const polygon = L.polygon(polygonLatLngs);
            
            // Simple ray-casting algorithm
            const vs = polygonLatLngs;
            let inside = false;
            
            for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                const xi = vs[i][0], yi = vs[i][1];
                const xj = vs[j][0], yj = vs[j][1];
                
                const intersect = ((yi > lng) !== (yj > lng))
                    && (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            
            return inside;
        } catch (error) {
            console.error('Error checking point in polygon:', error);
            return false;
        }
    }
};

// Also attach to window for backward compatibility
window.leafletInterop = leafletInterop;

// Ensure backward compatibility with existing renderTransportMap function
// This keeps the old function working while adding new C# interop
console.log('Leaflet interop initialized with enhanced GIS features');
