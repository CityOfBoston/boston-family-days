// src/types/form.ts

export interface AddressData {
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface StudentData {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dob?: Date;
  school?: string;
  grade?: string;
}

export interface ContactData {
  parentName?: string;
  email?: string;
  phone?: number;
}

export interface LanguageData {
  firstLanguage?: string;
  familyLanguage?: string;
  isEL?: string;
}

export interface DemographicData {
  race?: string;
  ethnicity?: string;
}

export interface OtherData {
  isInStateProgram?: string;
  isOnIEP?: string;
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
  addressData: undefined,
  studentData: undefined,
  contactData: undefined,
  languageData: undefined,
  demographicData: undefined,
  otherData: undefined
};

export const STEPS: string[] = ["addressStep", "studentStep", "contactStep", "languageStep", "demographicStep", "otherStep", "reviewPage"] as const;

export const STEP_NAMES : string[] = ["Address information", "Student information", "Adult point of contact", "Language", "Race and ethnicity", "General questions", "Review and submit"] as const;

export const DEMOGRAPHIC_MESSAGE : string = "We are collecting basic demographic information about participating families. This information will remain anonymous and may be used to help us understand how Boston Family Days is working. It will also ensure that families across the City of Boston have an opportunity to participate fully." as const;

export const GRADE_OPTIONS : { label: string; value: string }[] = [
  { label: "Kindergarten (K-0)", value: "k-0" },
  { label: "Kindergarten (K-1)", value: "k-1" },
  { label: "Kindergarten (K-2)", value: "k-2" },
  { label: "1st", value: "1" },
  { label: "2nd", value: "2" },
  { label: "3rd", value: "3" },
  { label: "4th", value: "4" },
  { label: "5th", value: "5" },
  { label: "6th", value: "6" },
  { label: "7th", value: "7" },
  { label: "8th", value: "8" },
  { label: "9th", value: "9" },
  { label: "10th", value: "10" },
  { label: "11th", value: "11" },
  { label: "12th", value: "12" },
] as const;

export const LANGUAGE_OPTIONS: { label: string; value: string }[] = [
    { label: "Spanish (Latin American)", value: "spanish-latin-american" },
    { label: "Haitian Creole", value: "haitian-creole" },
    { label: "Mandarin", value: "mandarin" },
    { label: "Vietnamese", value: "vietnamese" },
    { label: "Cantonese", value: "cantonese" },
    { label: "Portuguese (Brazilian)", value: "portuguese-brazilian" },
    { label: "Cabo Verdean Creole", value: "cabo-verdean-creole" },
    { label: "Russian", value: "russian" },
    { label: "French (European)", value: "french-european" },
    { label: "Arabic (Standard)", value: "arabic-standard" },
    { label: "Somali", value: "somali" },
    { label: "Other", value: "other" }
] as const;

export const SCHOOLS_IN_BOSTON: { label: string; value: string }[] = [
  // Other
  { label: "Other", value: "other"},
  // Public Schools
  { label: "Adams Elementary School", value: "adams-elementary-school" },
  { label: "Baldwin Early Learning Center", value: "baldwin-early-learning-center" },
  { label: "Beethoven Elementary School", value: "beethoven-elementary-school" },
  { label: "Blackstone Elementary School", value: "blackstone-elementary-school" },
  { label: "Bradley Elementary School", value: "bradley-elementary-school" },
  { label: "Channing Elementary School", value: "channing-elementary-school" },
  { label: "Condon Elementary School", value: "condon-elementary-school" },
  { label: "Chittick Elementary School", value: "chittick-elementary-school" },
  { label: "Conley Elementary School", value: "conley-elementary-school" },
  { label: "Dever Elementary School", value: "dever-elementary-school" },
  { label: "Dudley Street Neighborhood School", value: "dudley-street-neighborhood-school" },
  { label: "Elihu Greenwood Leadership Academy", value: "elihu-greenwood-leadership-academy" },
  { label: "Ellis Elementary School", value: "ellis-elementary-school" },
  { label: "Everett Elementary School", value: "everett-elementary-school" },
  { label: "Grew Elementary School", value: "grew-elementary-school" },
  { label: "Guild Elementary School", value: "guild-elementary-school" },
  { label: "Hale Elementary School", value: "hale-elementary-school" },
  { label: "Haley Elementary School", value: "haley-elementary-school" },
  { label: "Harvard/Kent Elementary School", value: "harvard-kent-elementary-school" },
  { label: "Henderson Elementary Lower School", value: "henderson-elementary-lower-school" },
  { label: "Henderson Elementary Upper School", value: "henderson-elementary-upper-school" },
  { label: "Hennigan Elementary School", value: "hennigan-elementary-school" },
  { label: "Holland Elementary School", value: "holland-elementary-school" },
  { label: "Holmes Elementary School", value: "holmes-elementary-school" },
  { label: "Kennedy, J. F. Elementary School", value: "kennedy-j-f-elementary-school" },
  { label: "Kennedy, P. J. Elementary School", value: "kennedy-p-j-elementary-school" },
  { label: "Kenny Elementary School", value: "kenny-elementary-school" },
  { label: "Manning Elementary School", value: "manning-elementary-school" },
  { label: "Marshall Elementary School", value: "marshall-elementary-school" },
  { label: "Mason Elementary School", value: "mason-elementary-school" },
  { label: "Mather Elementary School", value: "mather-elementary-school" },
  { label: "Mattahunt Elementary School", value: "mattahunt-elementary-school" },
  { label: "McKinley Elementary School", value: "mckinley-elementary-school" },
  { label: "Mendell Elementary School", value: "mendell-elementary-school" },
  { label: "Mozart Elementary School", value: "mozart-elementary-school" },
  { label: "O'Donnell Elementary School", value: "o-donnell-elementary-school" },
  { label: "Otis Elementary School", value: "otis-elementary-school" },
  { label: "Perkins Elementary School", value: "perkins-elementary-school" },
  { label: "Philbrick Elementary School", value: "philbrick-elementary-school" },
  { label: "Quincy Elementary School", value: "quincy-elementary-school" },
  { label: "Roger Clap Innovation School", value: "roger-clap-innovation-school" },
  { label: "Russell Elementary School", value: "russell-elementary-school" },
  { label: "Sumner Elementary School", value: "sumner-elementary-school" },
  { label: "Taylor Elementary School", value: "taylor-elementary-school" },
  { label: "Tynan Elementary School", value: "tynan-elementary-school" },
  { label: "Winship Elementary School", value: "winship-elementary-school" },
  { label: "Winthrop Elementary School", value: "winthrop-elementary-school" },
  { label: "Boston Teachers Union School K-8", value: "boston-teachers-union-school-k-8" },
  { label: "Curley K-8 School", value: "curley-k-8-school" },
  { label: "Donald McKay K-8 School", value: "donald-mckay-k-8-school" },
  { label: "Edison K-8 School", value: "edison-k-8-school" },
  { label: "Eliot K-8 School", value: "eliot-k-8-school" },
  { label: "Greenwood (Sarah) K-8 School", value: "greenwood-sarah-k-8-school" },
  { label: "Haley K-8 School", value: "haley-k-8-school" },
  { label: "Hernández K-8 School", value: "hernandez-k-8-school" },
  { label: "Higginson/Lewis K-8 School", value: "higginson-lewis-k-8-school" },
  { label: "Hurley K-8 School", value: "hurley-k-8-school" },
  { label: "Kilmer K-8 School", value: "kilmer-k-8-school" },
  { label: "King K-8 School", value: "king-k-8-school" },
  { label: "Lee K-8 School", value: "lee-k-8-school" },
  { label: "Lyndon K-8 School", value: "lyndon-k-8-school" },
  { label: "Lyon K–8 School", value: "lyon-k-8-school" },
  { label: "Mario Umana Academy", value: "mario-umana-academy" },
  { label: "McKay K-8 School", value: "mckay-k-8-school" },
  { label: "Mildred Avenue K-8 School", value: "mildred-avenue-k-8-school" },
  { label: "Murphy K-8 School", value: "murphy-k-8-school" },
  { label: "Orchard Gardens K-8 School", value: "orchard-gardens-k-8-school" },
  { label: "Perry K-8 School", value: "perry-k-8-school" },
  { label: "Roosevelt K-8 School", value: "roosevelt-k-8-school" },
  { label: "Tobin K-8 School", value: "tobin-k-8-school" },
  { label: "Trotter K-8 School", value: "trotter-k-8-school" },
  { label: "Warren/Prescott K-8 School", value: "warren-prescott-k-8-school" },
  { label: "Young Achievers Science and Math K-8", value: "young-achievers-science-and-math-k-8" },

  // Charter Schools
    { label: "Academy of the Pacific Rim Charter Public School", value: "academy-of-the-pacific-rim-charter-public-school" },
  { label: "Boston Collegiate Charter School", value: "boston-collegiate-charter-school" },
  { label: "Boston Preparatory Charter Public School", value: "boston-preparatory-charter-public-school" },
  { label: "Boston Renaissance Charter Public School", value: "boston-renaissance-charter-public-school" },
  { label: "Bridge Boston Charter School", value: "bridge-boston-charter-school" },
  { label: "Brooke Charter Schools", value: "brooke-charter-schools" },
  { label: "City on a Hill Charter Public School", value: "city-on-a-hill-charter-public-school" },
  { label: "Codman Academy Charter Public School", value: "codman-academy-charter-public-school" },
  { label: "Conservatory Lab Charter School", value: "conservatory-lab-charter-school" },
  { label: "Helen Y. Davis Leadership Academy Charter Public School", value: "helen-y-davis-leadership-academy-charter-public-school" },
  { label: "KIPP Academy Boston Charter School", value: "kipp-academy-boston-charter-school" },
  { label: "MATCH Charter Public School", value: "match-charter-public-school" },
  { label: "Neighborhood House Charter School", value: "neighborhood-house-charter-school" },
  { label: "Roxbury Preparatory Charter School", value: "roxbury-preparatory-charter-school" },
  { label: "UP Academy Charter School of Boston", value: "up-academy-charter-school-of-boston" },
  { label: "UP Academy Charter School of Dorchester", value: "up-academy-charter-school-of-dorchester" },

  // Private Schools
  { label: "The Advent School", value: "the-advent-school" },
  { label: "Beacon Hill Nursery School", value: "beacon-hill-nursery-school" },
  { label: "The Boston Children's School", value: "the-boston-childrens-school" },
  { label: "Boston College High School", value: "boston-college-high-school" },
  { label: "Boston Trinity Academy", value: "boston-trinity-academy" },
  { label: "Brimmer and May School", value: "brimmer-and-may-school" },
  { label: "British International School of Boston", value: "british-international-school-of-boston" },
  { label: "The Cambridge School of Weston", value: "the-cambridge-school-of-weston" },
  { label: "Commonwealth School", value: "commonwealth-school" },
  { label: "The Croft School", value: "the-croft-school" },
  { label: "German International School Boston", value: "german-international-school-boston" },
  { label: "International School of Boston", value: "international-school-of-boston" },
  { label: "Kingsley Montessori School", value: "kingsley-montessori-school" },
  { label: "Maimonides School", value: "maimonides-school" },
  { label: "The Newman School", value: "the-newman-school" },
  { label: "The Park School", value: "the-park-school" },
  { label: "The Roxbury Latin School", value: "the-roxbury-latin-school" },
  { label: "Saint Joseph Preparatory High School", value: "saint-joseph-preparatory-high-school" },
  { label: "Shady Hill School", value: "shady-hill-school" },
  { label: "St. Sebastian's School", value: "st-sebastians-school" },
  { label: "Winsor School", value: "winsor-school" }
] as const;

export const NEIGHBORHOODS_IN_BOSTON: { label: string; value: string }[] = [
    { label: "Allston", value: "allston" },
    { label: "Back Bay", value: "back-bay" },
    { label: "Bay Village", value: "bay-village" },
    { label: "Beacon Hill", value: "beacon-hill" },
    { label: "Brighton", value: "brighton" },
    { label: "Charlestown", value: "charlestown" },
    { label: "Chinatown", value: "chinatown" },
    { label: "Dorchester", value: "dorchester" },
    { label: "Downtown", value: "downtown" },
    { label: "East Boston", value: "east-boston" },
    { label: "Fenway", value: "fenway" },
    { label: "Hyde Park", value: "hyde-park" },
    { label: "Jamaica Plain", value: "jamaica-plain" },
    { label: "Mattapan", value: "mattapan" },
    { label: "Mission Hill", value: "mission-hill" },
    { label: "North End", value: "north-end" },
    { label: "Roslindale", value: "roslindale" },
    { label: "Roxbury", value: "roxbury" },
    { label: "South Boston", value: "south-boston" },
    { label: "South End", value: "south-end" },
    { label: "West End", value: "west-end" },
    { label: "West Roxbury", value: "west-roxbury" }
] as const;

export const BOSTON_ZIP_CODES : string[] = [
    "02108", "02109", "02110", "02111", "02113", "02114", "02115", "02116",
    "02118", "02119", "02120", "02121", "02122", "02124", "02125", "02126",
    "02127", "02128", "02129", "02130", "02131", "02132", "02134", "02135",
    "02136", "02163", "02199", "02210"
] as const;

export interface FormState {
  currentStepIndex: number;
  formData: FormData;
}