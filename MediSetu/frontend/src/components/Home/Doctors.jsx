"use client";

import AppButton from "@/UI/AppButton";
import DoctorsCard from "@/UI/DoctorsCard";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronsRight } from "react-feather";

const Doctors = () => {
  const scrollRef = useRef(null);
  const router = useRouter();
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchTopDoctors = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doctor/getTopDoctors`);
        const data = await res.json();
        setTopDoctors(data.topDoctors || []);
      } catch (err) {
        console.error("Failed to fetch top doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDoctors();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8">
      {/* Section Heading */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-semibold text-blue-500 text-28">Best Doctors</h3>
        <div className="flex space-x-4">
          <button onClick={scrollLeft} className="p-2 bg-white rounded-full shadow-md border">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button onClick={scrollRight} className="p-2 bg-white rounded-full shadow-md border">
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Scrollable Doctors List */}
      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto scrollbar-hide px-3 mb-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : topDoctors.length === 0 ? (
          <p className="text-red-500">No doctors found.</p>
        ) : (
          topDoctors.map((doctor, index) => (
            <DoctorsCard doctor={doctor} key={index} />
          ))
        )}
      </div>

      {/* View All Button */}
      <div className="flex justify-center items-center py-8">
        <AppButton
          text="View all doctors"
          withoutHrefBtn
          customStyles="w-fit mx-auto border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          icon={ChevronsRight}
          callback={() => router.push("/all-doctors")}
        />
      </div>
    </div>
  );
};

export default Doctors;
