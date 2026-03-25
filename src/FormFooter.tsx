type Props = {
  currentPage: number
  totalPages: number
  goPrev: () => void
  goNext: () => void
  submitAll: () => void
}

export default function FormFooter({
  currentPage,
  totalPages,
  goPrev,
  goNext,
  submitAll
}: Props) {
  return (
    <footer className="footer-nav">
     <div className="footer-inner">

      {/* NAVIGATION BUTTONS */}
      <div className="footer-buttons">

        <button
          type="button"
          onClick={goPrev}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {currentPage < totalPages ? (
          <button type="button" onClick={goNext}>
            Next
          </button>
        ) : (
          <button type="button" onClick={submitAll}>
            Submit All
          </button>
        )}

      </div>

      {/* COMPANY REGULATORY FOOTER TEXT */}
      <div className="footer-note">

        <p>
          RL360 Insurance Company Limited. Registered Office:
          International House, Cooil Road, Douglas,
          Isle of Man, IM2 2SP, British Isles.
        </p>

        <p>
          Registered in the Isle of Man number 137548C.
        </p>

        <p>
          Authorised by the Isle of Man Financial Services Authority.
        </p>

      </div>
     </div>
    </footer>

  )
}