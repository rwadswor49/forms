import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from "@react-pdf/renderer";

import logo from "../rl360logo.png";

/* ------------------------------
   CLEAN DISPLAY HELPER
------------------------------ */
const display = (value?: string) =>
  value && value.trim() !== "" ? value : "";

/* ------------------------------
   BOXED ARRAY RENDERER
------------------------------ */
const renderBoxedArray = (arr, fieldMap) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return <Text>No entries provided.</Text>;
  }

  return arr.map((item, index) => (
    <View key={index} style={{ marginBottom: 15 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
        Entry #{index + 1}
      </Text>

      {Object.entries(fieldMap).map(([label, key]) => (
        <View key={key} style={styles.fieldGroup}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{display(item[key])}</Text>
        </View>
      ))}
    </View>
  ));
};

/* ------------------------------
   STYLES
------------------------------ */
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  logoContainer: {
    marginLeft: "auto",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },

  logo: {
    width: 150,
    height: 80,
  },

  headerTextBlock: {
    flexDirection: "column",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 11,
    color: "#444",
  },

  section: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 10,
  },

  fieldGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  label: {
    width: "40%",
    fontSize: 12,
    fontWeight: "bold",
  },

  value: {
    width: "60%",
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 12,
    minHeight: 20,
    backgroundColor: "#fff",
  },

  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  signatureBlock: {
    width: "48%",
  },

  signatureBox: {
    height: 70,
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 5,
  },
});

/* ------------------------------
   HEADER
------------------------------ */

const Header = () => (
  <View style={styles.header}>
    <View style={styles.headerTextBlock}>
      <Text style={styles.headerTitle}>Source of Wealth Declaration</Text>
      <Text style={styles.headerSubtitle}>
        Comprehensive Financial Background Summary
      </Text>
    </View>

    <View style={styles.logoContainer}>
      <Image src={logo} style={styles.logo} />
    </View>
  </View>
);

/* ------------------------------
   PAGE 1 — YOUR DETAILS
------------------------------ */

const SectionYourDetails = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Your Details</Text>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Plan Number(s)</Text>
      <Text style={styles.value}>{display(data?.planNumber)}</Text>
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Full Name</Text>
      <Text style={styles.value}>{display(data?.name)}</Text>
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Date of Birth</Text>
      <Text style={styles.value}>{display(data?.dobDate)}</Text>
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Wealth Sources</Text>
      <Text style={styles.value}>
        {Array.isArray(data?.wealthSources)
          ? display(data.wealthSources.join(", "))
          : display(data?.wealthSources)}
      </Text>
    </View>
  </View>
);

/* ------------------------------
   PAGE 2 — EMPLOYMENT
------------------------------ */

const SectionEmployment = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Employment Information</Text>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Employment Status</Text>
      <Text style={styles.value}>
        {Array.isArray(data?.employmentStatus)
          ? display(data.employmentStatus.join(", "))
          : display(data?.employmentStatus)}
      </Text>
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Employment Role</Text>
      <Text style={styles.value}>
        {Array.isArray(data?.employmentRole)
          ? display(data.employmentRole.join(", "))
          : display(data?.employmentRole)}
      </Text>
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Employer Name</Text>
      <Text style={styles.value}>{display(data?.employerName)}</Text>
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Occupation</Text>
      <Text style={styles.value}>{display(data?.occupation)}</Text>
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Industry</Text>
      <Text style={styles.value}>{display(data?.industry)}</Text>
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Nature of Business</Text>
      <Text style={styles.value}>{display(data?.natureOfBusiness)}</Text>
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Net Worth</Text>
      <Text style={styles.value}>{display(data?.netWorth)}</Text>
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Salary Last Year</Text>
      <Text style={styles.value}>{display(data?.salaryLastYear)}</Text>
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Bonus</Text>
      <Text style={styles.value}>{display(data?.bonus)}</Text>
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Join Date</Text>
      <Text style={styles.value}>{display(data?.joinDate)}</Text>
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Employer Address</Text>
      <Text style={styles.value}>
        {[
          data?.addressLine1,
          data?.townOrCity,
          data?.stateOrProvince,
          data?.postalCode,
          data?.country
        ]
          .filter(Boolean)
          .join(", ")}
      </Text>
    </View>
  </View>
);

/* ------------------------------
   PAGE 3 — BUSINESS
------------------------------ */

const SectionBusiness = ({ data }) => {
  const fieldMap = {
    "Company Name": "companyName",
    "Main Business Activity": "mainBusinessActivity",
    "Annual Revenue": "companyAnnualRevenue",
    "Annual Income From Company": "annualIncomeFromCompany",
    "Stake": "stake",
    "Other Owners": "otherOwners",
    "Business Type": "businessType",
    "Capital Source": "capitalSource",
    "Address Line 1": "companyAddressLine1",
    "City": "companyCity",
    "Region": "companyRegion",
    "Postal Code": "companyPostalCode",
    "Country": "companyCountry",
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Business Income</Text>
      {renderBoxedArray(data?.businesses, fieldMap)}
    </View>
  );
};

/* ------------------------------
   PAGE 4 — PENSION
------------------------------ */

const SectionPension = ({ data }) => {
  const fieldMap = {
    "Pension Type": "pensionType",
    "Employer Scheme Name": "employerSchemeName",
    "Occupation": "occupation",
    "Years Worked": "yearsWorked",
    "Employment Pension Institution": "employmentPensionInstitution",
    "Employment Pension Value": "employmentPensionValue",
    "Personal Pension Institution": "personalPensionInstitution",
    "Personal Pension Jurisdiction": "personalPensionJurisdiction",
    "Personal Pension Value": "personalPensionValue",
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Pension Income</Text>
      {renderBoxedArray(data?.pensions, fieldMap)}
    </View>
  );
};

/* ------------------------------
   PAGE 5 — INVESTMENTS
------------------------------ */

const SectionInvestments = ({ data }) => {
  const fieldMap = {
    "Investment Name": "investmentName",
    "Ticker": "ticker",
    "Cash Amount": "cashAmount",
    "Unit Amount": "unitAmount",
    "Percentage": "percentage",
    "Settlement Currency": "settlementCurrency",
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Investments</Text>
      {renderBoxedArray(data?.investments, fieldMap)}
    </View>
  );
};

/* ------------------------------
   PAGE 6 — ART INVESTMENTS
------------------------------ */

const SectionArt = ({ data }) => {
  const fieldMap = {
    "Art Description": "artDescription",
    "Investment Details": "artInvestmentDetails",
    "Net Income": "artNetIncome",
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Art Investments</Text>
      {renderBoxedArray(data?.artInvestments, fieldMap)}
    </View>
  );
};

/* ------------------------------
   PAGE 7 — REAL ESTATE
------------------------------ */

const SectionRealEstate = ({ data }) => {
  const fieldMap = {
    "Initial Investment Source": "initialInvestmentWealth",
    "Income": "realEstateIncome",
    "Company": "realEstateCompany",
    "Details": "realEstateDetails",
    "Capital Source": "realEstateCapitalSource",
    "Purchase Price": "propertyPurchasePrice",
    "Current Value": "propertyCurrentValue",
    "Purchase Date": "propertyPurchaseDate",
    "Owned": "propertyOwned",
    "Sale Price": "propertySalePrice",
    "Sale Date": "propertySaleDate",
    "Funds Location": "propertySaleFundsLocation",
    "Address Line 1": "propertyAddressLine1",
    "City": "propertyCity",
    "Region": "propertyRegion",
    "Postal Code": "propertyPostalCode",
    "Country": "propertyCountry",
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Real Estate</Text>
      {renderBoxedArray(data?.realEstate, fieldMap)}
    </View>
  );
};

/* ------------------------------
   PAGE 8 — PROPERTY SALES
------------------------------ */

const SectionProperty = ({ data }) => {
  const fieldMap = {
    "Sale Price": "salePrice",
    "Sale Date": "saleDate",
    "Funds Location": "fundsLocation",
    "Address Line 1": "addressLine1",
    "City": "city",
    "Region": "region",
    "Postal Code": "postalCode",
    "Country": "country",
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Property Sales</Text>
      {renderBoxedArray(data?.properties, fieldMap)}
    </View>
  );
};

/* ------------------------------
   PAGE 9 — INHERITANCE
------------------------------ */

const SectionInheritance = ({ data }) => {
  const fieldMap = {
    "Amount": "inheritanceAmount",
    "Date": "inheritanceDate",
    "From": "inheritanceFrom",
    "Relationship": "inheritanceRelationship",
    "Details": "inheritanceDetails",
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Inheritance</Text>
      {renderBoxedArray(data?.inheritances, fieldMap)}
    </View>
  );
};

/* ------------------------------
   PAGE 10 — GIFTS
------------------------------ */

const SectionGifts = ({ data }) => {
  const fieldMap = {
    "Amount": "giftAmount",
    "Date": "giftDate",
    "From": "giftFrom",
    "Relationship": "giftRelationship",
    "Reason": "giftReason",
    "Details": "giftDetails",
    "Address Line 1": "giverAddressLine1",
    "City": "giverCity",
    "Region": "giverRegion",
    "Postal Code": "giverPostalCode",
    "Country": "giverCountry",
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Gifts / Allowances</Text>
      {renderBoxedArray(data?.gifts, fieldMap)}
    </View>
  );
};

/* ------------------------------
   PAGE 11 — LOTTERY
------------------------------ */

const SectionLottery = ({ data }) => {
  const fieldMap = {
    "Win Amount": "lotteryWinAmount",
    "Win Date": "lotteryWinDate",
    "Organisation": "lotteryOrganisation",
    "Address Line 1": "lotteryOrgAddressLine1",
    "City": "lotteryOrgCity",
    "Region": "lotteryOrgRegion",
    "Postal Code": "lotteryOrgPostalCode",
    "Country": "lotteryOrgCountry",
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Lottery / Gaming Wins</Text>
      {renderBoxedArray(data?.lottery, fieldMap)}
    </View>
  );
};

/* ------------------------------
   PAGE 12 — SAVINGS
------------------------------ */

const SectionSavings = ({ data }) => {
  const fieldMap = {
    "Institution": "savingsInstitution",
    "Value": "savingsValue",
    "Location": "savingsLocation",
    "Funds Origin": "savingsOrigin",
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Savings</Text>
      {renderBoxedArray(data?.savings, fieldMap)}
    </View>
  );
};

/* ------------------------------
   PAGE 13 — OTHER
------------------------------ */

const SectionOther = ({ data }) => {
  const fieldMap = {
    "Description": "otherIncomeDescription",
    "Wealth Source": "otherWealthSource",
    "Value": "otherWealthValue",
    "Additional Funds Origin": "fundsOriginExtra",
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Other Wealth Sources</Text>
      {renderBoxedArray(data?.other, fieldMap)}
    </View>
  );
};

/* ------------------------------
   SIGNATURE SECTION
------------------------------ */

const SignatureSection = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Signature</Text>

    <View style={styles.signatureRow}>
      <View style={styles.signatureBlock}>
        <Text style={styles.label}>Signature 1</Text>
        <View style={styles.signatureBox} />
      </View>
    </View>
  </View>
);

/* ------------------------------
   FINAL DOCUMENT ASSEMBLY
------------------------------ */

export default function SourceOfWealthPDF({ data }) {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>

        <Header />

        <SectionYourDetails data={data.page1} />
        <SectionEmployment data={data.page2} />
        <SectionBusiness data={data.page3} />
        <SectionPension data={data.page4} />
        <SectionInvestments data={data.page5} />
        <SectionArt data={data.page6} />
        <SectionRealEstate data={data.page7} />
        <SectionProperty data={data.page8} />
        <SectionInheritance data={data.page9} />
        <SectionGifts data={data.page10} />
        <SectionLottery data={data.page11} />
        <SectionSavings data={data.page12} />
        <SectionOther data={data.page13} />

        <SignatureSection />

      </Page>
    </Document>
  );
}

