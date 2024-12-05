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
];

const IntroPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/forms");
  };

  return (
    <div className="max-w-2xl mx-auto text-left">
      <h1 className="my-8 uppercase">
        Sign up for Boston Family Days!
      </h1>
      <p className="mt-8">
        Mayor Michelle Wu invites you and your family to take part in Boston Family Days! 
        This program is open to all children who live in Boston and are enrolled in school 
        between kindergarten through Grade 12.
      </p>
      <p className="mt-8">
        Once you have completed this enrollment for your child, you will receive your 
        Boston Family Days pass. This pass can be shown for free admission for your child 
        and up to two guests at the following institutions:
      </p>
      <ul className="mt-8 list-disc list-inside space-y-1">
        {institutions.map(({ name, url }) => (
          <li key={name} className="m-0">
            <Link variant="external" href={url} target="_blank" rel="noopener noreferrer">
              {name}
            </Link>
          </li>
        ))}
      </ul>
      <p className="my-6">
        You will also receive bi-weekly emails about the program with special 
        opportunities and reminders.
      </p>
      <div className="my-8">
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