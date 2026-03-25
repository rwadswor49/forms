import { useRef, useState, useEffect } from "react";
import FormHeader from "../FormHeader";
import FormFooter from "../FormFooter";

import SourceOfWealthForm, { SourceOfWealthFormValues } from "./SourceofWealth-1";
import SourceOfWealthForm2, { SourceOfWealthForm2Values } from "./SourceofWealth-2";
import SourceOfWealthForm3, { SourceOfWealthForm3Values } from "./SourceofWealth-3";
import SourceOfWealthForm4, { SourceOfWealthForm4Values } from "./SourceofWealth-4";
import SourceOfWealthForm5, { SourceOfWealthForm5Values } from "./SourceofWealth-5";
import SourceOfWealthForm6, { SourceOfWealthForm6Values } from "./SourceofWealth-6";

type Props = {
  goHome?: () => void;
  formTitle?: string;
  setPrintMode: (value: boolean) => void;
  onPrint?: () => void;
};

export default function SourceOfWealth({ goHome, formTitle, setPrintMode, onPrint }: Props) {

  const totalPages = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const form1Ref = useRef<any>(null);
  const form2Ref = useRef<any>(null);
  const form3Ref = useRef<any>(null);
  const form4Ref = useRef<any>(null);
  const form5Ref = useRef<any>(null);
  const form6Ref = useRef<any>(null);

  // -----------------------------
  // PAGE 1 DATA
  // -----------------------------
  const [page1Data, setPage1Data] = useState<SourceOfWealthFormValues>({
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

  // Other pages unchanged...
  const [page2Data, setPage2Data] = useState<SourceOfWealthForm2Values>({ /* ... */ });
  const [page3Data, setPage3Data] = useState<SourceOfWealthForm3Values>({ /* ... */ });
  const [page4Data, setPage4Data] = useState<SourceOfWealthForm4Values>({ /* ... */ });
  const [page5Data, setPage5Data] = useState<SourceOfWealthForm5Values>({ /* ... */ });
  const [page6Data, setPage6Data] = useState<SourceOfWealthForm6Values>({ /* ... */ });

  const pageLabels = [
    "Employment",
    "Business Income",
    "Pension & Investments",
    "Real Estate / Property",
    "Inheritance / Gift / Allowance",
    "Lottery / Savings / SOF"
  ];

  // -----------------------------
  // DYNAMIC PAGE VISIBILITY
  // -----------------------------
  const [visiblePages, setVisiblePages] = useState<number[]>([1]);

  useEffect(() => {
    const selected = page1Data.wealthSources || [];
    const pages = [1];

    if (selected.includes("businessIncome")) pages.push(2);

    if (selected.includes("pension") || selected.includes("investments") || selected.includes("artInvestments"))
      pages.push(3);

    if (selected.includes("realEstate") || selected.includes("propertySale"))
      pages.push(4);

    if (selected.includes("inheritance") || selected.includes("gift"))
      pages.push(5);

    if (selected.includes("lotteryGamingWin") || selected.includes("savings") || selected.includes("other"))
      pages.push(6);

    setVisiblePages(pages);
  }, [page1Data.wealthSources]);

  // -----------------------------
  // NAVIGATION
  // -----------------------------
  const goNext = async () => {
    let valid = false;

    if (currentPage === 1) valid = !!(await form1Ref.current?.submit());
    if (currentPage === 2) valid = !!(await form2Ref.current?.submit());
    if (currentPage === 3) valid = !!(await form3Ref.current?.submit());
    if (currentPage === 4) valid = !!(await form4Ref.current?.submit());
    if (currentPage === 5) valid = !!(await form5Ref.current?.submit());
    if (currentPage === 6) valid = !!(await form6Ref.current?.submit());

    if (valid && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goPrev = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const submitAll = async () => {
    const refs = [form1Ref, form2Ref, form3Ref, form4Ref, form5Ref, form6Ref];

    for (let i = 0; i < refs.length; i++) {
      const valid = await refs[i].current?.submit();
      if (!valid) {
        setCurrentPage(i + 1);
        return;
      }
    }

    setPrintMode(true);
  };

  return (
    <div className="app">

      <FormHeader
        currentPage={currentPage}
        totalPages={totalPages}
        pageLabels={pageLabels}
        setCurrentPage={setCurrentPage}
        goHome={goHome}
        formTitle={formTitle}
        setPrintMode={setPrintMode}
        onPrint={submitAll}
        visiblePages={visiblePages} // NEW
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
              <SourceOfWealthForm3 ref={form3Ref} data={page3Data} setData={setPage3Data} />
            </div>

            <div style={{ display: currentPage === 4 ? "block" : "none" }}>
              <SourceOfWealthForm4 ref={form4Ref} data={page4Data} setData={setPage4Data} />
            </div>

            <div style={{ display: currentPage === 5 ? "block" : "none" }}>
              <SourceOfWealthForm5 ref={form5Ref} data={page5Data} setData={setPage5Data} />
            </div>

            <div style={{ display: currentPage === 6 ? "block" : "none" }}>
              <SourceOfWealthForm6 ref={form6Ref} data={page6Data} setData={setPage6Data} />
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
  );
}

