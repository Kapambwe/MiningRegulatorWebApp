// Download helper functions for Blazor file downloads
// Converts base64 data to downloadable files

// Export downloadFile function
export function downloadFile(fileName, base64Content, contentType) {
    try {
        // Decode base64 string
        const byteCharacters = atob(base64Content);
        const byteArrays = [];

        // Convert to byte arrays
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            byteArrays.push(new Uint8Array(byteNumbers));
        }

        // Create blob and download
        const blob = new Blob(byteArrays, { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log(`File download initiated: ${fileName}`);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
};

// Export downloadFileFromUrl function
export function downloadFileFromUrl(fileName, url) {
    try {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        console.log(`File download initiated: ${fileName}`);
    } catch (error) {
        console.error('Error downloading file from URL:', error);
    }
};

// Export downloadTextFile function
export function downloadTextFile(fileName, textContent, mimeType) {
    try {
        const blob = new Blob([textContent], { type: mimeType || 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log(`Text file download initiated: ${fileName}`);
    } catch (error) {
        console.error('Error downloading text file:', error);
    }
};

// Attach to window for backward compatibility
window.downloadFile = downloadFile;
window.downloadFileFromUrl = downloadFileFromUrl;
window.downloadTextFile = downloadTextFile;

console.log('Download helper functions initialized');
