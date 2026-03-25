import { useRef, useState, useEffect } from "react";
import FormHeader from "../FormHeader";
import FormFooter from "../FormFooter";

import SourceOfWealthForm from "./SourceofWealth-1";     // PAGE 1
import EmploymentForm from "./SourceofWealth-1a";        // PAGE 2

import SourceOfWealthForm2 from "./SourceofWealth-2";
import PensionForm from "./SourceofWealth-3";
import InvestmentsForm from "./SourceofWealth-3a";
import ArtInvestmentsForm from "./SourceofWealth-3b";
import RealEstateForm from "./SourceofWealth-4";
import PropertyForm from "./SourceofWealth-4a";

import InheritanceForm from "./SourceofWealth-5";
import GiftAllowanceForm from "./SourceofWealth-5a";
import LotteryForm from "./SourceofWealth-6";
import SavingsForm from "./SourceofWealth-6a";
import OtherForm from "./SourceofWealth-6b";

export default function SourceOfWealth({ goHome, formTitle, printMode, setPrintMode }) {

  const totalPages = 13;
  const [currentPage, setCurrentPage] = useState(1);

  // -----------------------------
  // REFS
  // -----------------------------
  const form1Ref = useRef(null);   // Page 1
  const form2Ref = useRef(null);   // Page 2

  const form3Ref = useRef(null);
  const form4Ref = useRef(null);
  const form5Ref = useRef(null);
  const form6Ref = useRef(null);
  const form7Ref = useRef(null);
  const form8Ref = useRef(null);
  const form9Ref = useRef(null);
  const form10Ref = useRef(null);
  const form11Ref = useRef(null);
  const form12Ref = useRef(null);
  const form13Ref = useRef(null);

  // -----------------------------
  // PAGE DATA
  // -----------------------------
  const [page1Data, setPage1Data] = useState({
    planNumber: "",
    name: "",
    dobDate: "",
    wealthSources: []
  });

  const [page2Data, setPage2Data] = useState({
    employmentStatus: [],
    employmentRole: [],
    employerName: "",
    occupation: "",
    industry: "",
    natureOfBusiness: "",
    netWorth: "",
    salaryLastYear: "",
    bonus: "",
    joinDate: "",
    addressLine1: "",
    townOrCity: "",
    stateOrProvince: "",
    postalCode: "",
    country: ""
  });

  const [page3Data, setPage3Data] = useState({});
  const [page4Data, setPage4Data] = useState({});
  const [page5Data, setPage5Data] = useState({});
  const [page6Data, setPage6Data] = useState({});
  const [page7Data, setPage7Data] = useState({});
  const [page8Data, setPage8Data] = useState({});
  const [page9Data, setPage9Data] = useState({});
  const [page10Data, setPage10Data] = useState({});
  const [page11Data, setPage11Data] = useState({});
  const [page12Data, setPage12Data] = useState({});
  const [page13Data, setPage13Data] = useState({});

  // -----------------------------
  // PAGE LABELS
  // -----------------------------
  const pageLabels = [
    "Your Details",
    "Employment Information",
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

    if (selected.includes("salary")) pages.push(2);
    if (selected.includes("businessIncome")) pages.push(3);
    if (selected.includes("pension")) pages.push(4);
    if (selected.includes("investments")) pages.push(5);
    if (selected.includes("artInvestments")) pages.push(6);
    if (selected.includes("realEstate")) pages.push(7);
    if (selected.includes("propertySale")) pages.push(8);
    if (selected.includes("inheritance")) pages.push(9);
    if (selected.includes("gift")) pages.push(10);
    if (selected.includes("lotteryGamingWin")) pages.push(11);
    if (selected.includes("savings")) pages.push(12);
    if (selected.includes("other")) pages.push(13);

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
      sourceOfWealthPage4: page4Data,
      sourceOfWealthPage5: page5Data,
      sourceOfWealthPage6: page6Data,
      sourceOfWealthPage7: page7Data,
      sourceOfWealthPage8: page8Data,
      sourceOfWealthPage9: page9Data,
      sourceOfWealthPage10: page10Data,
      sourceOfWealthPage11: page11Data,
      sourceOfWealthPage12: page12Data,
      sourceOfWealthPage13: page13Data
    };

    localStorage.setItem("sow-data", JSON.stringify(allData));
  }, [
    page1Data,
    page2Data,
    page3Data,
    page4Data,
    page5Data,
    page6Data,
    page7Data,
    page8Data,
    page9Data,
    page10Data,
    page11Data,
    page12Data,
    page13Data
  ]);

  // -----------------------------
  // NAVIGATION
  // -----------------------------
  const refs = [
    form1Ref,
    form2Ref,
    form3Ref,
    form4Ref,
    form5Ref,
    form6Ref,
    form7Ref,
    form8Ref,
    form9Ref,
    form10Ref,
    form11Ref,
    form12Ref,
    form13Ref
  ];

  const goNext = async () => {
    const ref = refs[currentPage - 1];
    const valid = await ref.current?.submit();
    if (!valid) return;

    const index = visiblePages.indexOf(currentPage);
    const nextPage = visiblePages[index + 1];

    if (nextPage) setCurrentPage(nextPage);
  };

  const goPrev = () => {
    const index = visiblePages.indexOf(currentPage);
    const prevPage = visiblePages[index - 1];

    if (prevPage) setCurrentPage(prevPage);
  };

const submitAll = async () => {
  const allValidData: any = {};

  for (const page of visiblePages) {
    const ref = refs[page - 1];

    if (!ref.current) continue;

    const values = await ref.current.submit(); // returns null if invalid

    // optional: skip invalid pages instead of blocking
    if (values) {
      allValidData[`page${page}`] = values;
    } else {
      // only navigate if you want strict validation
      setCurrentPage(page);
      // optional: show alert here
      // alert(`Please complete page ${page}`);
      return;
    }
  }

  console.log("All collected data:", allValidData);

  // finally trigger print / PDF
  setPrintMode(true);
};


  const lastVisiblePage = visiblePages[visiblePages.length - 1];

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="app">

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
          showPrintButton={false}
        />

        <div className="page-container">
          <div className="main-layout">
            <div className="form-area">

              {currentPage === 1 && (
                <SourceOfWealthForm
                  ref={form1Ref}
                  data={page1Data}
                  setData={setPage1Data}
                />
              )}

              {currentPage === 2 && (
                <EmploymentForm
                  ref={form2Ref}
                  data={page2Data}
                  setData={setPage2Data}
                />
              )}

              {currentPage === 3 && (
                <SourceOfWealthForm2 ref={form3Ref} data={page3Data} setData={setPage3Data} />
              )}

              {currentPage === 4 && (
                <PensionForm ref={form4Ref} data={page4Data} setData={setPage4Data} />
              )}

              {currentPage === 5 && (
                <InvestmentsForm ref={form5Ref} data={page5Data} setData={setPage5Data} />
              )}

              {currentPage === 6 && (
                <ArtInvestmentsForm ref={form6Ref} data={page6Data} setData={setPage6Data} />
              )}

              {currentPage === 7 && (
                <RealEstateForm ref={form7Ref} data={page7Data} setData={setPage7Data} />
              )}

              {currentPage === 8 && (
                <PropertyForm ref={form8Ref} data={page8Data} setData={setPage8Data} />
              )}

              {currentPage === 9 && (
                <InheritanceForm ref={form9Ref} data={page9Data} setData={setPage9Data} />
              )}

              {currentPage === 10 && (
                <GiftAllowanceForm ref={form10Ref} data={page10Data} setData={setPage10Data} />
              )}

              {currentPage === 11 && (
                <LotteryForm ref={form11Ref} data={page11Data} setData={setPage11Data} />
              )}

              {currentPage === 12 && (
                <SavingsForm ref={form12Ref} data={page12Data} setData={setPage12Data} />
              )}

              {currentPage === 13 && (
                <OtherForm ref={form13Ref} data={page13Data} setData={setPage13Data} />
              )}

            </div>

            <div className="side-panel">
<div className="notes-panel">
  <h3>Important Notes</h3>
  {currentPage === 1 ? (
    <ul>
      <li>
        The Isle of Man Financial Services Authority requires all Isle of Man life companies to make enquiries as to how an applicant has acquired the monies to be used as payment for their plan. This reflects the Isle of Man’s commitment to maintain the highest possible standards of business practice and to counter money laundering and the financing of terrorism.
      </li>
      <li>
        RL360 take a risk-based approach to comply with this legislation by risk rating each customer as representing Standard or Higher risk.
      </li>
      <li>
        Where a higher risk of money laundering or terrorist financing has been identified, we must establish the customer’s source of wealth.
      </li>
      <li>
        Full details on our source of funds and wealth procedures can be obtained from your financial adviser.
      </li>
    </ul>
  ) : (
    <ul>
      <li>Only complete the sections relevant to your selected sources of wealth.</li>
      <li>Ensure all monetary values are accurate and supported by documentation.</li>
      <li>You can navigate between sections using the buttons above.</li>
    </ul>
  )}
</div>

              <div className="hints-panel">
                <h3>Hints & Tips</h3>
                <p>Employment, business income, and investments often require supporting documents.</p>
                <p>Inheritance, gifts, and property sales may require additional verification.</p>
              </div>
            </div>

          </div>

          <FormFooter
            currentPage={currentPage}
            totalPages={lastVisiblePage}
            goPrev={goPrev}
            goNext={goNext}
            submitAll={submitAll}
          />
        </div>
      </div>

    </div>
  );
}
