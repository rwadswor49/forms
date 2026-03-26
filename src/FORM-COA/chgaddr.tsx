import { useRef, useState, useEffect } from "react";

import FormHeader from "../FormHeader";
import FormFooter from "../FormFooter";

import Chgaddr1 from "./chgaddr1"; // Plan Owners
import Chgaddr1_Signatories from "./chgaddr1_signatories"; // Signatories
import Chgaddr2 from "./chgaddr2"; // Company Details
import Chgaddr3 from "./chgaddr3"; // PEPs

export default function Chgaddr({
  goHome,
  formTitle,
  printMode,
  setPrintMode
}) {
  const totalPages = 4;
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------------------------------------
     REFS FOR EACH PAGE
  --------------------------------------------- */
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const page3Ref = useRef(null);
  const page4Ref = useRef(null);

  const refs = [page1Ref, page2Ref, page3Ref, page4Ref];

  /* ---------------------------------------------
     PAGE DATA
  --------------------------------------------- */
  const [page1Data, setPage1Data] = useState({});
  const [page2Data, setPage2Data] = useState({});
  const [page3Data, setPage3Data] = useState({});
  const [page4Data, setPage4Data] = useState({});

  /* ---------------------------------------------
     RESTORE LOCAL STORAGE ONCE
  --------------------------------------------- */
  useEffect(() => {
    const saved1 = localStorage.getItem("chgaddr_page1");
    const saved2 = localStorage.getItem("chgaddr_page2");
    const saved3 = localStorage.getItem("chgaddr_page3");
    const saved4 = localStorage.getItem("chgaddr_page4");

    if (saved1) setPage1Data(JSON.parse(saved1));
    if (saved2) setPage2Data(JSON.parse(saved2));
    if (saved3) setPage3Data(JSON.parse(saved3));
    if (saved4) setPage4Data(JSON.parse(saved4));
  }, []);

  /* ---------------------------------------------
     SAVE EACH PAGE TO LOCAL STORAGE
  --------------------------------------------- */
  useEffect(() => {
    localStorage.setItem("chgaddr_page1", JSON.stringify(page1Data));
  }, [page1Data]);

  useEffect(() => {
    localStorage.setItem("chgaddr_page2", JSON.stringify(page2Data));
  }, [page2Data]);

  useEffect(() => {
    localStorage.setItem("chgaddr_page3", JSON.stringify(page3Data));
  }, [page3Data]);

  useEffect(() => {
    localStorage.setItem("chgaddr_page4", JSON.stringify(page4Data));
  }, [page4Data]);

  /* ---------------------------------------------
     CLEAR STORAGE WHEN LEAVING FORM
  --------------------------------------------- */
  const clearFormStorage = () => {
    localStorage.removeItem("chgaddr_page1");
    localStorage.removeItem("chgaddr_page2");
    localStorage.removeItem("chgaddr_page3");
    localStorage.removeItem("chgaddr_page4");
  };

  const handleGoHome = () => {
    clearFormStorage();
    goHome();
  };

  /* ---------------------------------------------
     NAVIGATION
  --------------------------------------------- */
  const goNext = async () => {
    const ref = refs[currentPage - 1];
    const valid = await ref.current?.submit();
    if (!valid) return;

    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const submitAll = async () => {
    const allValidData = {};

    for (let page = 1; page <= totalPages; page++) {
      const ref = refs[page - 1];
      const values = await ref.current.submit();
      if (!values) {
        setCurrentPage(page);
        return;
      }
      allValidData[`page${page}`] = values;
    }

    clearFormStorage();
    setPrintMode(true);
  };

  /* ---------------------------------------------
     PLAN OWNER DATA FOR SIGNATORIES PAGE
  --------------------------------------------- */
  const owners = page1Data?.owners || [];

  const planOwner1 = owners[0]
    ? {
        fullName: `${owners[0].firstName || ""} ${owners[0].lastName || ""}`.trim(),
        countryOfBirth: owners[0].country || ""
      }
    : null;

  const planOwner2 = owners[1]
    ? {
        fullName: `${owners[1].firstName || ""} ${owners[1].lastName || ""}`.trim(),
        countryOfBirth: owners[1].country || ""
      }
    : null;

  /* ---------------------------------------------
     RENDER (KEEP ALL PAGES MOUNTED)
  --------------------------------------------- */
  return (
    <div className="app">
      {!printMode && (
        <FormHeader
          currentPage={currentPage}
          totalPages={totalPages}
          pageLabels={["Plan Owners", "Signatories", "Company Details", "PEPs"]}
          setCurrentPage={setCurrentPage}
          goHome={handleGoHome}
          formTitle={formTitle}
          printMode={printMode}
          setPrintMode={setPrintMode}
          onPrint={submitAll}
          visiblePages={[1, 2, 3, 4]}
        />
      )}

      <div className="page-container">
        <div className="main-layout">
          <div className="form-area">
            <div style={{ display: currentPage === 1 ? "block" : "none" }}>
              <Chgaddr1 ref={page1Ref} data={page1Data} setData={setPage1Data} />
            </div>

            <div style={{ display: currentPage === 2 ? "block" : "none" }}>
              <Chgaddr1_Signatories
                ref={page2Ref}
                data={page2Data}
                setData={setPage2Data}
                planOwner1={planOwner1}
                planOwner2={planOwner2}
              />
            </div>

            <div style={{ display: currentPage === 3 ? "block" : "none" }}>
              <Chgaddr2 ref={page3Ref} data={page3Data} setData={setPage3Data} />
            </div>

            <div style={{ display: currentPage === 4 ? "block" : "none" }}>
              <Chgaddr3 ref={page4Ref} data={page4Data} setData={setPage4Data} />
            </div>
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

