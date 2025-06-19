import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

const uploadOnCloudinary = async (filePath) => {
    try {
        // Configure cloudinary outside the try block
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        });

        if (!filePath) return null;

        // Upload the file
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto" // This allows for different file types
        });

        // Remove the file from local storage
        fs.unlinkSync(filePath);
        
        return uploadResult.secure_url;
    } catch (error) {
        // Remove the file from local storage if exists
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        console.log("Error in cloudinary upload:", error);
        throw error; // Propagate error to handle it in the controller
    }
}

export default uploadOnCloudinary;