import { useRef, useState, useEffect } from "react";
import FormHeader from "../FormHeader";
import FormFooter from "../FormFooter";

import SourceOfWealthForm from "./SourceofWealth-1";
import SourceOfWealthForm2 from "./SourceofWealth-2";
import PensionForm from "./SourceofWealth-3";
import InvestmentsForm from "./SourceofWealth-3a";
import ArtInvestmentsForm from "./SourceofWealth-3b";
import RealEstateForm from "./SourceofWealth-4";
import PropertyForm from "./SourceofWealth-4a";

import InheritanceForm, { InheritanceFormValues } from "./SourceofWealth-5";
import GiftAllowanceForm, { GiftAllowanceFormValues } from "./SourceofWealth-5a";

import LotteryForm, { LotteryFormValues } from "./SourceofWealth-6";
import SavingsForm, { SavingsFormValues } from "./SourceofWealth-6a";
import OtherForm, { OtherFormValues } from "./SourceofWealth-6b";

export default function SourceOfWealth({ goHome, formTitle, printMode, setPrintMode }) {

  const totalPages = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // -----------------------------
  // REFS
  // -----------------------------
  const form1Ref = useRef(null);
  const form2Ref = useRef(null);
  const form3Ref = useRef(null);
  const form3aRef = useRef(null);
  const form3bRef = useRef(null);
  const form4Ref = useRef(null);
  const form4aRef = useRef(null);
  const form5Ref = useRef(null);
  const form5aRef = useRef(null);
  const form6Ref = useRef(null);
  const form6aRef = useRef(null);
  const form6bRef = useRef(null);

  // -----------------------------
  // PAGE DATA
  // -----------------------------
  const [page1Data, setPage1Data] = useState({
    planNumber: "",
    name: "",
    dobDate: "",
    employmentStatus: [],
    employmentRole: [],
    employerName: "",
    occupation: "",
    industry: "",
    natureOfBusiness: "",
    netWorth: "",
    wealthSources: [],
    salaryLastYear: "",
    bonus: "",
    joinDate: "",
    addressLine1: "",
    townOrCity: "",
    stateOrProvince: "",
    postalCode: "",
    country: ""
  });

  const [page2Data, setPage2Data] = useState({});
  const [page3Data, setPage3Data] = useState({});
  const [page3aData, setPage3aData] = useState({});
  const [page3bData, setPage3bData] = useState({});
  const [page4Data, setPage4Data] = useState({});
  const [page4aData, setPage4aData] = useState({});

  const [page5Data, setPage5Data] = useState<InheritanceFormValues>({
    inheritanceAmount: "",
    inheritanceDate: "",
    inheritanceFrom: "",
    inheritanceRelationship: "",
    inheritanceDetails: ""
  });

  const [page5aData, setPage5aData] = useState<GiftAllowanceFormValues>({
    giftAmount: "",
    giftDate: "",
    giftFrom: "",
    giftRelationship: "",
    giftReason: "",
    giftDetails: "",
    giverAddressLine1: "",
    giverCity: "",
    giverRegion: "",
    giverPostalCode: "",
    giverCountry: ""
  });

  const [page6Data, setPage6Data] = useState<LotteryFormValues>({
    lotteryWinAmount: "",
    lotteryWinDate: "",
    lotteryOrganisation: "",
    lotteryOrgAddressLine1: "",
    lotteryOrgCity: "",
    lotteryOrgRegion: "",
    lotteryOrgPostalCode: "",
    lotteryOrgCountry: ""
  });

  const [page6aData, setPage6aData] = useState<SavingsFormValues>({
    savingsInstitution: "",
    savingsValue: "",
    savingsLocation: "",
    savingsOrigin: ""
  });

  const [page6bData, setPage6bData] = useState<OtherFormValues>({
    otherIncomeDescription: "",
    otherWealthSource: "",
    otherWealthValue: "",
    fundsOriginExtra: ""
  });

  // -----------------------------
  // PAGE LABELS
  // -----------------------------
  const pageLabels = [
    "Employment",
    "Business Income",
    "Pension",
    "Investments",
    "Art Investments",
    "Real Estate",
    "Property",
    "Inheritance",
    "Gift / Allowance",
    "Lottery",
    "Savings",
    "Other"
  ];

  // -----------------------------
  // DYNAMIC PAGE VISIBILITY
  // -----------------------------
  const [visiblePages, setVisiblePages] = useState([1]);

  useEffect(() => {
    const selected = page1Data.wealthSources || [];
    const pages = [1];

    if (selected.includes("businessIncome")) pages.push(2);
    if (selected.includes("pension")) pages.push(3);
    if (selected.includes("investments")) pages.push(4);
    if (selected.includes("artInvestments")) pages.push(5);
    if (selected.includes("realEstate")) pages.push(6);
    if (selected.includes("propertySale")) pages.push(7);
    if (selected.includes("inheritance")) pages.push(8);
    if (selected.includes("gift")) pages.push(9);
    if (selected.includes("lotteryGamingWin")) pages.push(10);
    if (selected.includes("savings")) pages.push(11);
    if (selected.includes("other")) pages.push(12);

    setVisiblePages(pages);
  }, [page1Data.wealthSources]);

  // -----------------------------
  // SAVE TO LOCALSTORAGE
  // -----------------------------
  useEffect(() => {
    const allData = {
      sourceOfWealthPage1: page1Data,
      sourceOfWealthPage2: page2Data,
      sourceOfWealthPage3: page3Data,
      sourceOfWealthPage4: page3aData,
      sourceOfWealthPage5: page3bData,
      sourceOfWealthPage6: page4Data,
      sourceOfWealthPage7: page4aData,
      sourceOfWealthPage8: page5Data,
      sourceOfWealthPage9: page5aData,
      sourceOfWealthPage10: page6Data,
      sourceOfWealthPage11: page6aData,
      sourceOfWealthPage12: page6bData
    };

    localStorage.setItem("sow-data", JSON.stringify(allData));
  }, [
    page1Data,
    page2Data,
    page3Data,
    page3aData,
    page3bData,
    page4Data,
    page4aData,
    page5Data,
    page5aData,
    page6Data,
    page6aData,
    page6bData
  ]);

  // -----------------------------
  // NAVIGATION
  // -----------------------------
  const refs = [
    form1Ref,
    form2Ref,
    form3Ref,
    form3aRef,
    form3bRef,
    form4Ref,
    form4aRef,
    form5Ref,
    form5aRef,
    form6Ref,
    form6aRef,
    form6bRef
  ];

  const goNext = async () => {
    const ref = refs[currentPage - 1];
    const valid = await ref.current?.submit();
    if (valid && currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goPrev = () => setCurrentPage(Math.max(currentPage - 1, 1));

  const submitAll = async () => {
    for (let i = 0; i < refs.length; i++) {
      const valid = await refs[i].current?.submit();
      if (!valid) {
        setCurrentPage(i + 1);
        return;
      }
    }
    setPrintMode(true);
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="app">

      {/* FORM UI — stays mounted, only hidden */}
      <div style={{ display: printMode ? "none" : "block" }}>
        <FormHeader
          currentPage={currentPage}
          totalPages={totalPages}
          pageLabels={pageLabels}
          setCurrentPage={setCurrentPage}
          goHome={goHome}
          formTitle={formTitle}
          setPrintMode={setPrintMode}
          onPrint={submitAll}
          visiblePages={visiblePages}
          showAllPages={false}
        />

        <div className="page-container">
          <div className="main-layout">
            <div className="form-area">

              <div style={{ display: currentPage === 1 ? "block" : "none" }}>
                <SourceOfWealthForm ref={form1Ref} data={page1Data} setData={setPage1Data} />
              </div>

              <div style={{ display: currentPage === 2 ? "block" : "none" }}>
                <SourceOfWealthForm2 ref={form2Ref} data={page2Data} setData={setPage2Data} />
              </div>

              <div style={{ display: currentPage === 3 ? "block" : "none" }}>
                <PensionForm ref={form3Ref} data={page3Data} setData={setPage3Data} />
              </div>

              <div style={{ display: currentPage === 4 ? "block" : "none" }}>
                <InvestmentsForm ref={form3aRef} data={page3aData} setData={setPage3aData} />
              </div>

              <div style={{ display: currentPage === 5 ? "block" : "none" }}>
                <ArtInvestmentsForm ref={form3bRef} data={page3bData} setData={setPage3bData} />
              </div>

              <div style={{ display: currentPage === 6 ? "block" : "none" }}>
                <RealEstateForm ref={form4Ref} data={page4Data} setData={setPage4Data} />
              </div>

              <div style={{ display: currentPage === 7 ? "block" : "none" }}>
                <PropertyForm ref={form4aRef} data={page4aData} setData={setPage4aData} />
              </div>

              <div style={{ display: currentPage === 8 ? "block" : "none" }}>
                <InheritanceForm ref={form5Ref} data={page5Data} setData={setPage5Data} />
              </div>

              <div style={{ display: currentPage === 9 ? "block" : "none" }}>
                <GiftAllowanceForm ref={form5aRef} data={page5aData} setData={setPage5aData} />
              </div>

              <div style={{ display: currentPage === 10 ? "block" : "none" }}>
                <LotteryForm ref={form6Ref} data={page6Data} setData={setPage6Data} />
              </div>

              <div style={{ display: currentPage === 11 ? "block" : "none" }}>
                <SavingsForm ref={form6aRef} data={page6aData} setData={setPage6aData} />
              </div>

              <div style={{ display: currentPage === 12 ? "block" : "none" }}>
                <OtherForm ref={form6bRef} data={page6bData} setData={setPage6bData} />
              </div>

            </div>

            <div className="side-panel"></div>
          </div>

          <FormFooter
            currentPage={currentPage}
            totalPages={totalPages}
            goPrev={goPrev}
            goNext={goNext}
            submitAll={submitAll}
          />
        </div>
      </div>

    </div>
  );
}
