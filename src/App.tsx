// src/App.tsx
import { useState } from "react";

import MultiPageForm from "./FORM-SURWDL/MultiPageForm";
import SourceOfWealth from "./FORM-SOW/SourceOfWealth";
import Chgaddr from "./FORM-COA/chgaddr";

import FormHeader from "./FormHeader";
import FormFooter from "./FormFooter";
import PrintView from "./PrintView";

import "./App.css";

type FormType = "menu" | "surrender" | "wealth" | "chgaddr";

export default function App() {
  const [activeForm, setActiveForm] = useState<FormType>("menu");
  const [printMode, setPrintMode] = useState(false);

  // ---------------------------------------------
  // CLEAR ALL CHANGE OF ADDRESS AUTOSAVE DATA
  // ---------------------------------------------
  const clearCOAData = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("chgaddr_"))
      .forEach((k) => localStorage.removeItem(k));
  };

  // Load saved data for PDF (SOW only)
  const saved = JSON.parse(localStorage.getItem("sow-data") || "{}");

  const pdfData = {
    page1: saved.sourceOfWealthPage1 || {},
    page2: saved.sourceOfWealthPage2 || {},
    page3: saved.sourceOfWealthPage3 || {},
    page4: saved.sourceOfWealthPage4 || {},
    page5: saved.sourceOfWealthPage5 || {},
    page6: saved.sourceOfWealthPage6 || {}
  };

  return (
    <div className="app">

      {/* ----------------------------- */}
      {/* FORM UI (hidden when printing) */}
      {/* ----------------------------- */}
      <div style={{ display: printMode ? "none" : "block" }}>

        {/* SURRENDER / WITHDRAWAL FORM */}
        {activeForm === "surrender" && (
          <MultiPageForm
            goHome={() => setActiveForm("menu")}
            setPrintMode={setPrintMode}
            formTitle="Surrender / Withdrawal Request"
            showAllPages={true}
          />
        )}

        {/* SOURCE OF WEALTH FORM */}
        {activeForm === "wealth" && (
          <SourceOfWealth
            goHome={() => setActiveForm("menu")}
            printMode={printMode}
            setPrintMode={setPrintMode}
            formTitle="Source of Wealth"
            showAllPages={false}
          />
        )}

        {/* CHANGE OF ADDRESS FORM */}
        {activeForm === "chgaddr" && (
          <Chgaddr
            goHome={() => setActiveForm("menu")}
            printMode={printMode}
            setPrintMode={setPrintMode}
            formTitle="Change of Address"
          />
        )}

        {/* MENU SCREEN */}
        {activeForm === "menu" && (
          <>
            <FormHeader
              currentPage={1}
              totalPages={1}
              pageLabels={["Menu"]}
              setCurrentPage={() => {}}
              formTitle="Available Online Forms"
              printMode={false}
              setPrintMode={() => {}}
              showButtons={false}
            />

            <div className="page-scroll-area">
              <div className="page-container">
                <div className="main-layout">

                  {/* MAIN FORM SELECTION */}
                  <div className="form-area">
                    <h1>Select a Form</h1>

                    <div style={{ marginTop: "40px" }}>
                      <button
                        style={{ marginRight: "20px", padding: "12px 24px" }}
                        onClick={() => setActiveForm("surrender")}
                      >
                        Surrender / Withdrawal Form
                      </button>

                      <button
                        style={{ marginRight: "20px", padding: "12px 24px" }}
                        onClick={() => {
                          localStorage.removeItem("sow-data");
                          setActiveForm("wealth");
                        }}
                      >
                        Source of Wealth Form
                      </button>

                      <button
                        style={{ padding: "12px 24px" }}
                        onClick={() => {
                          clearCOAData();
                          setActiveForm("chgaddr");
                        }}
                      >
                        Change of Address Form
                      </button>
                    </div>
                  </div>

                  {/* SIDE PANEL */}
                  <div className="side-panel">
                    <div className="notes-panel">
                      <h3>Important Notes</h3>
                      <ul>
                        <li>Select the form you wish to complete.</li>
                        <li>Ensure you have all required information before starting.</li>
                        <li>You can return to this screen using the Home button.</li>
                      </ul>
                    </div>

                    <div className="hints-panel">
                      <h3>Hints & Tips</h3>
                      <p>The Surrender / Withdrawal form is used to request withdrawals or full surrender of an RL360 policy.</p>
                      <p>The Source of Wealth form collects information regarding income, investments, and significant assets.</p>
                      <p>The Change of Address form updates your residential details and may require proof of address.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* FOOTER */}
              <FormFooter
                currentPage={1}
                totalPages={1}
                goPrev={() => {}}
                goNext={() => {}}
                submitAll={() => {}}
              />
            </div>
          </>
        )}

      </div>

      {/* ----------------------------- */}
      {/* PDF VIEW (hidden when not printing) */}
      {/* ----------------------------- */}
      <div style={{ display: printMode ? "block" : "none" }}>
        <PrintView
          exitPrintView={() => setPrintMode(false)}
          formType={activeForm}
          pdfData={pdfData}
        />
      </div>

    </div>
  );
}

