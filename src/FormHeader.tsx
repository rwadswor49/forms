import logo from "./rl360logo.png";

type Props = {
  currentPage: number;
  totalPages: number;
  pageLabels: string[];
  setCurrentPage: (page: number) => void;
  printMode: boolean;
  setPrintMode: (value: boolean) => void;
  formTitle?: string;
  showButtons?: boolean;
  goHome?: () => void;
  onPrint?: () => void;
  visiblePages?: number[]; 
  showAllPages?: boolean; 
  showPrintButton?: boolean;  
};

export default function FormHeader({
  currentPage,
  totalPages,
  pageLabels,
  setCurrentPage,
  printMode,
  setPrintMode,
  formTitle,
  goHome,
  showButtons = true,
  visiblePages = [1],
  showAllPages = false, 
  showPrintButton = true 
}: Props) {
  return (
    <div className="sticky-header">

      <h1 className="form-title">
        {formTitle || "Available Online Forms"}
      </h1>

      <div className="sticky-top-row">

        {showButtons && (
          <div className="page-buttons">

            {goHome && (
              <button onClick={goHome} className="home-button">
                🏠 Home
              </button>
            )}

            {pageLabels.map((label, index) => {
              const pageNumber = index + 1;

              // NEW LOGIC:
              // If showAllPages = true → show everything
              // Otherwise → only show pages in visiblePages
              const shouldShow = showAllPages || visiblePages.includes(pageNumber);
              if (!shouldShow) return null;

              return (
                <button
                  key={pageNumber}
                  className={currentPage === pageNumber ? "active" : ""}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {label}
                </button>
              );
            })}

            {showPrintButton && (
                 <button onClick={() => setPrintMode(true)}> 
                 Print / Save as PDF
            </button>
            )}

          </div>
        )}

        <img src={logo} alt="Company Logo" className="logo" />

      </div>

      <div className="step-indicator">
        Page {currentPage} of {totalPages}
      </div>

    </div>
  );
}
