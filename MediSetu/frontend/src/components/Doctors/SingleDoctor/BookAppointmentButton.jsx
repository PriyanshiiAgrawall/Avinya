import { useRouter } from "next/navigation";
import axios from "axios";

export default function BookAppointmentButton({
    doctorData,
    selectedDate,
    selectedTime,
    consultationMode,
    consultationFee,
}) {
    const router = useRouter();


    const handleAppointmentBooking = async () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        console.log(user);
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            // Step 1: Create a Paddle Transaction
            console.log(user)
            const txnRes = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appointment/transaction`, {
                userId: user._id,
                email: user.email,
                doctorId: doctorData._id,
                appointmentDate: selectedDate,
                appointmentTime: selectedTime,
                mode: consultationMode,
                consultationFee: consultationFee,
            });

            const txnId = txnRes.data.txn;

            // Step 2: Open Paddle Checkout
            const { Paddle, initializePaddle } = await import("@paddle/paddle-js");
            const paddle = await initializePaddle({
                environment: "sandbox",
                token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
                eventCallback: async (event) => {
                    switch (event.name) {
                        case "checkout.completed":
                            // Step 3: Book appointment in backend
                            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookAppointment`, {
                                patient: user._id,
                                doctor: doctorData._id,
                                appointmentDate: selectedDate,
                                appointmentTime: selectedTime,
                                mode: consultationMode,
                            });

                            router.push("/profile");
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

            paddle.Checkout.open({
                transactionId: txnId,
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
