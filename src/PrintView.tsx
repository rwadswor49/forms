import { PDFViewer } from "@react-pdf/renderer";
import SourceOfWealthPDF from "./pdf/SourceOfWealthPDF";
import ChgaddrPDF from "./pdf/ChgaddrPDF";

type Props = {
  exitPrintView: () => void;
  formType: "surrender" | "wealth" | "chgaddr";
};

export default function PrintView({ exitPrintView, formType }: Props) {
  let raw: any = {};

  try {
    if (formType === "wealth") {
      const sow = JSON.parse(localStorage.getItem("sow-data") || "{}");

      raw = {
        page1: sow.sourceOfWealthPage1 || {},
        page2: sow.sourceOfWealthPage2 || {},
        page3: sow.sourceOfWealthPage3 || {},
        page4: sow.sourceOfWealthPage4 || {},
        page5: sow.sourceOfWealthPage5 || {},
        page6: sow.sourceOfWealthPage6 || {},
        page7: sow.sourceOfWealthPage7 || {},
        page8: sow.sourceOfWealthPage8 || {},
        page9: sow.sourceOfWealthPage9 || {},
        page10: sow.sourceOfWealthPage10 || {},
        page11: sow.sourceOfWealthPage11 || {},
        page12: sow.sourceOfWealthPage12 || {},
        page13: sow.sourceOfWealthPage13 || {},
      };
    }

    if (formType === "chgaddr") {
      raw = {
        page1: JSON.parse(localStorage.getItem("chgaddr_page1") || "{}"),
        page2: JSON.parse(localStorage.getItem("chgaddr_page2") || "{}"),
        page3: JSON.parse(localStorage.getItem("chgaddr_page3") || "{}"),
        page4: JSON.parse(localStorage.getItem("chgaddr_page4") || "{}"),
      };
    }
  } catch {
    raw = {};
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div
        style={{
          width: "100%",
          padding: "10px",
          marginLeft: "calc((100% - 800px) / 2)",
        }}
      >
        <button
          onClick={exitPrintView}
          style={{
            padding: "10px 18px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          ← Back
        </button>
      </div>

      {/* PDF Viewer */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "20px",
          height: "100%",
          overflow: "auto",
        }}
      >
        {formType === "wealth" && (
          <PDFViewer width="800" height="1100">
            <SourceOfWealthPDF data={raw} />
          </PDFViewer>
        )}

        {formType === "chgaddr" && (
          <PDFViewer width="800" height="1100">
            <ChgaddrPDF data={raw} />
          </PDFViewer>
        )}
      </div>
    </div>
  );
}
