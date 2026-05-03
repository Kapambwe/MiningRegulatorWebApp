// Camera and GPS Interop for Mining Inspections
// Provides device integration for field operations

window.cameraGpsInterop = {
    currentStream: null,
    videoElement: null,

    // Initialize camera
    initializeCamera: async function (videoElementId, facingMode = 'environment') {
        try {
            this.videoElement = document.getElementById(videoElementId);
            if (!this.videoElement) {
                console.error('Video element not found:', videoElementId);
                return { success: false, error: 'Video element not found' };
            }

            // Stop existing stream if any
            if (this.currentStream) {
                this.stopCamera();
            }

            const constraints = {
                video: {
                    facingMode: facingMode, // 'user' for front camera, 'environment' for back camera
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                },
                audio: false
            };

            this.currentStream = await navigator.mediaDevices.getUserMedia(constraints);
            this.videoElement.srcObject = this.currentStream;
            await this.videoElement.play();

            return { 
                success: true, 
                message: 'Camera initialized successfully',
                width: this.videoElement.videoWidth,
                height: this.videoElement.videoHeight
            };
        } catch (error) {
            console.error('Error initializing camera:', error);
            return { 
                success: false, 
                error: error.message || 'Failed to access camera'
            };
        }
    },

    // Capture photo from camera
    capturePhoto: function (videoElementId, canvasElementId) {
        try {
            const video = document.getElementById(videoElementId);
            const canvas = document.getElementById(canvasElementId);
            
            if (!video || !canvas) {
                return { success: false, error: 'Video or canvas element not found' };
            }

            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/jpeg', 0.9);
            
            return {
                success: true,
                imageData: imageData,
                width: canvas.width,
                height: canvas.height,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error capturing photo:', error);
            return { success: false, error: error.message };
        }
    },

    // Stop camera
    stopCamera: function () {
        try {
            if (this.currentStream) {
                this.currentStream.getTracks().forEach(track => track.stop());
                this.currentStream = null;
            }
            if (this.videoElement) {
                this.videoElement.srcObject = null;
            }
            return { success: true, message: 'Camera stopped' };
        } catch (error) {
            console.error('Error stopping camera:', error);
            return { success: false, error: error.message };
        }
    },

    // Get current GPS position
    getCurrentPosition: function () {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject({ success: false, error: 'Geolocation not supported' });
                return;
            }

            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        success: true,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        altitudeAccuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        speed: position.coords.speed,
                        timestamp: new Date(position.timestamp).toISOString()
                    });
                },
                (error) => {
                    reject({
                        success: false,
                        error: error.message,
                        code: error.code
                    });
                },
                options
            );
        });
    },

    // Watch GPS position (for tracking)
    watchPosition: function (dotNetHelper, callbackMethodName) {
        if (!navigator.geolocation) {
            return { success: false, error: 'Geolocation not supported' };
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const positionData = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    timestamp: new Date(position.timestamp).toISOString()
                };
                
                if (dotNetHelper && callbackMethodName) {
                    dotNetHelper.invokeMethodAsync(callbackMethodName, positionData);
                }
            },
            (error) => {
                console.error('GPS watch error:', error);
                if (dotNetHelper && callbackMethodName) {
                    dotNetHelper.invokeMethodAsync(callbackMethodName, {
                        error: error.message,
                        code: error.code
                    });
                }
            },
            options
        );

        return { success: true, watchId: watchId };
    },

    // Clear GPS watch
    clearWatch: function (watchId) {
        try {
            if (navigator.geolocation && watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
            return { success: true, message: 'Watch cleared' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get device orientation (for compass)
    getDeviceOrientation: function (dotNetHelper, callbackMethodName) {
        if (!window.DeviceOrientationEvent) {
            return { success: false, error: 'Device orientation not supported' };
        }

        const handler = (event) => {
            const orientationData = {
                alpha: event.alpha, // 0-360 degrees (compass direction)
                beta: event.beta,   // -180 to 180 degrees (front-to-back tilt)
                gamma: event.gamma, // -90 to 90 degrees (left-to-right tilt)
                absolute: event.absolute
            };

            if (dotNetHelper && callbackMethodName) {
                dotNetHelper.invokeMethodAsync(callbackMethodName, orientationData);
            }
        };

        window.addEventListener('deviceorientation', handler);
        
        return { 
            success: true, 
            message: 'Orientation tracking started',
            handler: handler
        };
    },

    // Request device orientation permission (iOS 13+)
    requestOrientationPermission: async function () {
        if (typeof DeviceOrientationEvent !== 'undefined' && 
            typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                return { 
                    success: permission === 'granted',
                    permission: permission 
                };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
        // Permission not needed for most devices
        return { success: true, message: 'Permission not required' };
    },

    // Calculate distance between two GPS coordinates (Haversine formula)
    calculateDistance: function (lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Distance in meters

        return {
            success: true,
            distance: distance,
            distanceKm: distance / 1000,
            distanceMiles: distance / 1609.344
        };
    }
};
