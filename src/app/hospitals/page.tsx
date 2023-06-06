"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHospitals } from "../GlobalRedux/slice/hospitalSlice";
import { RootState } from "../GlobalRedux/store";
import ExportCSV from "../components/ExportData/ExportCSV";
import Link from "next/link";

const Hospitals = () => {
  const dispatch = useDispatch();
  const hospitals: Hospital[] = useSelector(
    (state: RootState) => state.hospitals.hospitals
  );
  const status = useSelector((state: RootState) => state.hospitals.status);
  const error = useSelector((state: RootState) => state.hospitals.error);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  // Add state for search term
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchHospitals() as any);
  }, [dispatch]);

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Calculate the index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter the hospitals array to only include items that match the search term
  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Slice the hospitals array to only include items for the current page
  const currentItems = filteredHospitals.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  // Add a function to handle changing pages
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="mt-32 text-center mx-6">
      <h1 className="uppercase text-xl font-extrabold mb-5">
        List of Hospitals
      </h1>
      <div className="flex items-center justify-between">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Search by city, state or name"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ul className="text-left">
        {currentItems.map((hospital) => (
          <li
            key={hospital.id}
            className="p-3 flex items-center border border-solid border-black rounded-md my-2"
          >
            <div className="flex flex-col">
              <h2>{hospital.name}</h2>
              <p>
                {hospital.address}, {hospital.city}, {hospital.state}
              </p>
            </div>
            <Link className="ml-auto" href={`/hospitals/${hospital.id}`}>
              View Details
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center my-4">
        <div className="flex">
          <button
            className="mx-2"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous Page
          </button>
          <button
            className="mx-2"
            disabled={currentItems.length < itemsPerPage}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next Page
          </button>

          <p className="mx-2">
            Current Page: {currentPage} /{" "}
            {Math.ceil(hospitals.length / itemsPerPage)}
          </p>

          <p className="mx-2">Total Hospitals: {hospitals.length}</p>

          <p className="mx-2">
            Total Pages: {Math.ceil(hospitals.length / itemsPerPage)}
          </p>
        </div>

        <ExportCSV />
      </div>
    </div>
  );
};

export default Hospitals;
