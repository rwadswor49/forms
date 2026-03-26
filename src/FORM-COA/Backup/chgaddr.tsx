// src/FORM-COA/chgaddr.tsx
import { useRef, useState } from "react";

import FormHeader from "../FormHeader";
import FormFooter from "../FormFooter";

import Chgaddr1_Signatories from "./chgaddr1_signatories"; // Signatories
import Chgaddr1 from "./chgaddr1"; // Plan Owners
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
  const page1Ref = useRef(null); // Signatories
  const page2Ref = useRef(null); // Plan Owners
  const page3Ref = useRef(null); // Company Details
  const page4Ref = useRef(null); // PEPs

  const refs = [page1Ref, page2Ref, page3Ref, page4Ref];

  /* ---------------------------------------------
     PAGE DATA
  --------------------------------------------- */
  const [page1Data, setPage1Data] = useState({});
  const [page2Data, setPage2Data] = useState({});
  const [page3Data, setPage3Data] = useState({});
  const [page4Data, setPage4Data] = useState({});

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

    setPrintMode(true);
  };

  /* ---------------------------------------------
     PAGE LABELS
  --------------------------------------------- */
  const pageLabels = [
    "Signatories",
    "Plan Owners",
    "Company Details",
    "PEPs"
  ];

  /* ---------------------------------------------
     EXTRACT PLAN OWNER 1 & 2 FOR AUTO-POPULATION IN PAGE 1
  --------------------------------------------- */
  const planOwner1 = page2Data?.owners?.[0] || null;
  const planOwner2 = page2Data?.owners?.[1] || null;

  /* ---------------------------------------------
     RENDER
  --------------------------------------------- */
  return (
    <div className="app">

      {!printMode && (
        <FormHeader
          currentPage={currentPage}
          totalPages={totalPages}
          pageLabels={pageLabels}
          setCurrentPage={setCurrentPage}
          goHome={goHome}
          formTitle={formTitle}
          printMode={printMode}
          setPrintMode={setPrintMode}
          onPrint={submitAll}
          visiblePages={[1, 2, 3, 4]}
        />
      )}

      <div className="page-container">
        <div className="main-layout">

          {/* MAIN FORM AREA */}
          <div className="form-area">

            {/* PAGE 1 — SIGNATORIES */}
            {currentPage === 1 && (
              <Chgaddr1_Signatories
                ref={page1Ref}
                data={page1Data}
                setData={setPage1Data}
                planOwner1={
                  planOwner1
                    ? {
                        fullName: planOwner1.fullName,
                        countryOfBirth: planOwner1.countryOfBirth
                      }
                    : null
                }
                planOwner2={
                  planOwner2
                    ? {
                        fullName: planOwner2.fullName,
                        countryOfBirth: planOwner2.countryOfBirth
                      }
                    : null
                }
              />
            )}

            {/* PAGE 2 — PLAN OWNERS */}
            {currentPage === 2 && (
              <Chgaddr1
                ref={page2Ref}
                data={page2Data}
                setData={setPage2Data}
              />
            )}

            {/* PAGE 3 — COMPANY DETAILS */}
            {currentPage === 3 && (
              <Chgaddr2
                ref={page3Ref}
                data={page3Data}
                setData={setPage3Data}
              />
            )}

            {/* PAGE 4 — PEPs */}
            {currentPage === 4 && (
              <Chgaddr3
                ref={page4Ref}
                data={page4Data}
                setData={setPage4Data}
              />
            )}

          </div>

          {/* SIDE PANEL */}
          <div className="side-panel">
            <div className="notes-panel">
              <h3>Important Notes</h3>

              {currentPage === 1 && (
                <ul>
                  <li>Provide details for all signatories.</li>
                  <li>Each signatory must include full tax residency information.</li>
                </ul>
              )}

              {currentPage === 2 && (
                <ul>
                  <li>Ensure all plan owner details are accurate.</li>
                  <li>Residential and correspondence addresses must be complete.</li>
                </ul>
              )}

              {currentPage === 3 && (
                <ul>
                  <li>Company details are required only if applicable.</li>
                  <li>Tax information must be accurate and complete.</li>
                </ul>
              )}

              {currentPage === 4 && (
                <ul>
                  <li>Include all PEPs, including family members and close associates.</li>
                </ul>
              )}
            </div>

            <div className="hints-panel">
              <h3>Hints & Tips</h3>
              <p>Use the navigation buttons above to move between sections.</p>
              <p>All information must be accurate for processing.</p>
            </div>
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
  );
}