import React from 'react';

const SuccessPage: React.FC = () => {
  return (
    <div className="flex max-w-4xl mx-auto mt-8">
      <div className="flex-1 flex flex-col justify-center gap-7 items-center my-4">
        <svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="USWDS Components">
            <g id="Icons">
              <g id="Fill">
              <path id="Vector" fill-rule="evenodd" clip-rule="evenodd" d="M20.5 0C9.46 0 0.5 8.96 0.5 20C0.5 31.04 9.46 40 20.5 40C31.54 40 40.5 31.04 40.5 20C40.5 8.96 31.54 0 20.5 0ZM16.5 30L6.5 20L9.32 17.18L16.5 24.34L31.68 9.16L34.5 12L16.5 30Z" fill="#00A91C"/>
              </g>
            </g>
          </g>
        </svg>
        <h1 className="uppercase">You are enrolled!</h1>
        <div className='space-y-5'>
          <p>Thank you for enrolling in Boston Family Days! Please check for a confirmation email. Once you accept the confirmation email we will begin sending passes for the first and second Sunday of the month.</p>
          <p><span className='font-bold'>Please note:</span> Institutions frequently reach capacity, so families are encouraged to pre-register and reserve tickets online. Find out more information BPS Boston.</p>
          <p>If you are currently at one of the participating cultural institutions, please screenshot the information below and present it for free entry.</p>
        </div>
      </div>

      <div className="flex justify-center items-center px-12">
      <div className="border-2 border-blue-500 rounded-lg p-6 space-y-6 w-auto h-full">
        <img
          src="/images/ticket.png"
          alt="Descriptive Alt Text"
          className="w-72 mx-auto h-auto mb-4"
        />
        <div className="space-y-5 text-left">
          <div>
            <p className="font-semibold">Student name</p>
            <p>Rowan Donovan Agudelo</p>
          </div>
          <div>
            <p className="font-semibold">Student pass ID</p>
            <p>1234567</p>
          </div>
          <div>
            <p className="font-semibold">School name</p>
            <p>This is a extremely long school name</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SuccessPage;