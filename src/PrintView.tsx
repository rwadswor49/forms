import { PDFViewer } from "@react-pdf/renderer";
import SourceOfWealthPDF from "./pdf/SourceOfWealthPDF";

type Props = {
  exitPrintView: () => void;
  formType: "surrender" | "wealth";
};

export default function PrintView({ exitPrintView, formType }: Props) {
  // Safe localStorage parsing
  let raw: any = {};
  try {
    raw = JSON.parse(localStorage.getItem("sow-data") || "{}");
  } catch {
    raw = {};
  }

  const data = {
    page1: raw.sourceOfWealthPage1 || {},
    page2: raw.sourceOfWealthPage2 || {},
    page3: raw.sourceOfWealthPage3 || {},
    page4: raw.sourceOfWealthPage4 || {},
    page5: raw.sourceOfWealthPage5 || {},
    page6: raw.sourceOfWealthPage6 || {},
    page7: raw.sourceOfWealthPage7 || {},
    page8: raw.sourceOfWealthPage8 || {},
    page9: raw.sourceOfWealthPage9 || {},
    page10: raw.sourceOfWealthPage10 || {},
    page11: raw.sourceOfWealthPage11 || {},
    page12: raw.sourceOfWealthPage12 || {},
    page13: raw.sourceOfWealthPage13 || {},
  };

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
            <SourceOfWealthPDF data={data} />
          </PDFViewer>
        )}
      </div>
    </div>
  );
}