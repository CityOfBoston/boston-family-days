import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import iconInfo from "../assets/intro/icon-info.svg";
import iconTicket from "../assets/intro/icon-ticket.svg";
import iconCalendar from "../assets/intro/icon-calendar.svg";
import iconClock from "../assets/intro/icon-clock.svg";
import iconChevronUp from "../assets/intro/icon-chevron-up.svg";
import iconChevronDown from "../assets/intro/icon-chevron-down.svg";

type Venue = {
  name: string;
  url: string;
};

type VenueColumn = {
  label: string;
  venues: Venue[];
};

const freeAdmissionColumns: VenueColumn[] = [
  {
    label: "Art",
    venues: [
      { name: "Museum of Fine Arts", url: "https://www.mfa.org/" },
      { name: "Isabella Stewart Gardner Museum", url: "https://www.gardnermuseum.org/" },
      { name: "Institute of Contemporary Art", url: "https://www.icaboston.org/" },
      { name: "MassArt Art Museum", url: "https://maam.massart.edu/" },
    ],
  },
  {
    label: "Science, nature & family",
    venues: [
      { name: "Museum of Science", url: "https://www.mos.org/" },
      { name: "New England Aquarium", url: "https://www.neaq.org/" },
      { name: "Franklin Park Zoo", url: "https://www.zoonewengland.org/franklin-park-zoo" },
      { name: "Boston Children’s Museum", url: "https://www.bostonchildrensmuseum.org/" },
    ],
  },
  {
    label: "History",
    venues: [
      { name: "Museum of African American History", url: "https://www.maah.org/" },
      { name: "Edward M. Kennedy Institute", url: "https://emkinstitute.org/" },
      {
        name: "John F. Kennedy Presidential Library and Museum",
        url: "https://www.jfklibrary.org/",
      },
      { name: "Paul Revere House", url: "https://www.paulreverehouse.org/" },
      { name: "Old North Illuminated", url: "https://www.oldnorth.com/" },
      { name: "USS Constitution Museum", url: "https://ussconstitutionmuseum.org/" },
      {
        name: "Revolutionary Spaces (Old State House & Old South Meeting House)",
        url: "https://revolutionaryspaces.org/",
      },
    ],
  },
];

const ticketedColumns: VenueColumn[] = [
  {
    label: "Theater",
    venues: [
      { name: "American Repertory Theater (A.R.T.)", url: "https://americanrepertorytheater.org/" },
      { name: "ArtsEmerson", url: "https://artsemerson.org/" },
      { name: "Boch Center", url: "https://www.bochcenter.org/" },
      { name: "The Huntington", url: "https://www.huntingtontheatre.org/" },
      { name: "Wheelock Family Theatre", url: "https://www.wheelockfamilytheatre.org/" },
    ],
  },
  {
    label: "Music, dance & opera",
    venues: [
      { name: "Berklee College of Music", url: "https://www.berklee.edu/" },
      { name: "Boston Ballet", url: "https://www.bostonballet.org/" },
      { name: "Boston Lyric Opera", url: "https://blo.org/" },
      { name: "Boston Symphony Orchestra", url: "https://www.bso.org/" },
      { name: "Handel and Haydn Society (H+H)", url: "https://handelandhaydn.org/" },
    ],
  },
  {
    label: "Sports & outdoors",
    venues: [
      { name: "Boston Legacy FC", url: "https://bostonlegacyfc.com/" },
      { name: "Cathleen Stone Island", url: "https://cathleenstoneisland.org/" },
    ],
  },
];

const registerButtonClass =
  "inline-flex min-h-14 items-center justify-center rounded-xl border-2 border-transparent bg-optimistic_blue px-6 py-4 !font-heading !text-[18px] !font-semibold !leading-7 !text-white hover:bg-[#145d9c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14202e]";

function VenueLink({ name, url }: Venue) {
  const words = name.split(" ");
  const lastWord = words.pop() ?? name;
  const leading = words.join(" ");

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="venue-link max-w-full self-start"
    >
      {leading && (
        <span className="venue-link-text">
          {leading}{" "}
        </span>
      )}
      <span className="whitespace-nowrap">
        <span className="venue-link-text">
          {lastWord}
        </span>
        <span className="venue-link-icon" aria-hidden="true" />
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function VenueColumns({ columns }: { columns: VenueColumn[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
      {columns.map((column) => (
        <div key={column.label} className="flex min-w-0 flex-col items-start gap-[14px]">
          <p className="!font-heading !text-[13px] !font-bold !uppercase !leading-5 !tracking-[0.78px] !text-[#4a5563]">
            {column.label}
          </p>
          {column.venues.map((venue) => (
            <VenueLink key={venue.name} name={venue.name} url={venue.url} />
          ))}
        </div>
      ))}
    </div>
  );
}

type AccordionProps = {
  title: string;
  summary: string;
  panelId: string;
  children: React.ReactNode;
};

function VenueAccordion({ title, summary, panelId, children }: AccordionProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="venue-accordion w-full rounded-[10px] border border-[#dce1e7] bg-white px-5 py-5 sm:px-7 sm:py-6">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className="venue-accordion-trigger flex w-full items-center gap-4 border-0 bg-transparent p-0 text-left"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="!font-sans !text-[21px] !font-bold !leading-[30px] !text-[#14202e]">
            {title}
          </span>
          <span className="!font-sans !text-base !font-normal !leading-6 !text-[#3b424d]">
            {summary}
          </span>
        </span>
        <span className="inline-flex shrink-0">
          <img src={open ? iconChevronUp : iconChevronDown} alt="" />
        </span>
      </button>
      {open && (
        <div id={panelId} className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
}

const IntroPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/forms");
  };

  return (
    <div className="flex w-full flex-col items-center bg-white px-4 pb-24 pt-16 sm:px-6">
      <div className="flex w-full max-w-[1000px] flex-col gap-10">
        <div className="flex flex-col gap-4">
          <h1 className="!font-heading !text-[40px] !font-extrabold !uppercase !leading-[48px] !text-[#14202e]">
            Sign up for Boston Family Days!
          </h1>
          <p className="!font-sans !text-[18px] !font-normal !leading-7 !text-[#3b424d]">
            Mayor Michelle Wu invites you and your family to take part in Boston Family Days! This program is open to all children who live in Boston and are enrolled in school between kindergarten and Grade 12.
          </p>
        </div>

        <div className="flex items-start gap-4 rounded-lg border border-[#c7d7ec] bg-[#edf3fb] px-5 py-5 sm:px-7 sm:py-6">
          <span className="inline-flex shrink-0">
            <img src={iconInfo} alt="" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="!font-sans !text-[18px] !font-bold !leading-[26px] !text-[#14202e]">
              Is your child enrolled in Boston Public Schools or Boston Pre-K?
            </p>
            <p className="!font-sans !text-base !font-normal !leading-[26px] !text-[#14202e]">
              They’re already signed up for Boston Family Days, so you don’t need to register. You’ll receive your pass directly through BPS. Please make sure your email address is up to date in the BPS system.
            </p>
          </div>
        </div>

        <section className="flex flex-col gap-5">
          <h2 className="!font-sans !text-[26px] !font-bold !normal-case !leading-[34px] !text-[#14202e]">
            What you get
          </h2>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
            <div className="flex min-w-0 flex-1 items-start gap-3 rounded-lg border border-[#dce1e7] bg-white p-5">
              <span className="inline-flex shrink-0">
                <img src={iconTicket} alt="" />
              </span>
              <p className="!font-sans !text-[17px] !font-normal !leading-6 !text-[#14202e]">
                <strong className="font-bold">Free admission</strong>
                {" "}
                for your child and up to two guests
              </p>
            </div>
            <div className="flex min-w-0 flex-1 items-start gap-3 rounded-lg border border-[#dce1e7] bg-white p-5">
              <span className="inline-flex shrink-0">
                <img src={iconCalendar} alt="" />
              </span>
              <p className="!font-sans !text-[17px] !font-normal !leading-6 !text-[#14202e]">
                On the{" "}
                <strong className="font-bold">first and second Sunday</strong>
                {" "}
                of each month
              </p>
            </div>
            <div className="flex min-w-0 flex-1 items-start gap-3 rounded-lg border border-[#dce1e7] bg-white p-5">
              <span className="inline-flex shrink-0">
                <img src={iconClock} alt="" />
              </span>
              <p className="!font-sans !text-[17px] !font-normal !leading-6 !text-[#14202e]">
                Valid{" "}
                <strong className="font-bold">through December 2026</strong>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <button type="button" onClick={handleRegisterClick} className={registerButtonClass}>
              Register now
            </button>
            <p className="!font-sans !text-base !font-normal !leading-6 !text-[#4a5563]">
              or see where you can go below
            </p>
          </div>
        </section>

        <section id="where-you-can-go" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="!font-sans !text-[26px] !font-bold !normal-case !leading-[34px] !text-[#14202e]">
              Where you can go
            </h2>
            <p className="!font-sans !text-base !font-normal !leading-6 !text-[#4a5563]">
              Links open each institution’s official website in a new tab.
            </p>
          </div>

          <VenueAccordion
            title="Free admission on 1st & 2nd Sundays"
            summary="15 museums and historic sites. Show your pass at the door. Hours vary, and some sites ask you to reserve ahead."
            panelId="free-admission-panel"
          >
            <VenueColumns columns={freeAdmissionColumns} />
          </VenueAccordion>

          <VenueAccordion
            title="Ticketed experiences"
            summary="12 venues for shows, concerts, games and outings"
            panelId="ticketed-panel"
          >
            <div className="flex flex-col gap-6">
              <div className="rounded-lg border border-[#c7d7ec] bg-[#edf3fb] px-5 py-5 sm:px-7 sm:py-6">
                <p className="!font-sans !text-base !font-normal !leading-[26px] !text-[#14202e]">
                  Tickets are limited and given out by lottery. When new shows open, enrolled families get an email to rank the ones they want. If you’re selected, you’ll get a link to claim your tickets and have 24 hours to book.
                </p>
              </div>
              <VenueColumns columns={ticketedColumns} />
            </div>
          </VenueAccordion>
        </section>

        <div className="h-px w-full bg-[#dce1e7]" />

        <section className="flex flex-col gap-5">
          <h2 className="!font-sans !text-[26px] !font-bold !normal-case !leading-[34px] !text-[#14202e]">
            Ready to register?
          </h2>
          <p className="!font-sans !text-[18px] !font-normal !leading-7 !text-[#3b424d]">
            Once you complete enrollment, you’ll receive your Boston Family Days pass. You’ll also get bi-weekly emails about the program with special opportunities and reminders.
          </p>
          <button type="button" onClick={handleRegisterClick} className={`${registerButtonClass} w-full`}>
            Register now
          </button>
        </section>
      </div>
    </div>
  );
};

export default IntroPage;
