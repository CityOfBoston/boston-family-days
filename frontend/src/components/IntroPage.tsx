import React from "react";
import { Link } from "@trussworks/react-uswds";
import NavButton from "./common/NavButton";
import { useNavigate } from "react-router-dom";

const institutions = [
  { name: "Museum of Fine Arts", url: "https://www.mfa.org/" },
  { name: "Museum of Science", url: "https://www.mos.org/" },
  { name: "Museum of African American History", url: "https://www.maah.org/" },
  { name: "John F. Kennedy Presidential Library and Museum", url: "https://www.jfklibrary.org/" },
  { name: "Isabella Stewart Gardner Museum", url: "https://www.gardnermuseum.org/" },
  { name: "Boston Children’s Museum", url: "https://www.bostonchildrensmuseum.org/" },
  { name: "Franklin Park Zoo", url: "https://www.zoonewengland.org/franklin-park-zoo" },
  { name: "Institute of Contemporary Art", url: "https://www.icaboston.org/" },
  { name: "New England Aquarium", url: "https://www.neaq.org/visit/"}
];

const IntroPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/forms");
  };

  return (
    <div className="h-full space-y-8">
      <h1 className="uppercase">
        Sign up for Boston Family Days!
      </h1>
      <p>
        Mayor Michelle Wu invites you and your family to take part in Boston Family Days! 
        This program is open to all children who live in Boston and are enrolled in school 
        between kindergarten through Grade 12.
      </p>
      <p>
        Once you have completed this enrollment for your child, you will receive your 
        Boston Family Days pass. This pass can be shown for free admission for your child 
        and up to two guests at the following institutions <span className="font-bold">on the first and second Sunday of 
        each month through December 2026</span> at the following institutions:
      </p>
      <ul className="mt-8 list-disc list-inside space-y-1">
        {institutions.map(({ name, url }) => (
          <li key={name} className="m-0">
            <Link variant="external" href={url} target="_blank" rel="noopener noreferrer" className="!text-optimistic_blue">
              {name}
            </Link>
          </li>
        ))}
      </ul>
      <p>
        You will also receive bi-weekly emails about the program with special 
        opportunities and reminders.
      </p>
      <p>
        <span className="!text-required_red font-bold">Note for BPS Families:</span> If your child 
        is enrolled in Boston Public Schools or Boston Pre-K, they are automatically signed 
        up for this program. You will continue to receive your Boston Family Days pass 
        directly via BPS. Please ensure that your email address is updated in the BPS system.
      </p>
      <div className="mb-8">
        <NavButton
          onClick={handleRegisterClick}
          className="w-full uppercase font-heading">
          Register Now
        </NavButton>
      </div>
    </div>
  );
};

export default IntroPage;