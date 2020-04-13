import { JobType, SalaryType } from "@frankyjuang/milkapi-client";
import React from "react";
import { Helmet } from "react-helmet-async";

interface Props {
  uuid: string;
  name: string;
  description: string;
  createdAt: Date;
  teamName: string;
  teamWebsite?: string;
  teamLogoUrl: string;
  area: string;
  subArea: string;
  street: string;
  postCode?: string;
  salaryType: SalaryType;
  minSalary: number;
  maxSalary: number;
  type: JobType;
}

/*
  https://schema.org/JobPosting
  https://developers.google.com/search/docs/data-types/job-posting#job-posting-definition
  https://search.google.com/structured-data/testing-tool
*/
const JobPostingStructuredData: React.FC<Props> = (props) => {
  const {
    uuid,
    name,
    createdAt,
    description,
    teamName,
    teamWebsite,
    teamLogoUrl,
    area,
    subArea,
    street,
    postCode,
    salaryType,
    minSalary,
    maxSalary,
    type,
  } = props;

  const toSalaryUnitText = (type: SalaryType) => {
    switch (type) {
      case SalaryType.Monthly:
        return "MONTH";
      case SalaryType.Hourly:
        return "HOUR";
      default:
        throw new Error(`Unknown salary type ${type}`);
    }
  };

  const toEmploymentType = (type: JobType) => {
    switch (type) {
      case JobType.Fulltime:
        return "FULL_TIME";
      case JobType.Parttime:
        return "PART_TIME";
      case JobType.Internship:
        return "INTERN";
      default:
        throw new Error(`Unknown job type ${type}`);
    }
  };

  const data = {
    "@context": "http://schema.org",
    "@type": "JobPosting",
    datePosted: createdAt.toISOString(),
    validThrough: new Date(
      createdAt.setUTCFullYear(createdAt.getUTCFullYear() + 1)
    ),
    description: description,
    hiringOrganization: {
      "@type": "Organization",
      name: teamName,
      logo: teamLogoUrl,
      ...(teamWebsite && { sameAs: teamWebsite }),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "TW",
        addressLocality: subArea,
        addressRegion: area,
        ...(postCode && { postalCode: postCode }),
        streetAddress: street,
      },
    },
    title: name,
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "TWD",
      value: {
        "@type": "QuantitativeValue",
        minValue: minSalary,
        maxValue: maxSalary,
        unitText: toSalaryUnitText(salaryType),
      },
    },
    employmentType: toEmploymentType(type),
    identifier: {
      "@type": "PropertyValue",
      name: teamName,
      value: uuid,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

export { JobPostingStructuredData };
