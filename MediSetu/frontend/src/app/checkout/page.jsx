import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import axios from "axios";



export default function PaddleCheckout({
    userId,
    email,
    doctorId,
    appointmentDate,
    appointmentTime,
    priceId,
    mode
}) {
    const router = useRouter();
    // const { toast } = useToast();
    const searchParams = useSearchParams();
    const [paddle, setPaddle] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        initializePaddle({
            environment: "sandbox", // or "production"
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
            eventCallback(event) {
                switch (event.name) {
                    case 'checkout.completed':
                        bookAppointment(event.data);
                        break;
                    case 'checkout.closed':
                        router.push('/');
                        break;
                    case 'checkout.error':
                        console.error("Paddle Error:", event.data);
                        break;
                }
            }
        }).then(setPaddle);
    }, []);

    const handleCheckout = async () => {

        if (!paddle) return alert("Paddle not initialized");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appointment/transaction`);
        const data = await response.json();
        paddle.Checkout.open({
            transactionId: data.txn.id,
        });
    };

    return <div id="paddle-checkout"></div>;
}
