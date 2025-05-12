import Image from "next/image";
import React from "react";
import { ArrowRight, CheckSquare } from "react-feather";
import { useRouter } from "next/navigation";
const Header = () => {
  const router = useRouter();
  return (
    <div className="md:h-screen px-4 md:px-6 flex flex-col md:flex-row items-center justify-between rounded-lg relative overflow-hidden ">
      {/* Left Section */}
      <div className="md:w-1/2 flex flex-col justify-center">
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            MediSetu : <span className="text-blue-500">A Bridge to Trusted Doctors,</span> Anytime,
            Anywhere.
          </h1>
          <p className="text-gray-500 text-lg">Because No Patient Should Feel Out of Reach.</p>
          <button
            onClick={() => router.push("/all-doctors")}
            className="flex items-center bg-blue-500 hover:bg-white hover:text-blue-500 text-white border hover:border-blue-500 rounded-lg font-semibold shadow-md transition duration-300 w-fit px-7 py-3 text-lg"
          >
            <span>Consult Doctors</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative mt-8 md:mt-0 md:w-1/2 flex justify-center items-center">
        {/* Doctor Image */}
        <div className="relative w-full h-auto md:w-3/4 md:h-auto">
          <Image
            src="/assets/header_doctor.jpg"
            alt="Doctor"
            width={500}
            height={600}
            className="rounded-lg object-cover"
          />
        </div>

        {/* Check Up Card with Floating Animation */}
        <div className="absolute top-1/2 left-0 bg-white p-2 lg:p-4 rounded-lg border shadow-md flex items-center gap-4 animate-float-item-one">
          {/* Checkbox Section */}
          <div className="flex items-center gap-2 text-blue-600">
            <CheckSquare size={20} />
            <p className="text-gray-500 text-14 lg:text-16">Virtual Appointments</p>
          </div>
        </div>

        {/* Floating Doctor Card with Animation */}
        <div className="absolute top-4 lg:top-1/4 -right-8 md:right-0 bg-white p-2 lg:p-3 border rounded-lg shadow-md flex flex-col text-center items-center gap-4 animate-float-item-two">
          <div className="w-12 lg:w-14 h-12 lg:h-14 rounded-full overflow-hidden border-2 border-white shadow-md relative">
            <Image
              src="/assets/doc_jhon.jpg"
              alt="Doctor Avatar"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>

          <div className="text-sm">
            <p className="font-semibold text-gray-800">Sanjeev Bhalla</p>
            <p className="text-gray-500"> Cardiologist</p>
          </div>
          <button className="text-blue-600 bg-gray-100 px-3 py-1 rounded-lg text-xs shadow-md">
            Book Now
          </button>
        </div>

        {/* Meet Our Doctors Section with Floating Animation */}
        <div className="absolute bottom-0 right-0 bg-white p-3 md:p-5 border rounded-lg shadow-md flex flex-col text-center items-center gap-2 mt-5 animate-float-item-one">
          <p className="font-semibold text-gray-800">Meet Our Doctors</p>
          <div className="flex -space-x-1">
            <Image
              src="/assets/doc_meet_1.jpg"
              className="w-11 h-11 rounded-full border-2 border-white object-cover"
              alt="Doctor 0"
              width={44}
              height={44}
            />
            <Image
              src="/assets/doc_meet_2.jpg"
              className="w-11 h-11 rounded-full border-2 border-white object-cover"
              alt="Doctor 1"
              width={44}
              height={44}
            />
            <Image
              src="/assets/doc_meet_1.jpg"
              className="w-11 h-11 rounded-full border-2 border-white object-cover"
              alt="Doctor 2"
              width={44}
              height={44}
            />
            <Image
              src="/assets/doc_meet_3.jpg"
              className="w-11 h-11 rounded-full border-2 border-white object-cover"
              alt="Doctor 3"
              width={44}
              height={44}
            />
            <span className="bg-blue-600 text-white p-2 rounded-full text-xs">12k+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
