// src/types/form.ts

import { Link } from "@trussworks/react-uswds";

export interface AddressData {
  street1?: string;
  street2?: string;
  neighborhood?: string;
  zip?: string;
}

export interface StudentData {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  studentId?: string;
  dob?: Date;
  school?: string;
  grade?: string;
}

export interface ContactData {
  parentFirstName?: string;
  parentLastName?: string;
  preferredCommunicationLanguage?: string;
  email?: string;
  confirm?: string;
  phoneNumber?: number;
}

export interface LanguageData {
  languageSpokenAtHome?: string;
  englishLearner?: string;
}

export interface DemographicData {
  race?: string[];
  ethnicity?: string;
}

export interface OtherData {
  programs?: string[];
  iep?: string;
}

export interface FormData {
  addressData?: AddressData;
  studentData?: StudentData;
  contactData?: ContactData;
  languageData?: LanguageData;
  demographicData?: DemographicData;
  otherData?: OtherData;
}

export const EMPTY_FORM_DATA: FormData = {
  addressData: {
    street1: '',
    street2: '',
    neighborhood: '',
    zip: ''
  },
  studentData: {
    firstName: '',
    middleName: '',
    lastName: '',
    studentId: '',
    dob: undefined,
    school: '',
    grade: ''
  },
  contactData: {
    parentFirstName: '',
    parentLastName: '',
    preferredCommunicationLanguage: '',
    email: '',
    confirm: '',
    phoneNumber: undefined
  },
  languageData: {
    languageSpokenAtHome: '',
    englishLearner: ''
  },
  demographicData: {
    race: [],
    ethnicity: ''
  },
  otherData: {
    programs: [],
    iep: ''
  }
};

export const STEPS: string[] = ["addressStep", "studentStep", "contactStep", "languageStep", "demographicStep", "otherStep", "reviewPage"] as const;

export const STEP_NAMES : string[] = ["Address information", "Student information", "Parent or guardian contact", "Language", "Race and ethnicity", "Additional questions", "Review and submit"] as const;


export const DEMOGRAPHIC_MESSAGE: React.ReactElement = (
  <div className="flex-col space-y-6">
    <p>
      We are collecting basic demographic information about participating families.
      <span className="font-bold"> This information will remain anonymous and not associated with your application. </span>
      The information you provide will be used to help us understand how Boston Family Days is working. 
      It will also ensure that families across the City of Boston have an opportunity to participate fully.
    </p>
    <p>
      To learn more about how we use the information you share with us, please read our <Link variant="external" 
      href="https://www.boston.gov/departments/innovation-and-technology/terms-use-and-privacy-policy-city-boston-digital-services#policies-for-specific-services" 
      target="_blank" rel="noopener noreferrer" className="!text-optimistic_blue">Terms of Use and Privacy Policy</Link>
    </p>
  </div>
);

export const GRADE_OPTIONS: Record<string, string> = {
  "0": "Kindergarten",
  "1": "1st",
  "2": "2nd",
  "3": "3rd",
  "4": "4th",
  "5": "5th",
  "6": "6th",
  "7": "7th",
  "8": "8th",
  "9": "9th",
  "10": "10th",
  "11": "11th",
  "12": "12th",
};

export const LANGUAGE_OPTIONS: Record<string, string> = {
  "english": "English",
  "spanish-latin-american": "Spanish (Latin American)",
  "haitian-creole": "Haitian Creole",
  "mandarin": "Mandarin",
  "vietnamese": "Vietnamese",
  "cantonese": "Cantonese",
  "portuguese-brazilian": "Portuguese (Brazilian)",
  "cabo-verdean-creole": "Cabo Verdean Creole",
  "russian": "Russian",
  "french-european": "French (European)",
  "arabic-standard": "Arabic (Standard)",
  "somali": "Somali"
};

export const SCHOOLS_IN_BOSTON: Record<string, string> = {
  // Prioritized Options
  "metco": "METCO",
  "homeschooling": "Homeschooling",

  // Public Schools
  "adams-elementary-school": "Adams Elementary School",
  "alighieri-dante-montessori-school": "Alighieri Dante Montessori School",
  "another-course-to-college": "Another Course to College",
  "baldwin-early-learning-pilot-academy": "Baldwin Early Learning Pilot Academy",
  "bates-elementary-school": "Bates Elementary School",
  "beethoven-elementary-school": "Beethoven Elementary School",
  "blackstone-elementary-school": "Blackstone Elementary School",
  "boston-adult-tech-academy": "Boston Adult Tech Academy",
  "boston-arts-academy": "Boston Arts Academy",
  "boston-collaborative-high-school": "Boston Collaborative High School",
  "boston-community-leadership-academy": "Boston Community Leadership Academy",
  "boston-community-leadership-academy-mccormack-lower": "Boston Community Leadership Academy-McCormack Lower",
  "boston-day-evening-academy": "Boston Day-Evening Academy",
  "boston-green-academy": "Boston Green Academy",
  "boston-international-high-school": "Boston International High School",
  "boston-latin-academy": "Boston Latin Academy",
  "boston-latin-school": "Boston Latin School",
  "boston-teachers-union-k-8-pilot-school": "Boston Teachers Union K-8 Pilot School",
  "bradley-elementary-school": "Bradley Elementary School",
  "brighton-high-school": "Brighton High School",
  "burke-high-school": "Burke High School",
  "carter-school": "Carter School",
  "channing-elementary-school": "Channing Elementary School",
  "charlestown-high-school": "Charlestown High School",
  "chittick-elementary-school": "Chittick Elementary School",
  "clap-elementary-school": "Clap Elementary School",
  "community-academy": "Community Academy",
  "community-academy-of-science-and-health": "Community Academy of Science and Health",
  "condon-k-8-school": "Condon K-8 School",
  "conley-elementary-school": "Conley Elementary School",
  "curley-k-8-school": "Curley K-8 School",
  "dearborn-6-12-stem-academy": "Dearborn 6-12 STEM Academy",
  "dever-elementary-school": "Dever Elementary School",
  "dudley-street-neighborhood-school": "Dudley Street Neighborhood School",
  "east-boston-early-education-center": "East Boston Early Education Center",
  "east-boston-high-school": "East Boston High School",
  "edison-k-8-school": "Edison K-8 School",
  "eliot-k-8-innovation-school-intermediate": "Eliot K-8 Innovation School - Intermediate",
  "eliot-k-8-innovation-school-lower": "Eliot K-8 Innovation School - Lower",
  "eliot-k-8-innovation-school-upper": "Eliot K-8 Innovation School - Upper",
  "ellis-elementary-school": "Ellis Elementary School",
  "ellison-parks-early-education-school": "Ellison-Parks Early Education School",
  "english-high-school": "English High School",
  "everett-elementary-school": "Everett Elementary School",
  "excel-high-school": "Excel High School",
  "fenway-high-school": "Fenway High School",
  "frederick-pilot-middle-school": "Frederick Pilot Middle School",
  "gardner-pilot-academy": "Gardner Pilot Academy",
  "greater-egleston-high-school": "Greater Egleston High School",
  "greenwood-sarah-k-8-school": "Greenwood Sarah K-8 School",
  "grew-elementary-school": "Grew Elementary School",
  "guild-elementary-school": "Guild Elementary School",
  "hale-elementary-school": "Hale Elementary School",
  "haley-pilot-school": "Haley Pilot School",
  "harvard-kent-elementary-school": "Harvard-Kent Elementary School",
  "haynes-early-education-center": "Haynes Early Education Center",
  "henderson-k-12-inclusion-school-lower": "Henderson K-12 Inclusion School Lower",
  "henderson-k-12-inclusion-school-upper": "Henderson K-12 Inclusion School Upper",
  "hennigan-k-8-school": "Hennigan K-8 School",
  "hernandez-k-8-school": "Hernandez K-8 School",
  "higginson-inclusion-k0-2-school": "Higginson Inclusion K0-2 School",
  "higginson-lewis-3-8-school": "Higginson-Lewis 3-8 School",
  "holmes-elementary-school": "Holmes Elementary School",
  "horace-mann-school-for-the-deaf-hard-of-hearing": "Horace Mann School for the Deaf Hard of Hearing",
  "hurley-k-8-school": "Hurley K-8 School",
  "kennedy-academy-for-health-careers-11-12": "Kennedy Academy for Health Careers (11-12)",
  "kennedy-academy-for-health-careers-9-10": "Kennedy Academy for Health Careers (9-10)",
  "kennedy-john-f-elementary-school": "Kennedy John F Elementary School",
  "kennedy-patrick-j-elementary-school": "Kennedy Patrick J Elementary School",
  "kenny-elementary-school": "Kenny Elementary School",
  "kilmer-k-8-school-4-8": "Kilmer K-8 School (4-8)",
  "kilmer-k-8-school-k-3": "Kilmer K-8 School (K-3)",
  "king-elementary-school": "King Elementary School",
  "lee-academy": "Lee Academy",
  "lee-k-8-school": "Lee K-8 School",
  "lyndon-k-8-school": "Lyndon K-8 School",
  "lyon-high-school": "Lyon High School",
  "lyon-k-8-school": "Lyon K-8 School",
  "madison-park-technical-vocational-high-school": "Madison Park Technical Vocational High School",
  "manning-elementary-school": "Manning Elementary School",
  "margarita-muniz-academy": "Margarita Muniz Academy",
  "mario-umana-academy": "Mario Umana Academy",
  "mason-elementary-school": "Mason Elementary School",
  "mather-elementary-school": "Mather Elementary School",
  "mattahunt-elementary-school": "Mattahunt Elementary School",
  "mckay-k-8-school": "McKay K-8 School",
  "mel-h-king-elementary": "Mel H King - Elementary",
  "mel-h-king-middle": "Mel H King - Middle",
  "mel-h-king-prep": "Mel H King - Prep",
  "mel-h-king-south-end-academy": "Mel H King South End Academy",
  "mendell-elementary-school": "Mendell Elementary School",
  "mildred-avenue-k-8-school": "Mildred Avenue K-8 School",
  "mozart-elementary-school": "Mozart Elementary School",
  "murphy-k-8-school": "Murphy K-8 School",
  "new-mission-high-school": "New Mission High School",
  "newcomers-academy": "Newcomers Academy",
  "o-bryant-school-of-math-science": "O'Bryant School of Math & Science",
  "o-donnell-elementary-school": "O'Donnell Elementary School",
  "ohrenberger-school-3-8": "Ohrenberger School (3-8)",
  "orchard-gardens-k-8-school": "Orchard Gardens K-8 School",
  "otis-elementary-school": "Otis Elementary School",
  "perkins-elementary-school": "Perkins Elementary School",
  "perry-elementary-school": "Perry Elementary School",
  "philbrick-elementary-school": "Philbrick Elementary School",
  "quincy-elementary-school": "Quincy Elementary School",
  "quincy-upper-school": "Quincy Upper School",
  "roosevelt-k-8-school-2-8": "Roosevelt K-8 School (2-8)",
  "roosevelt-k-8-school-k1-1": "Roosevelt K-8 School (K1-1)",
  "russell-elementary-school": "Russell Elementary School",
  "shaw-elementary-school": "Shaw Elementary School",
  "snowden-international-high-school": "Snowden International High School",
  "sumner-elementary-school": "Sumner Elementary School",
  "taylor-elementary-school": "Taylor Elementary School",
  "techboston-academy-6-12": "TechBoston Academy (6-12)",
  "tobin-k-8-school": "Tobin K-8 School",
  "trotter-elementary-school": "Trotter Elementary School",
  "tynan-elementary-school": "Tynan Elementary School",
  "up-academy-boston": "UP Academy Boston",
  "up-academy-holland": "UP Academy Holland",
  "warren-prescott-k-8-school": "Warren-Prescott K-8 School",
  "west-zone-early-learning-center": "West Zone Early Learning Center",
  "winship-elementary-school": "Winship Elementary School",
  "winthrop-elementary-school": "Winthrop Elementary School",
  "young-achievers-k-8-school": "Young Achievers K-8 School",

  // Catholic Schools
  "catholic-memorial": "Catholic Memorial",
  "boston-college-high-school": "Boston College High School",
  "cathedral-high-school": "Cathedral High School",
  "cristo-rey-boston-high-school": "Cristo Rey Boston High School",
  "east-boston-central-catholic-school": "East Boston Central Catholic School",
  "holy-name-parish-school": "Holy Name Parish School",
  "mother-caroline-academy": "Mother Caroline Academy",
  "nativity-preparatory-school-of-boston": "Nativity Preparatory School of Boston",
  "our-lady-of-perpetual-help-mission-grammar-school": "Our Lady of Perpetual Help Mission Grammar School",
  "sacred-heart-stem-school": "Sacred Heart Stem School",
  "saint-john-catholic-school": "Saint John Catholic School",
  "saint-john-paul-ii-catholic-academy-columbia-campus": "Saint John Paul II Catholic Academy – Columbia Campus",
  "saint-john-paul-ii-catholic-academy-lower-mills-campus": "Saint John Paul II Catholic Academy – Lower Mills Campus",
  "saint-john-paul-ii-catholic-academy-neponset-campus": "Saint John Paul II Catholic Academy – Neponset Campus",
  "south-boston-catholic-academy": "South Boston Catholic Academy",
  "saint-brendan-elementary-school": "Saint Brendan Elementary School",
  "saint-columbkille-partnership-school": "Saint Columbkille Partnership School",
  "saint-theresa-of-avila-school": "Saint Theresa of Avila School",
  "torah-academy": "Torah Academy",
  "yeshiva-ohr-yisrael": "Yeshiva Ohr Yisrael",

  // Charter Schools
  "academy-of-the-pacific-rim-charter-public-school": "Academy Of the Pacific Rim Charter Public School",
  "boston-collegiate-charter-school": "Boston Collegiate Charter School",
  "boston-day-and-evening-academy-charter-school": "Boston Day and Evening Academy Charter School",
  "boston-green-academy-horace-mann-charter-school": "Boston Green Academy Horace Mann Charter School",
  "boston-preparatory-charter-public-school": "Boston Preparatory Charter Public School",
  "boston-renaissance-charter-public-school": "Boston Renaissance Charter Public School",
  "bridge-boston-charter-school": "Bridge Boston Charter School",
  "brooke-charter-school": "Brooke Charter School",
  "city-on-a-hill-charter-public-school": "City on a Hill Charter Public School",
  "codman-academy-charter-public-school": "Codman Academy Charter Public School",
  "conservatory-lab-charter-school": "Conservatory Lab Charter School",
  "dudley-street-neighborhood-charter-school": "Dudley Street Neighborhood Charter School",
  "horace-mann-charter-public-school-district": "A Horace Mann Charter Public School (District)",
  "excel-academy-charter-school": "Excel Academy Charter School",
  "kipp-academy-boston-charter-school": "KIPP Academy Boston Charter School",
  "match-charter-public-school": "Match Charter Public School",
  "neighborhood-house-charter-school": "Neighborhood House Charter School",
  "roxbury-preparatory-charter-school": "Roxbury Preparatory Charter School",
  "up-academy-charter-school-of-dorchester": "UP Academy Charter School of Dorchester",

  // Private Schools
  "advent-school": "Advent School",
  "bais-yaakov-of-boston": "Bais Yaakov Of Boston",
  "berea-sda-academy": "Berea SDA Academy",
  "british-international-school-of-boston": "British International School Of Boston",
  "commonwealth-school": "Commonwealth School",
  "croft-school": "Croft School",
  "epiphany-school": "Epiphany School",
  "german-international-school-boston": "German International School Boston",
  "kingsley-montessori": "Kingsley Montessori",
  "meridian-academy": "Meridian Academy",
  "mesivta-high-school": "Mesivta High School",
  "neighborhood-school": "Neighborhood School",
  "new-beginnings-academy": "New Beginnings Academy",
  "newman-school": "Newman School",
  "paige-academy": "Paige Academy",
  "park-street-school": "Park Street School",
  "roxbury-latin": "Roxbury Latin",
  "shaloh-house-day": "Shaloh House Day",
  "st-peter-academy": "St Peter Academy",
  "the-learning-project-school": "The Learning Project School",
  "the-winsor-school": "The Winsor School",

  // Special Education Schools
  "compass-school": "Compass School",
  "crittenton-inc": "Crittenton Inc",
  "italian-home-for-children": "Italian Home For Children",
  "kennedy-day-school": "Kennedy Day School",
  "kennedy-hope-academy": "Kennedy Hope Academy",
  "kids-are-people": "Kids Are People",
  "manville-school": "Manville School"
};

export const NEIGHBORHOODS_IN_BOSTON: Record<string, string> = {
  "allston": "Allston",
  "back-bay": "Back Bay",
  "bay-village": "Bay Village",
  "beacon-hill": "Beacon Hill",
  "brighton": "Brighton",
  "charlestown": "Charlestown",
  "chinatown": "Chinatown",
  "dorchester": "Dorchester",
  "downtown": "Downtown",
  "east-boston": "East Boston",
  "fenway": "Fenway",
  "hyde-park": "Hyde Park",
  "jamaica-plain": "Jamaica Plain",
  "mattapan": "Mattapan",
  "mission-hill": "Mission Hill",
  "north-end": "North End",
  "roslindale": "Roslindale",
  "roxbury": "Roxbury",
  "south-boston": "South Boston",
  "south-end": "South End",
  "west-end": "West End",
  "west-roxbury": "West Roxbury",
};

export const RACE_OPTIONS: Record<string, string> = {
  "american-indian-and-alaska-native": "American Indian and Alaska Native",
  "asian": "Asian",
  "black-or-afican-american": "Black or African American",
  "native-hawailian-or-other-pacific-islander": "Native Hawaiian or other Pacific Islander",
  "white": "White",
};

export const ETHNICTY_OPTIONS: Record<string, string> = {
  "puerto-rican": "Puerto Rican",
  "colombian": "Colombian",
  "salvadorian": "Salvadorian",
  "dominican": "Dominican",
  "brazillian": "Brazillian",
  "mexican": "Mexican",
  "cuban": "Cuban",
  "cape-verdean": "Cape Verdean",
  "chinese": "Chinese",
  "haitian": "Haitian",
  "indian-not-american-indian-or-alaska-native": "Indian (Not American Indian or Alaska Native)",
  "jamaican": "Jamaican",
  "middle-eastern-or-north-african": "Middle Eastern or North African",
  "vietnamese": "Vietnamese"
}

export const ENGLISH_LEARNER_OPTIONS: Record<string, string> = {
  "yes": "Yes",
  "no": "No",
  "unsure": "Unsure",
};

export const PROGRAM_OPTIONS: Record<string, string> = {
  "snap": "Supplemental Nutrition Assistance Program (SNAP)",
  "tafdc": "Transitional Assistance for Families with Dependent Children (TAFDC)",
  "dcf": "Department of Children and Families (DCF) foster care program",
  "medicaid": "MassHealth (Medicaid)",
};

export const IEP_OPTIONS: Record<string, string> = {
  "yes": "Yes",
  "no": "No",
  "unsure": "Unsure",
};

export const DISPLAY_MAP: Record<string, any> = {
  addressData: {
    stepHeader: "Address Information",
    fields: {
      street1: {
        fieldHeader: "Street Address 1",
      },
      street2: {
        fieldHeader: "Street Address line 2",
      },
      neighborhood: {
        fieldHeader: "Neighborhood",
        options: NEIGHBORHOODS_IN_BOSTON,
      },
      zip: {
        fieldHeader: "Zip Code",
      },
    },
  },
  studentData: {
    stepHeader: "Student Information",
    fields: {
      firstName: {
        fieldHeader: "First name",
      },
      middleName: {
        fieldHeader: "Middle name",
      },
      lastName: {
        fieldHeader: "Last name",
      },
      studentId: {
        fieldHeader: "Student ID",
      },
      dob: {
        fieldHeader: "Date of Birth",
      },
      school: {
        fieldHeader: "School name",
        options: SCHOOLS_IN_BOSTON,
      },
      grade: {
        fieldHeader: "Grade level",
        options: GRADE_OPTIONS,
      },
    },
  },
  contactData: {
    stepHeader: "Parent or Guardian Contact",
    fields: {
      parentFirstName: {
        fieldHeader: "Parent or Guardian first name",
      },
      parentLastName: {
        fieldHeader: "Parent or Guardian last name",
      },
      preferredCommunicationLanguage: {
        fieldHeader: "Preferred communication language",
        options: LANGUAGE_OPTIONS,
      },
      email: {
        fieldHeader: "Email where the pass should be sent",
      },
      confirm: {
        fieldHeader: "Confirm your email",
      },
      phoneNumber: {
        fieldHeader: "Phone Number",
      },
    },
  },
  languageData: {
    stepHeader: "Language",
    fields: {
      languageSpokenAtHome: {
        fieldHeader: "Language spoken at home",
        options: LANGUAGE_OPTIONS,
      },
      englishLearner: {
        fieldHeader: "Has your child been identified by their school as an English Learner (EL)?",
        options: ENGLISH_LEARNER_OPTIONS,
      },
    },
  },
  demographicData: {
    stepHeader: "Race and Ethnicity",
    fields: {
      race: {
        fieldHeader: "Which of the following race classifications best describe you?",
        options: RACE_OPTIONS,
      },
      ethnicity: {
        fieldHeader: "I identify my ethnicity as:",
        options: ETHNICTY_OPTIONS
      },
    },
  },
  otherData: {
    stepHeader: "Additional Questions",
    fields: {
      programs: {
        fieldHeader: "Is the student currently enrolled in or receiving assistance from any of the following state-administered programs?",
        options: PROGRAM_OPTIONS,
      },
      iep: {
        fieldHeader: "Does the student currently have an Individualized Education Program (IEP)?",
        options: IEP_OPTIONS
      },
    },
  },
};

export const BOSTON_ZIP_CODES : string[] = [
  "02101", "02102", "02103", "02104", "02105", "02106", "02107", "02108", 
  "02109", "02110", "02111", "02112", "02113", "02114", "02115", "02116", 
  "02117", "02118", "02119", "02120", "02121", "02122", "02123", "02124", 
  "02125", "02126", "02127", "02128", "02129", "02130", "02131", "02132", 
  "02133", "02134", "02135", "02136", "02137", "02163", "02199", "02203", 
  "02205", "02208", "02209", "02210", "02215", "02222", "02228", "02283", 
  "02284", "02455", "02467"
] as const;

export interface FormState {
  currentStepIndex: number;
  formData: FormData;
}