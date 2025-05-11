import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import crypto from "crypto";

// Debug environment variables at the very start
console.log('Environment Variables Check:', {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'exists' : 'missing'
});

// Function to generate the signature for secure upload
function generateSignature(params) {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;


    // Step 1: Sort parameters alphabetically and format as `key=value`
    const sortedParams = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&");

    // Step 2: Generate SHA-1 hash for Cloudinary
    return crypto.createHash("sha1").update(`${sortedParams}${apiSecret}`).digest("hex");
}

// Initialize Cloudinary configuration
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
    // throw new Error(`Missing Cloudinary configuration. Cloud Name: ${cloudName ? 'exists' : 'missing'}, API Key: ${apiKey ? 'exists' : 'missing'}, API Secret: ${apiSecret ? 'exists' : 'missing'}`);
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
});

// Verify configuration
console.log('Cloudinary Config Status:', {
    isConfigured: !!cloudinary.config().cloud_name,
    config: {
        cloud_name: cloudinary.config().cloud_name,
        api_key: cloudinary.config().api_key ? 'exists' : 'missing',
        api_secret: cloudinary.config().api_secret ? 'exists' : 'missing'
    }
});

export const uploadProfilePic = async (fileBuffer, docId) => {
    try {
        // Verify Cloudinary configuration
        if (!cloudinary.config().cloud_name) {
            throw new Error("Cloudinary not properly configured");
        }

        const processedImage = await sharp(fileBuffer)
            .resize(300, 300)
            .webp({ quality: 80 })
            .toBuffer();

        const fileStr = `data:image/webp;base64,${processedImage.toString("base64")}`;

        const timestamp = Math.floor(Date.now() / 1000);
        const params = {
            timestamp: timestamp.toString(),
            folder: `doctor_profiles/${docId}`,
            format: "webp",
        };
        const signature = generateSignature(params);

        const response = await cloudinary.uploader.upload(fileStr, {
            folder: `doctor_profiles/${docId}`,
            format: "webp",
            api_key: process.env.CLOUDINARY_API_KEY,
            timestamp,
            signature,
            resource_type: "image"
        });

        return response.secure_url;
    } catch (error) {
        console.error("Error uploading profile picture to Cloudinary:", error);
        throw new Error(`Failed to upload profile picture: ${error.message}`);
    }
};

// Upload function for doctor certifications
export const uploadDoctorCertifications = async (files, docId) => {
    try {
        if (!files || files.length === 0) {
            throw new Error("No files provided");
        }

        // Create an array to hold the file URLs
        const uploadedUrls = [];

        // Loop through the files and process them
        for (let file of files) {
            // File buffer will be processed and converted to webp format for optimization
            const processedImage = await sharp(file.buffer)
                .webp({ quality: 80 }) // Adjust the quality here as per requirement
                .toBuffer();

            // Convert the image to Base64 string
            const fileStr = `data:image/webp;base64,${processedImage.toString('base64')}`;

            let timestamp = Math.floor(Date.now() / 1000);

            const params = {
                timestamp: timestamp.toString(),
                folder: `doctor_certificates/${docId}`, // Folder is named by the doctor ID
                format: "webp",
            };
            const signature = generateSignature(params);

            // Upload the image to Cloudinary
            const response = await cloudinary.uploader.upload(fileStr, {
                folder: `doctor_certificates/${docId}`,
                format: "webp",
                api_key: process.env.CLOUDINARY_API_KEY,
                timestamp: timestamp,
                signature,
            });

            // Push the URL of the uploaded certificate to the array
            uploadedUrls.push(response.secure_url); // Use secure_url to get the HTTPS link
        }

        return uploadedUrls; // Return all uploaded file URLs
    } catch (error) {
        console.error("Error uploading documents to Cloudinary:", error);
        throw new Error("Failed to upload documents");
    }
};
