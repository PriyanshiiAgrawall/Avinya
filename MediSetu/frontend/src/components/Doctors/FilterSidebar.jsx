"use client";

import { useEffect, useState } from "react";
import { Star } from "react-feather";
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
const FilterSidebar = ({ onFilterChange, onDoctorsFetched }) => {
  const router = useRouter();
  const SearchParams = useSearchParams();
  const [feeRange, setFeeRange] = useState(1000);
  const [city, setCity] = useState("all");
  const [rating, setRating] = useState([0]);
  const [speciality, setSpeciality] = useState("all");
  const [yearsOfExperience, setYearsOfExperience] = useState("all");

  const handleReset = () => {
    setFeeRange(1000);
    setCity("all");
    setRating([0]);
    setSpeciality("all");
    setYearsOfExperience("all");
    fetchDoctors(); // Fetch default list
  };


  const buildParams = () => {
    const params = new URLSearchParams();
    if (feeRange) params.append("fee", feeRange.toString());
    params.append("city", city);
    if (rating.length) params.append("rating", rating.join(","));
    params.append("speciality", speciality);
    params.append("yearsOfExperience", yearsOfExperience);
    return params;
  };

  const fetchDoctors = async () => {
    const params = buildParams();
    router.push(`/all-doctors?${params.toString()}`);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doctor/filterDoctors?${params.toString()}`);
      const data = await res.json();
      onDoctorsFetched(data.doctors);
      console.log(data);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    }
  };

  useEffect(() => {
    if (!SearchParams.toString()) {
      fetchDoctors(); // fetch + URL sync in one place
    }
  }, []);
  const handleRatingChange = (ratingValue) => {
    setRating((prevRating) =>
      prevRating.includes(ratingValue)
        ? prevRating.filter((r) => r !== ratingValue) // Remove the rating if already selected
        : [...prevRating, ratingValue] // Add the rating if not selected
    );
  };

  useEffect(() => {
    onFilterChange({
      fee: feeRange,
      city,
      rating,
      speciality,
      yearsOfExperience,
    });
  }, [feeRange, city, rating, speciality, yearsOfExperience]);

  return (
    <div className="w-64 p-4 border-r">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold">Filters</h2>
        <button className="text-blue-500 text-sm" onClick={handleReset}>Reset</button>
      </div>

      {/* Consultation Fee Slider */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Consultation Fee</h3>
        <input
          type="range"
          min="0"
          max="8000"
          value={feeRange}
          onChange={(e) => setFeeRange(e.target.value)}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>Rs.0</span>
          <span>Rs.{feeRange}</span>
        </div>
      </div>
      {/* city  Dropdown*/}
      <div className="mb-6">
        <h3 className="font-medium mb-3">City</h3>
        <select value={city} onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          defaultValue="all"
        >
          <option value="all">All Cites</option>
          <option value="delhi">Delhi</option>
          <option value="mumbai">Mumbai</option>
          <option value="bangalore">Bangalore</option>
          <option value="hyderabad">Hyderabad</option>
          <option value="chennai">Chennai</option>
          <option value="kolkata">Kolkata</option>
          <option value="pune">Pune</option>
          <option value="ahmedabad">Ahmedabad</option>
          <option value="jaipur">Jaipur</option>
          <option value="lucknow">Lucknow</option>
          <option value="bhopal">Bhopal</option>
          <option value="patna">Patna</option>
          <option value="chandigarh">Chandigarh</option>
          <option value="kochi">Kochi</option>
          <option value="surat">Surat</option>
          <option value="indore">Indore</option>
          <option value="nagpur">Nagpur</option>
          <option value="kanpur">Kanpur</option>
          <option value="visakhapatnam">Visakhapatnam</option>
          <option value="vadodara">Vadodara</option>
          <option value="ghaziabad">Ghaziabad</option>
          <option value="rajkot">Rajkot</option>
          <option value="varanasi">Varanasi</option>
          <option value="srinagar">Srinagar</option>
          <option value="aurangabad">Aurangabad</option>
          <option value="amritsar">Amritsar</option>
          <option value="allahabad">Allahabad</option>
          <option value="ranchi">Ranchi</option>
          <option value="coimbatore">Coimbatore</option>
          <option value="jabalpur">Jabalpur</option>
          <option value="gwalior">Gwalior</option>
          <option value="vijayawada">Vijayawada</option>
          <option value="jodhpur">Jodhpur</option>
          <option value="madurai">Madurai</option>
          <option value="raipur">Raipur</option>
          <option value="kota">Kota</option>
          <option value="guwahati">Guwahati</option>
          <option value="mysore">Mysore</option>
          <option value="aligarh">Aligarh</option>
          <option value="jalandhar">Jalandhar</option>
          <option value="tiruchirappalli">Tiruchirappalli</option>
          <option value="bhubaneswar">Bhubaneswar</option>
          <option value="salem">Salem</option>
          <option value="guntur">Guntur</option>
          <option value="bareilly">Bareilly</option>
          <option value="moradabad">Moradabad</option>
          <option value="noida">Noida</option>
          <option value="dehradun">Dehradun</option>

        </select>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Select Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((ratingValue) => (
            <label key={ratingValue} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                checked={rating.includes(ratingValue)} // Bind the checkbox state
                onChange={() => handleRatingChange(ratingValue)} // Handle rating selection
              />
              <div className="flex">
                {Array.from({ length: ratingValue }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* speciality */}
      {
        <div className="mb-6">
          <h3 className="font-medium mb-3">Cpeciality</h3>
          <select value={speciality} onChange={(e) => setSpeciality(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            defaultValue="all"
          >
            <option value="all">All Specialities</option>
            <option value="dermatologist">Dermatologist</option>
            <option value="physician">Physician</option>
            <option value="homeopathy">Homeopathy</option>
            <option value="gynacologist">Gynacologist</option>
            <option value="physiotherapist">Physiotherapist</option>
            <option value="surgeon">Surgeon</option>
            <option value="hematologist">Hematologist</option>
            <option value="cardiologist">Cardiologist</option>
            <option value="pediatrician">Pediatrician</option>
            <option value="neurologist">Neurologist</option>
            <option value="psychiatrist">Psychiatrist</option>
          </select>
        </div>
      }
      {/* Years of experience */}
      {<div className="mb-6">
        <h3 className="font-medium mb-3">Years of Experience</h3>
        <select value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          defaultValue="all"
        >
          <option value="all">Any Experience</option>
          <option value="1-3">1-3 years</option>
          <option value="3-5">3-5 years</option>
          <option value="5-10">5-10 years</option>
          <option value="10+">10+ years</option>
        </select>
      </div>}
      {/* apply filter button */}
      <div className="flex justify-center items-center">
        <button
          className="text-blue-500 text-lg bg-[#3B82F6] text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={fetchDoctors}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
