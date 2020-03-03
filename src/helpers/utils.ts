import {
  EducationLevel,
  ExperienceLevel,
  JobType,
  SalaryType,
  TeamSize
} from "@frankyjuang/milkapi-client";
import { MobileOS } from "helpers";
import { useState } from "react";

const PdfMimeType = "application/pdf";
const ImageMimeType = "image/*";
const ImagePdfMimeType = "image/*,application/pdf";

const TeamSizeOptions = [
  { value: TeamSize.ExtraSmall, label: "1 ~ 20 人" },
  { value: TeamSize.Small, label: "21 ~ 100 人" },
  { value: TeamSize.Medium, label: "101 ~ 500 人" },
  { value: TeamSize.Large, label: "501 ~ 1000 人" },
  { value: TeamSize.ExtraLarge, label: "1001 人以上" }
];

const TeamSizeConvertor = (teamSize: TeamSize | undefined) => {
  const filterValue = TeamSizeOptions.filter(o => o.value === teamSize);
  if (filterValue.length) {
    return filterValue[0].label;
  }
  return "";
};

const JobTypeOptions = [
  { value: JobType.Fulltime, label: "正職" },
  { value: JobType.Internship, label: "實習" },
  { value: JobType.Parttime, label: "兼職" }
];

const JobTypeConvertor = (jobType: JobType | undefined) => {
  const filterValue = JobTypeOptions.filter(o => o.value === jobType);
  if (filterValue.length) {
    return filterValue[0].label;
  }
  return "";
};

const EducationLevelOptions = [
  { value: EducationLevel.Any, label: "不限" },
  { value: EducationLevel.HighSchool, label: "高中／高職" },
  { value: EducationLevel.Bachelor, label: "大學／專科" },
  { value: EducationLevel.Master, label: "碩士" },
  { value: EducationLevel.PhD, label: "博士" }
];

const EducationLevelConvertor = (
  educationLevel: EducationLevel | undefined
) => {
  const filterValue = EducationLevelOptions.filter(
    o => o.value === educationLevel
  );
  if (filterValue.length) {
    return filterValue[0].label;
  }
  return "";
};

const ExperienceLevelOptions = [
  { value: ExperienceLevel.Any, label: "不限" },
  { value: ExperienceLevel.Entry, label: "入門" },
  { value: ExperienceLevel.Mid, label: "中階" },
  { value: ExperienceLevel.Senior, label: "資深" }
];

const ExperienceLevelConvertor = (
  experienceLevel: ExperienceLevel | undefined
) => {
  const filterValue = ExperienceLevelOptions.filter(
    o => o.value === experienceLevel
  );
  if (filterValue.length) {
    return filterValue[0].label;
  }
  return "";
};

const SalaryTypeToWordInJobCard = (salaryType: SalaryType) => {
  switch (salaryType) {
    case SalaryType.Hourly:
      return "/時";
    default:
      return "";
  }
};

const salaryNumberToString = (salary: number) => {
  if (salary < 1000) {
    return String(salary);
  }
  return String(salary / 1000) + "K";
};

const salaryToString = (
  minSalary: number,
  maxSalary: number,
  salaryType: SalaryType
) =>
  minSalary === maxSalary
    ? `${salaryNumberToString(minSalary)}${SalaryTypeToWordInJobCard(
        salaryType
      )}`
    : `${salaryNumberToString(minSalary)}~${salaryNumberToString(
        maxSalary
      )}${SalaryTypeToWordInJobCard(salaryType)}`;

/* phone number */
const isLocalPhoneNumber = (phoneNumber: string) =>
  /^09\d{8}$/.test(phoneNumber);
const isIntlPhoneNumber = (phoneNumber: string) =>
  /^\+8869\d{8}$/.test(phoneNumber);
const isValidPassword = (password: string) => password.length >= 8;
const isValidVerificationCode = (code: string) => /^\d{6}$/.test(code);
const convertToIntlPhoneNumber = (phoneNumber: string) =>
  isLocalPhoneNumber(phoneNumber) && "+886" + phoneNumber.substring(1);
const convertToLocalPhoneNumber = (phoneNumber: string) =>
  isIntlPhoneNumber(phoneNumber) && "09" + phoneNumber.substring(4);

const openInNewTab = (url: string) => {
  const win = window.open(url, "_blank");
  win && win.focus();
};

const checkUrl = (url: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  } else {
    return "https://" + url;
  }
};

// https://stackoverflow.com/a/21742107/3748807
const getMobileOS = (): MobileOS | undefined => {
  const userAgent = navigator.userAgent || navigator.vendor;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return MobileOS.WindowsPhone;
  }

  if (/android/i.test(userAgent)) {
    return MobileOS.Android;
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return MobileOS.Ios;
  }
};

const useLocalStorage = (key, initialValue) => {
  // State to store our value

  // Pass initial state function to useState so logic is only executed once

  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key

      const item = window.localStorage.getItem(key);

      // Parse stored json or if none return initialValue

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue

      console.log(error);

      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...

  // ... persists the new value to localStorage.

  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState

      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state

      setStoredValue(valueToStore);

      // Save to local storage

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case

      console.log(error);
    }
  };

  return [storedValue, setValue];
};

const normalizeSchoolName = (name: string) => name.replace("臺", "台");

export {
  checkUrl,
  convertToIntlPhoneNumber,
  convertToLocalPhoneNumber,
  EducationLevelConvertor,
  EducationLevelOptions,
  ExperienceLevelConvertor,
  ExperienceLevelOptions,
  getMobileOS,
  ImageMimeType,
  ImagePdfMimeType,
  isIntlPhoneNumber,
  isLocalPhoneNumber,
  isValidPassword,
  isValidVerificationCode,
  JobTypeConvertor,
  JobTypeOptions,
  normalizeSchoolName,
  openInNewTab,
  PdfMimeType,
  salaryToString,
  TeamSizeConvertor,
  TeamSizeOptions,
  useLocalStorage
};
