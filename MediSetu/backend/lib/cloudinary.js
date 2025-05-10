import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import crypto from "crypto";

// Function to generate the signature for secure upload
function generateSignature(params) {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiSecret) {
        throw new Error("CLOUDINARY_API_SECRET is missing");
    }

    // Step 1: Sort parameters alphabetically and format as `key=value`
    const sortedParams = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&");

    // Step 2: Generate SHA-1 hash for Cloudinary
    return crypto.createHash("sha1").update(`${sortedParams}${apiSecret}`).digest("hex");
}

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    signature_algorithm: 'sha1'
});

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
