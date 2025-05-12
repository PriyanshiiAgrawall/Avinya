"use client";

import { size } from "lodash";
import DoctorCard from "@/components/Doctors/DoctorCard";
import FilterSidebar from "@/components/Doctors/FilterSidebar";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const DoctorsPage = () => {
  const SearchParams = useSearchParams();
  const [filters, setFilters] = useState({});
  const [originalDoctors, setOriginalDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const handleDoctorsFetched = (doctorsFromAPI) => {
    setOriginalDoctors(doctorsFromAPI);
    setFilteredDoctors(doctorsFromAPI); // initially show all
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (!Array.isArray(originalDoctors)) {
      return; // or you can console.warn("Doctors not loaded yet");
    }
    const filtered = originalDoctors.filter((doc) => {
      const matchesFee = newFilters.fee ? doc.fee <= newFilters.fee : true;
      const matchesArea =
        newFilters.city && newFilters.city !== "all"
          ? doc.city?.toLowerCase() === newFilters.city.toLowerCase()
          : true;
      const matchesSpecialist =
        newFilters.speciality && newFilters.speciality !== "all"
          ? doc.speciality?.toLowerCase() === newFilters.speciality.toLowerCase()
          : true;
      const matchesExperience =
        newFilters.yearsOfExperience && newFilters.yearsOfExperience !== "all"
          ? getExperienceRange(doc.yearsOfExperience, newFilters.yearsOfExperience)
          : true;

      return matchesFee && matchesArea && matchesSpecialist && matchesExperience;
    });

    setFilteredDoctors(filtered);
  };

  const getExperienceRange = (yearsOfExperience, range) => {
    const exp = Number(yearsOfExperience);
    if (range === "1-3") return exp >= 1 && exp <= 3;
    if (range === "3-5") return exp > 3 && exp <= 5;
    if (range === "5-10") return exp > 5 && exp <= 10;
    if (range === "10+") return exp > 10;
    return true;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          <FilterSidebar
            onFilterChange={handleFilterChange}
            onDoctorsFetched={handleDoctorsFetched}
          />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-xl font-semibold">{size(filteredDoctors)} Doctors found</h1>
            </div>

            <div className="space-y-4">
              {Array.isArray(filteredDoctors) && filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => <DoctorCard key={doctor._id} doctor={doctor} />)
              ) : (
                <p className="text-gray-500">No doctors found.</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
