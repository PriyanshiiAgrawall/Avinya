import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect } from "react";

export default function BookAppointmentButton({
    doctorData,
    selectedDate,
    selectedTime,
    consultationMode,
    consultationFee,
}) {
    const router = useRouter();
    let user;

    const handleAppointmentBooking = async () => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("User data:", user);
        console.log("Doctor data:", doctorData);

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            // Step 1: Create a Paddle Transaction
            const transactionPayload = {
                userId: user._id,
                email: user.email,
                doctorId: doctorData._id,
                appointmentDate: selectedDate,
                appointmentTime: selectedTime,
                mode: consultationMode,
                consultationFee: consultationFee
            };

            console.log("Transaction payload:", transactionPayload);

            const txnRes = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appointment/transaction`, transactionPayload);

            if (!txnRes.data || !txnRes.data.txn) {
                throw new Error("Failed to create transaction");
            }

            // Step 2: Open Paddle Checkout
            const { Paddle, initializePaddle } = await import("@paddle/paddle-js");
            const paddle = await initializePaddle({
                environment: "sandbox",
                token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
                eventCallback: async (event) => {
                    switch (event.name) {
                        case "checkout.completed":
                            // Step 3: Book appointment in backend with correct field names
                            const appointmentPayload = {
                                patient: user._id,
                                doctor: doctorData._id,
                                appointmentDate: selectedDate,
                                appointmentTime: selectedTime,
                                mode: consultationMode,
                                status: "active",
                                prescriptionUrl: "",
                                transcriptionUrl: "",
                                sessionId: ""
                            };

                            console.log("Appointment payload:", appointmentPayload);

                            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appointment/bookAppointment`, appointmentPayload);

                            router.push("/patient");
                            break;

                        case "checkout.closed":
                            console.log("Checkout closed by user.");
                            break;

                        case "checkout.error":
                            console.error("Paddle Checkout Error:", event.data);
                            break;
                    }
                },
            });

            // Ensure we have a valid transaction ID
            const transactionId = txnRes.data.txn.id || txnRes.data.txn;
            if (!transactionId) {
                throw new Error("Invalid transaction ID received");
            }

            // Open Paddle checkout with the transaction
            await paddle.Checkout.open({
                transactionId: transactionId,
                theme: "light",
                frameTarget: "paddle-checkout",
                frameInitialHeight: 416,
                frameStyle: "width:100%; min-width:312px; background-color: transparent; border: none;"
            });
        } catch (err) {
            console.error("Error during appointment booking:", err);
            alert("Something went wrong. Try again.");
        }
    };

    return (
        <button
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            disabled={!selectedDate || !selectedTime}
            onClick={handleAppointmentBooking}
        >
            BOOK APPOINTMENT
        </button>
    );
}
