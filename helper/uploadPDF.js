const uploadPDF = async (pdfUri) => {
    console.log("Uploading PDF from URI:", pdfUri);
  
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: pdfUri,
        name: 'document.pdf',
        type: 'application/pdf', // Ensure correct MIME type
      });
      formData.append("upload_preset", "wce_club_connect");  // Unsigned upload preset
      const url = 'https://api.cloudinary.com/v1_1/dlmftenmm/auto/upload';
  
      console.log("Sending request to Cloudinary...");
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
  
      const dataResponse = await response.json();
    //   console.log("Cloudinary Response Data:", dataResponse);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const pdfUrl = dataResponse.secure_url;
    //   console.log("PDF uploaded successfully, URL:", pdfUrl);
  
      return pdfUrl; // Return the secure URL for use in your app
    } catch (err) {
      console.error("Error uploading PDF:", err);
      throw err;
    }
  };

  export default uploadPDF;