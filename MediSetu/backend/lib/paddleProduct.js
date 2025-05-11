// setup-paddle-product.js
// Run this script ONCE to create your base product in Paddle

import dotenv from 'dotenv';
dotenv.config();

import { Environment, Paddle } from "@paddle/paddle-node-sdk";

const paddle = new Paddle(process.env.PADDLE_SECRET_TOKEN, {
    environment: Environment.sandbox,
});

export async function createBaseProduct() {
    try {
        // First, try to find an existing product
        const products = await paddle.products.list();
        const existingProduct = products.data.find(p => p.name === "MediSetu Consultation");

        if (existingProduct) {
            console.log("Using existing product:", existingProduct.id);
            return existingProduct.id;
        }

        // If no existing product, create a new one
        const product = await paddle.products.create({
            name: "MediSetu Consultation",
            description: "Medical consultation appointment with MediSetu doctors",
            taxCategory: "standard"
        });

        console.log("Base product created successfully!");
        console.log("PRODUCT ID:", product.id);
        console.log("Store this product ID in your environment variables or config:");
        console.log("BASE_PRODUCT_ID=" + product.id);

        return product.id;
    } catch (error) {
        console.error("Error in createBaseProduct:", error);

        if (error.code === 'authentication_malformed') {
            console.error("Authentication error: Check your PADDLE_SECRET_TOKEN");
        }

        throw error;
    }
}

// Execute the function
createBaseProduct()
    .then(productId => {
        console.log("Setup complete! Use this product ID for all your transactions.");
    })
    .catch(err => {
        console.error("Setup failed:", err);
        process.exit(1);
    });