"use client";
import Image from "next/image";
import Link from "next/link";
import { Star } from "react-feather";

const DoctorCard = ({ doctor }) => {
  const {
    fullName,
    qualification,
    specialization,
    profilePic,
    yearsOfExperience,
    rating,
    currentWorking,
    city,
    consultationFee,
    availableSlots,

    _id
  } = doctor || {};
  return (
    <div>
      <div className="border rounded-lg p-4 flex gap-4">
        <Link href={`/all-doctors/single-doctor/${_id}`}>
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image src={profilePic} alt={fullName} fill className="rounded-lg object-cover" />
          </div>
        </Link>
        <div className="flex-grow">
          <Link href={`/all-doctors/single-doctor/${_id}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{fullName}</h3>
                <p className="text-sm text-gray-600">{qualification}</p>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm mt-1">
                  {specialization}
                </span>
              </div>
              <div className="text-right">
                <p className="font-semibold">Rs. {consultationFee}</p>
                <p className="text-sm text-gray-600">Per consultation</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600">Working in</p>
              <p className="font-medium text-black-600">{currentWorking}</p>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-sm text-gray-600">Total Experience</p>
                <p className="font-medium">{yearsOfExperience} Years</p>
              </div>
              <div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">City</p>
                  <p className="font-medium">{city}</p>
                </div>
                <p className="text-sm text-gray-600">Total Rating </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="font-medium ml-1">{rating}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
