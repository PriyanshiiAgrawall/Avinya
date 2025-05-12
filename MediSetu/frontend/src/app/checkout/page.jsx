"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
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
  const searchParams = useSearchParams();
  const [paddle, setPaddle] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initPaddle = async () => {
      try {
        if (typeof window !== "undefined") {
          const paddleInstance = await initializePaddle({
            environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox",
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
            eventCallback(event) {
              switch (event.name) {
                case "checkout.completed":
                  bookAppointment(event.data);
                  break;
                case "checkout.closed":
                  router.push("/");
                  break;
                case "checkout.error":
                  console.error("Paddle Error:", event.data);
                  break;
              }
            }
          });
          setPaddle(paddleInstance);
        }
      } catch (error) {
        console.error("Failed to initialize Paddle:", error);
      }
    };

    initPaddle();
  }, [router]);

  const bookAppointment = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appointment/book`,
        {
          userId,
          doctorId,
          appointmentDate,
          appointmentTime,
          mode,
          transactionId: data.transaction.id
        }
      );

      if (response.data.success) {
        router.push("/appointments");
      }
    } catch (error) {
      console.error("Failed to book appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!paddle) {
      console.error("Paddle not initialized");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appointment/transaction`
      );
      const data = await response.json();

      if (data.txn && data.txn.id) {
        paddle.Checkout.open({
          transactionId: data.txn.id
        });
      } else {
        throw new Error("Invalid transaction data");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div id="paddle-checkout" className="w-full max-w-md">
        {loading ? (
          <div className="text-center">
            <p>Loading checkout...</p>
          </div>
        ) : (
          <button
            onClick={handleCheckout}
            disabled={!paddle || loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
}
