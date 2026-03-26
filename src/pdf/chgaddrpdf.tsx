import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import logo from "../rl360logo.png";

const display = (v?: string | number) => (v ? String(v) : "");

const styles = StyleSheet.create({
  page: {
    paddingTop: 120,
    paddingBottom: 60,
    paddingHorizontal: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    position: "relative"
  },

  header: {
    position: "absolute",
    top: 20,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold"
  },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: "center",
    color: "#444"
  },

  section: {
    marginBottom: 25,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#003366"
  },

  entryBox: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    marginBottom: 12
  },

  entryTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6
  },

  subEntryBox: {
    borderWidth: 1,
    borderColor: "#666",
    padding: 8,
    marginBottom: 8,
    marginLeft: 10
  },

  subEntryTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4
  },

  fieldGroup: {
    flexDirection: "row",
    marginBottom: 6
  },

  label: {
    width: "40%",
    fontSize: 11,
    fontWeight: "bold"
  },

  value: {
    width: "60%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 4,
    fontSize: 11,
    minHeight: 18
  },

  declarationText: {
    fontSize: 11,
    marginBottom: 12,
    lineHeight: 1.4
  },

  signatureRow: {
    marginTop: 20,
    marginBottom: 20
  },

  signatureBlock: {
    marginBottom: 25
  },

  signatureTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6
  },

  signatureBox: {
    height: 60,
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 6
  },

  dateBox: {
    height: 20,
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 6
  }
});

/* ------------------------------
   HEADER + FOOTER
------------------------------ */

const Header = () => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Change of Address</Text>
    <Image src={logo} style={{ width: 150, height: 60 }} />
  </View>
);

const Footer = () => (
  <Text style={styles.footer}>
    RL360 Insurance Company Limited. Registered Office: International House, Cooil Road,
    Douglas, Isle of Man, IM2 2SP, British Isles. Registered in the Isle of Man number
    137548C. RL360 Insurance Company Limited is authorised by the Isle of Man Financial
    Services Authority.
  </Text>
);

/* ------------------------------
   REUSABLE COMPONENTS
------------------------------ */

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const EntryBox = ({ title, children }) => (
  <View style={styles.entryBox}>
    <Text style={styles.entryTitle}>{title}</Text>
    {children}
  </View>
);

const SubEntryBox = ({ title, children }) => (
  <View style={styles.subEntryBox}>
    <Text style={styles.subEntryTitle}>{title}</Text>
    {children}
  </View>
);

const Entry = ({ label, value }) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{display(value)}</Text>
  </View>
);

/* ------------------------------
   PAGE 1 — PLAN DETAILS + OWNERS
------------------------------ */

const SectionPlanNumber = ({ data }) => (
  <Section title="Plan Details">
    <Entry label="Plan Number" value={data.planNumber} />
  </Section>
);

const SectionPlanOwners = ({ data }) => {
  const owners = data.owners || [];

  return (
    <Section title="Plan Owners / Trustees">
      {owners.map((o, i) => {
        const fullName = `${display(o.firstName)} ${display(o.lastName)}`.trim();

        return (
          <EntryBox key={i} title={`Plan Owner / Trustee — ${fullName || "Unnamed"}`}>
            <Entry label="First Name" value={o.firstName} />
            <Entry label="Last Name" value={o.lastName} />
            <Entry label="Alias" value={o.alias} />

            <Entry label="Address Line 1" value={o.address1} />
            <Entry label="Address Line 2" value={o.address2} />
            <Entry label="Address Line 3" value={o.address3} />
            <Entry label="City / Town" value={o.city} />
            <Entry label="Postcode" value={o.postcode} />
            <Entry label="Country" value={o.country} />

            <Entry label="Dial Code" value={o.dialCode} />
            <Entry label="Telephone" value={o.telephone} />
            <Entry label="Email" value={o.email} />

            <Entry label="Employment Status" value={o.employmentStatus} />
            <Entry label="Employment Role" value={o.employmentRole} />
            <Entry label="Occupation" value={o.occupation} />
            <Entry label="Nature of Business" value={o.natureOfBusiness} />

            <Entry label="Reference Code" value={o.referenceCode} />
          </EntryBox>
        );
      })}
    </Section>
  );
};

/* ------------------------------
   PAGE 2 — SIGNATORIES
------------------------------ */

const SectionSignatories = ({ data }) => {
  const signatories = data.signatories || [];

  return (
    <Section title="Signatories">
      {signatories.map((sig, i) => (
        <EntryBox key={i} title={`Signatory — ${display(sig.fullName) || "Unnamed"}`}>
          <Entry label="Full Name" value={sig.fullName} />
          <Entry label="Country of Birth" value={sig.countryOfBirth} />
          <Entry label="US Specified Person" value={sig.usSpecifiedPerson} />
          <Entry label="Is Plan Owner 1" value={sig.isPlanOwner1 ? "Yes" : "No"} />
          <Entry label="Is Plan Owner 2" value={sig.isPlanOwner2 ? "Yes" : "No"} />

          {(sig.taxResidencies || []).map((tr, j) => (
            <SubEntryBox key={j} title={`Tax Residency #${j + 1}`}>
              <Entry label="Country of Tax Residence" value={tr.country} />
              <Entry label="TIN / NIN" value={tr.tin} />
              <Entry label="Functional Equivalent" value={tr.functionalEquivalent} />
            </SubEntryBox>
          ))}
        </EntryBox>
      ))}
    </Section>
  );
};

/* ------------------------------
   PAGE 3 — COMPANY + PEPs
------------------------------ */

const SectionCompanyDetails = ({ data }) => {
  const companies = data.companies || [];

  return (
    <Section title="Company Details">
      {companies.map((c, i) => (
        <EntryBox key={i} title={`Company ${companies.length > 1 ? `#${i + 1}` : ""}`}>
          
          <Entry label="Company Name" value={c.companyName} />

          {/* REGISTERED ADDRESS */}
          <SubEntryBox title="Registered Address">
            <Entry label="Address Line 1" value={c.registeredAddress1} />
            <Entry label="Address Line 2" value={c.registeredAddress2} />
            <Entry label="Address Line 3" value={c.registeredAddress3} />
            <Entry label="City / Town" value={c.registeredCity} />
            <Entry label="Postcode" value={c.registeredPostcode} />
            <Entry label="Country" value={c.registeredCountry} />
          </SubEntryBox>

          {/* CORRESPONDENCE ADDRESS */}
          <SubEntryBox title="Correspondence Address">
            <Entry label="Address Line 1" value={c.correspondenceAddress1} />
            <Entry label="Address Line 2" value={c.correspondenceAddress2} />
            <Entry label="Address Line 3" value={c.correspondenceAddress3} />
            <Entry label="City / Town" value={c.correspondenceCity} />
            <Entry label="Postcode" value={c.correspondencePostcode} />
            <Entry label="Country" value={c.correspondenceCountry} />
          </SubEntryBox>

          <Entry label="Date Moved to This Address" value={c.dateMoved} />

          {/* TAX */}
          <Entry label="Country of Tax Residence" value={c.taxResidence} />
          <Entry label="Tax Reference Number(s)" value={c.taxReference} />
          <Entry label="No Tax Reference Reason" value={c.noTaxRefReason} />
          <Entry label="FATCA GIIN" value={c.fatcaGiin} />

        </EntryBox>
      ))}
    </Section>
  );
};


const SectionPEPs = ({ data }) => {
  const peps = data.peps || [];

  return (
    <Section title="Politically Exposed Persons (PEPs)">
      {peps.map((pep, i) => (
        <EntryBox
          key={i}
          title={`PEP — ${display(pep.surname)} ${display(pep.forenames)}`.trim()}
        >
          <Entry label="Surname" value={pep.surname} />
          <Entry label="Forenames" value={pep.forenames} />
          <Entry label="Company Name" value={pep.companyName} />
          <Entry label="Position Held" value={pep.positionHeld} />
          <Entry label="Country" value={pep.country} />
          <Entry label="Date From" value={pep.dateFrom} />
          <Entry label="Date To" value={pep.dateTo} />
          <Entry label="Relationship" value={pep.relationship} />
        </EntryBox>
      ))}
    </Section>
  );
};

/* ------------------------------
   PAGE 4 — DECLARATION + 4 SIGNATURE BOXES
------------------------------ */

const DeclarationPage = ({ data }) => {
  const sigs = data.page2?.signatories || [];

  return (
    <Page size="A4" style={styles.page}>
      <Header />

      <Text style={styles.sectionTitle}>DECLARATION</Text>
      <Text style={styles.declarationText}>
        I declare that the above answers are true to the best of my knowledge and that I have
        not withheld any information.
      </Text>

      <Text style={styles.sectionTitle}>PRIVACY POLICY</Text>
      <Text style={styles.declarationText}>
        Our full privacy policy can be viewed at www.rl360.com/privacy or can be obtained by
        requesting a copy from our Data Protection Officer.
      </Text>

{Array.from({ length: Math.min(sigs.length, 4) }).map((_, i) => {
  const sig = sigs[i] || {};
  return (
    <View key={i} style={styles.signatureBlock}>
      <Text style={styles.signatureTitle}>
        Plan Owner / Trustee / Authorised Signatory
      </Text>

      <Entry label="Full Name" value={sig.fullName} />
      <Entry label="Country of Birth" value={sig.countryOfBirth} />
      <Entry label="US Specified Person" value={sig.usSpecifiedPerson} />

      <Text style={styles.label}>Signature</Text>
      <View style={styles.signatureBox} />
    </View>
  );
})}


      <Footer />
    </Page>
  );
};

/* ------------------------------
   MAIN DOCUMENT
------------------------------ */

export default function ChgaddrPDF({ data }) {
  return (
    <Document>
      {/* PAGE 1 */}
      <Page size="A4" style={styles.page}>
        <Header />

        <SectionPlanNumber data={data.page1} />
        <SectionPlanOwners data={data.page1} />
        <Footer />
      </Page>

      {/* PAGE 2 */}
      <Page size="A4" style={styles.page}>
        <Header />
        <SectionSignatories data={data.page2} />
        <Footer />
      </Page>

      {/* PAGE 3 */}
      <Page size="A4" style={styles.page}>
        <Header />
        <SectionCompanyDetails data={data.page3} />
        <SectionPEPs data={data.page4} />
        <Footer />
      </Page>

      {/* PAGE 4 — DECLARATION + SIGNATURES */}
      <DeclarationPage data={data} />
    </Document>
  );
}
