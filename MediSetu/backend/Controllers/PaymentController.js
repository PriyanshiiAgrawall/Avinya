// PaymentController.js
import dotenv from 'dotenv';
dotenv.config();

import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { createBaseProduct } from '../lib/paddleProduct.js';

const paddle = new Paddle(process.env.PADDLE_SECRET_TOKEN, {
    environment: Environment.sandbox,
});

// Initialize the base product ID
let BASE_PRODUCT_ID = null;

// Initialize the base product
async function initializeBaseProduct() {
    if (!BASE_PRODUCT_ID) {
        BASE_PRODUCT_ID = await createBaseProduct();
    }
    return BASE_PRODUCT_ID;
}

// Helper function to handle sandbox environment requirements
function handleSandboxAmount(amount) {
    // For sandbox, Paddle requires a minimum of 6000 INR
    const PADDLE_MIN_AMOUNT = 6000;
    const isSandbox = process.env.NODE_ENV === 'development' || process.env.PADDLE_ENVIRONMENT === 'sandbox';

    if (isSandbox) {
        // Use the actual amount if it's already above the minimum
        if (parseInt(amount) >= PADDLE_MIN_AMOUNT) {
            return {
                displayAmount: amount.toString(),
                transactionAmount: amount.toString()
            };
        }

        // Otherwise maintain the original amount for display but use minimum for the transaction
        return {
            displayAmount: amount.toString(), // Original amount for display
            transactionAmount: PADDLE_MIN_AMOUNT.toString() // Minimum amount required by Paddle
        };
    }

    return {
        displayAmount: amount.toString(),
        transactionAmount: amount.toString()
    };
}

export const transaction = async (req, res) => {
    console.log("Transaction endpoint triggered");
    const { userId, email, doctorId, appointmentDate, appointmentTime, mode, consultationFee } = req.body;
    console.log("Transaction request body:", req.body);

    if (!doctorId || !consultationFee) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Ensure we have a base product ID
        const productId = await initializeBaseProduct();

        // Handle amount for sandbox environment
        const { displayAmount, transactionAmount } = handleSandboxAmount(consultationFee);
        console.log(`Original amount: ${displayAmount}, Transaction amount: ${transactionAmount}`);

        // Create a price for this specific consultation
        const price = await paddle.prices.create({
            product_id: productId,
            description: `Consultation with Dr. ID ${doctorId} (Original Fee: ${displayAmount} INR)`,
            unit_price: {
                amount: transactionAmount,
                currency_code: "INR"
            }
        });

        console.log("Dynamic price created:", price.id);

        // Create the transaction
        const txn = await paddle.transactions.create({
            items: [
                {
                    price_id: price.id,
                    quantity: 1
                }
            ],
            custom_data: {
                userId: userId,
                doctorId: doctorId,
                appointmentDate: appointmentDate,
                appointmentTime: appointmentTime,
                mode: mode,
                originalAmount: displayAmount, // Store the actual consultation fee
                isSandboxTransaction: process.env.PADDLE_ENVIRONMENT === 'sandbox',
                actualConsultationFee: parseInt(displayAmount) // Store as number for easier processing
            },
            customer: {
                email: email || "patient@example.com"
            }
        });

        console.log("Transaction created successfully:", txn.id);

        // Send transaction ID to frontend
        res.status(200).json({
            txn: txn.id,
            isSandbox: process.env.PADDLE_ENVIRONMENT === 'sandbox',
            originalAmount: displayAmount,
            transactionAmount: transactionAmount
        });

    } catch (error) {
        console.error("Error creating transaction:", error);

        // Provide detailed error information
        return res.status(500).json({
            error: "Transaction creation failed",
            message: error.message,
            details: error.errors || [],
            code: error.code || "unknown_error"
        });
    }
};

// Database schema suggestion for tracking appointments and payments
/*
// Appointment Model Example
{
    _id: ObjectId,
    patientId: ObjectId,
    doctorId: ObjectId,
    appointmentDate: Date,
    appointmentTime: String,
    consultationFee: Number,
    mode: String,
    priceId: String,          // Store the Paddle price ID
    transactionId: String,    // Store the Paddle transaction ID
    paymentStatus: String,    // "pending", "completed", "failed"
    createdAt: Date,
    updatedAt: Date
}
*/