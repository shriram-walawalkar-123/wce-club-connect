import * as FileSystem from 'expo-file-system';

const uploadImage = async (imageUri) => {
  try {
    // Read the file from the local filesystem as base64
    const base64File = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const formData = new FormData();
    formData.append("file", `data:image/jpeg;base64,${base64File}`); // Append the base64 image data
    formData.append("upload_preset", "wce_club_connect"); // Replace with your actual Cloudinary upload preset

    const url = 'https://api.cloudinary.com/v1_1/dlmftenmm/image/upload'; // Replace with your Cloudinary URL

    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    const dataResponse = await response.json();

    if (!dataResponse) {
      throw new Error("Image upload failed!");
    }

    return dataResponse; // Return the response from Cloudinary
  } catch (err) {
    console.error("Error uploading image:", err);
  }
};

export default uploadImage;