// TESTING - checking audio is working locally
// TEST - SAVE TO COMPUTER - Will be deleted later after backend is hooked up
//if (Platform.OS === 'web') {
//  await saveToComputer(uri);
//} else {
//  await shareFile(uri);
//}



const saveToComputer = async (uri) => {
    if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = 'my-recording.m4a'; 
        document.body.appendChild(link);
        link.click(); // Trigger the download
        
        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
    };