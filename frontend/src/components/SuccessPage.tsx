import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { DISPLAY_MAP } from "../utils/form";
import TicketSVG from "./common/TicketSVG";
import { Link } from "@trussworks/react-uswds";
import NavButton from "./common/NavButton";

const SuccessPage: React.FC = () => {
  const { state } = useFormContext();
  const { successData } = state;
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  // Redirect to "/" if successData is not available
  useEffect(() => {
    if (!successData) {
      navigate("/");
    }
  }, [successData, navigate]);

  const handleNewStudent = () => {
    const currentUrl = window.location.href; // Get the full URL
    const baseUrl = currentUrl.split('#')[0]; // Get everything before the hash '#'
    window.open(baseUrl, "_blank")
  }

  // Helper function to get the school name from DISPLAY_MAP
  const getSchoolName = (schoolId: string): string => {
    const schoolOptions =
      DISPLAY_MAP?.studentData?.fields?.school?.options || {};
    return schoolOptions[schoolId] || schoolId; // Fallback to ID if name isn't found
  };

  // Prevent rendering if successData is not available
  if (!successData) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row items-center">
      {/* Left Section */}
      <div className="flex flex-col gap-7 items-center p-6 md:p-12">
        <svg
          width="41"
          height="40"
          viewBox="0 0 41 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="USWDS Components">
            <g id="Icons">
              <g id="Fill">
                <path
                  id="Vector"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.5 0C9.46 0 0.5 8.96 0.5 20C0.5 31.04 9.46 40 20.5 40C31.54 40 40.5 31.04 40.5 20C40.5 8.96 31.54 0 20.5 0ZM16.5 30L6.5 20L9.32 17.18L16.5 24.34L31.68 9.16L34.5 12L16.5 30Z"
                  fill="#00A91C"
                />
              </g>
            </g>
          </g>
        </svg>
        <h1 className="uppercase text-center">You are enrolled!</h1>
        <div className="space-y-5 md:text-left">
          <p>
            Thank you for enrolling in Boston Family Days! If this is your first registered student, <span className="font-bold">please check for a
            confirmation email.</span> Once you accept the confirmation email we will
            begin sending passes for the first and second Sunday of the month.
          </p>
          <p>
            <span className="font-bold">Please note:</span> Institutions
            frequently reach capacity, so families are encouraged to
            pre-register and reserve tickets online. Find out more information
            at <Link variant="external" href={"https://www.boston.gov/familydays"} target="_blank" rel="noopener noreferrer">
              Boston Family Days
            </Link>
          </p>
          <p>
            If you are currently at one of the participating cultural
            institutions, please screenshot the information below and present it
            for free entry.
          </p>
        </div>
        <NavButton onClick={handleNewStudent} className="uppercase w-full">Register another student</NavButton>
      </div>

      {/* Right Section */}
      <div className="flex items-center w-fit">
        <div className="border-2 border-optimistic_blue rounded-lg p-6 space-y-6">
          <TicketSVG className="w-auto"/>
          <div className="space-y-5 text-left">
            <div>
              <p className="font-semibold">Student name</p>
              <p>{successData.studentName}</p>
            </div>
            <div>
              <p className="font-semibold">Student pass ID</p>
              <p>{successData.passId}</p>
            </div>
            <div>
              <p className="font-semibold">School name</p>
              <p>{getSchoolName(successData.school)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;