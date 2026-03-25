// src/MultiPageForm.tsx

import { useRef, useState, useEffect } from "react"
import IndividualFormComponent, { PolicyholderFormValues } from "./IndividualFormComponent"
import TrustFormComponent, { TrustFormValues } from "./TrustFormComponent"
import CompanyDetailsFormComponent, { CompanyFormValues } from "./CompanyDetailsFormComponent"
import WithdrawalFormComponent, { SurrenderWithdrawalFormValues } from "./WithdrawalFormComponent"
import BankFormComponent, { PaymentInstructionsFormValues } from "./BankFormComponent"
import AssetFormComponent, { AssetFormValues } from "./AssetFormComponent"
import SampleFormComponent, { SampleFormValues } from "./SampleFormComponent"
import FormHeader from "../FormHeader"
import FormFooter from "../FormFooter"

type Props = {
  goHome?: () => void
  formTitle?: string
  showAllPages?: boolean   // ⭐ NEW
}

export default function MultiPageForm({ goHome, formTitle, showAllPages = false }: Props) {
  const totalPages = 7
  const [currentPage, setCurrentPage] = useState(1)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [importantNotesError, setImportantNotesError] = useState<string | null>(null)

  // --- State for all forms ---
  const [individualData, setIndividualData] = useState<PolicyholderFormValues>({
    policyNumber: "",
    policyholders: Array.from({ length: 2 }, () => ({
      firstName: "",
      lastName: "",
      alias: "",
      address1: "",
      address2: "",
      address3: "",
      city: "",
      postcode: "",
      country: "",
      dialCode: "",
      telephone: "",
      email: ""
    })),
    occupation: "",
    employmentStatus: "",
    statusDate: "",
    employerName: "",
    employerAddress: ""
  })

  const [trustData, setTrustData] = useState<TrustFormValues>({
    trustName: "",
    address1: "",
    address2: "",
    address3: "",
    city: "",
    postcode: "",
    country: "",
    intlDialCode: "",
    phone: "",
    email: ""
  })

  const [companyData, setCompanyData] = useState<CompanyFormValues>({
    companyName: "",
    address1: "",
    address2: "",
    address3: "",
    city: "",
    postcode: "",
    country: "",
    companyTaxRef: "",
    companyFatcaGIIN: "",
    intlDialCode: "",
    phone: "",
    email: ""
  })

  const [withdrawalData, setWithdrawalData] = useState<SurrenderWithdrawalFormValues>({
    requestType: undefined,
    fullSurrender: false,
    surrenderSegments: false,
    segmentsToSurrender: undefined,
    awareOfPenalties: false,
    maxWithdrawalNoPenalty: false,
    withdrawalAmount: undefined,
    withdrawalType: undefined,
    maxIfUnavailable: false,
    regularFrequency: undefined,
    startDate: "",
    cancelExistingWithdrawals: undefined,
    withdrawalCurrency: "",
    otherCurrency: "",
    withdrawalReason: [],
    otherReason: ""
  })

  const [bankData, setBankData] = useState<PaymentInstructionsFormValues>({
    accountName: "",
    bankName: "",
    bankAddress1: "",
    bankAddress2: "",
    bankAddress3: "",
    bankCity: "",
    bankPostcode: "",
    bankCountry: "",
    accountNumber: "",
    iban: "",
    swift: "",
    sortCode: "",
    currency: ""
  })

  const [assetData, setAssetData] = useState<AssetFormValues>({
    assets: [
      { investmentName: "", ticker: "", cashAmount: undefined, unitAmount: undefined, percentage: undefined, settlementCurrency: "" }
    ],
    additionalInfo: ""
  })

  const [sampleData, setSampleData] = useState<SampleFormValues>({
    declarationChecked: false,
    signatories: Array.from({ length: 4 }, () => ({
      date: new Date().toISOString().slice(0, 10),
      additionalTaxInfo: []
    }))
  })

  // --- Refs for validation ---
  const individualRef = useRef<any>(null)
  const trustRef = useRef<any>(null)
  const companyRef = useRef<any>(null)
  const withdrawalRef = useRef<any>(null)
  const bankRef = useRef<any>(null)
  const assetRef = useRef<any>(null)
  const sampleRef = useRef<any>(null)

  // Important Notes reset
  useEffect(() => {
    if (withdrawalData?.requestType === "withdrawal") {
      setImportantNotesError(null)
    }
  }, [withdrawalData?.requestType])

  // --- Navigation ---
  const goNext = async () => {
    setFormErrors([])
    setImportantNotesError("")

    let valid = false

    if (currentPage === 1) {
      const data = await individualRef.current?.submit()
      if (data) setIndividualData(data)
      valid = !!data
    } else if (currentPage === 2) {
      const data = await trustRef.current?.submit()
      if (data) setTrustData(data)
      valid = !!data
    } else if (currentPage === 3) {
      const data = await companyRef.current?.submit()
      if (data) setCompanyData(data)
      valid = !!data
    } else if (currentPage === 4) {
      const data = await withdrawalRef.current?.submit()
      if (data) setWithdrawalData(data)
      valid = !!data

      if (
        valid &&
        data.requestType === "surrender" &&
        data.surrenderOption &&
        !data.awareOfPenalties
      ) {
        setImportantNotesError(
          "Please confirm that you are aware of penalties before proceeding with a surrender."
        )
        valid = false
      }
    } else if (currentPage === 5) {
      const data = await bankRef.current?.submit()
      if (data) setBankData(data)
      valid = !!data
    } else if (currentPage === 6) {
      const data = await assetRef.current?.submit()
      if (data) setAssetData(data)
      valid = !!data
    }

    if (valid) setCurrentPage(currentPage + 1)
  }

  const goPrev = () => {
    setImportantNotesError("")
    setFormErrors([])
    setCurrentPage(Math.max(currentPage - 1, 1))
  }

  const submitAll = async () => {
    const sampleForm = await sampleRef.current?.submit()
    setSampleData(sampleForm || sampleData)

    const combinedData = {
      individualForm: individualData,
      trustForm: trustData,
      companyForm: companyData,
      withdrawalForm: withdrawalData,
      bankForm: bankData,
      assetForm: assetData,
      sampleForm: sampleForm || sampleData
    }

    const jsonStr = JSON.stringify(combinedData, null, 2)
    const now = new Date()
    const timestamp = now.toISOString().replace(/[:.]/g, "-")
    const filename = `form-data-${timestamp}.json`
    const blob = new Blob([jsonStr], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
    alert(`Form submitted! JSON downloaded as ${filename}`)
  }

  const pageLabels = [
    "Policyholder",
    "Trust",
    "Company",
    "Surrender/Withdrawal",
    "Bank Details",
    "Assets",
    "Declaration"
  ]

  // ⭐ NEW: visiblePages logic
  const visiblePages = showAllPages
    ? pageLabels.map((_, i) => i + 1)
    : [1]

  return (
    <div className="app">

      <FormHeader
        currentPage={currentPage}
        totalPages={totalPages}
        pageLabels={pageLabels}
        setCurrentPage={setCurrentPage}
        goHome={goHome}
        formTitle={formTitle}
        visiblePages={visiblePages}     // ⭐ NEW
        showAllPages={showAllPages}     // ⭐ NEW
      />

      <div className="page-container">
        <div className="main-layout">

          <div className="form-area">
            {currentPage === 1 && <IndividualFormComponent ref={individualRef} data={individualData} setData={setIndividualData} />}
            {currentPage === 2 && <TrustFormComponent ref={trustRef} data={trustData} setData={setTrustData} />}
            {currentPage === 3 && <CompanyDetailsFormComponent ref={companyRef} data={companyData} setData={setCompanyData} />}
            {currentPage === 4 && <WithdrawalFormComponent ref={withdrawalRef} data={withdrawalData} setData={setWithdrawalData} />}
            {currentPage === 5 && <BankFormComponent ref={bankRef} data={bankData} setData={setBankData} />}
            {currentPage === 6 && <AssetFormComponent ref={assetRef} data={assetData} setData={setAssetData} />}
            {currentPage === 7 && <SampleFormComponent ref={sampleRef} data={sampleData} setData={setSampleData} />}
          </div>

          {/* RIGHT NOTES PANEL */}
                  <div className="side-panel">
            <div className="notes-panel">
              <h3>Important Notes</h3>
              {importantNotesError && (
                <p style={{ color: "red", fontWeight: "bold", marginBottom: "10px" }}>
                {importantNotesError}
                </p>
              )}

              <ul>
                {currentPage === 1 && (
                  <>
                    <li>Enter the policyholder's full legal details.</li>
                    <li>Ensure address and contact information are correct.</li>
                    <hr />
                    <h4>Tax</h4>
                    <li>We recommend that you speak to your financial adviser or tax professional about your tax situation before taking action on your policy.</li>
                    <li>UK residents may be subject to a tax charge if withdrawals are in excess of the 5% cumulative withdrawals available (of initial and any additional investments) in a given policy year.</li>
                    <li>If you are tax resident in multiple countries please complete these details in the declaration section.</li>
                  </>
                )}
                {currentPage === 2 && (
                  <>
                    <li>Enter the trust details accurately.</li>
                    <li>Include all relevant trustees and beneficiaries.</li>
                  </>
                )}
                {currentPage === 3 && (
                  <>
                    <li>Enter company details including registration info.</li>
                    <li>Ensure company address is correct.</li>
                  </>
                )}
                {currentPage === 4 && (
                  <>
                    <h4>Surrender</h4>
                    <li>An early encashment charge or surrender fee may apply. We recommend you obtain a surrender quotation and speak to your financial adviser before completing this form.</li>
                    <hr />
                    <h4>Withdrawals</h4>
                    <li>Any withdrawals taken from your policy will be subject to the minimum withdrawal amounts as detailed in your policy literature.</li>
                    <li>The withdrawal amount may need to be reduced if it will take your policy below the minimum allowable policy value.</li>
                    <hr />
                    <h4>Required currency of withdrawal/surrender</h4>
                    <li>For regular premium products all payments will be made in the currency of your policy/plan.</li>
                    <li>For single premium products all payments will be made in the currency you selected in the Required currency of withdrawal/ surrender section.</li>
                  </>
                )}
                {currentPage === 5 && (
                  <>
                    <li>Please ensure the bank account belongs to the policyholder.</li>
                    <li>Incorrect bank details may delay payment.</li>
                  </>
                )}
                {currentPage === 6 && (
                  <>
                    <li>Add all assets associated with the entity.</li>
                    <li>Asset identifiers must be unique.</li>
                    <hr />
                    <li>Depending on the investment(s) to which the value of your policy is linked, some investment managers may have terms and conditions that prevents us from realising a cash value in a timely fashion and this could delay your payment.</li>
                  </>
                )}
                {currentPage === 7 && (
                  <>
                    <li>Please detail any additional countries and associated tax identification numbers by clicking on the <strong>add tax info button</strong> and entering details.</li>
                    <hr />
                    <h4>Specified US Person</h4>
                    <li>Specified US Person means a US citizen or tax resident individual who has a US residential/correspondence address or who either holds a US Passport, a US Green Card or who was born in the US and has not yet renounced their US citizenship. More information on US FATCA can be found at: www.irs.gov/Businesses/Corporations/Foreign-Account-Tax-Compliance-Act-FATCA.
                    If you choose Yes to being a Specified US Person, you will need to provide us with your US Taxpayer Identification Number (TIN) or US Social Security Number (SSN). If you choose No but you have a US residential/correspondence address, hold a US Passport, a US Green Card or you were born in the US, you will need to provide us with documentary evidence that you are in the process of or have renounced your US Citizenship. RL360 can accept a certified copy of your DS-4083 form (also known as CLN - Certificate of Loss of Nationality) and/or a certified copy of your passport from the country in which you have obtained new citizenship.</li>
                    <hr />
                    <h4>DATA PROTECTION/PERSONAL DATA (PRIVACY) ORDINANCE (‘PDPO’) PERSONAL INFORMATION COLLECTION STATEMENT (‘PICS’)</h4>
                    <li>
                      <strong>We take the responsibility of handling your personal data very seriously and we will only ask you for details required to process your requests to us. Please be aware of our privacy policy – please visit <a href="https://www.rl360.com/privacy" target="_blank" rel="noopener noreferrer">www.rl360.com/privacy</a> to view the full policy, or this can be provided on request from our Data Protection Officer.</strong>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="hints-panel">
              <h3>Hints & Tips</h3>

              {formErrors.length > 0 && (
                <div className="validation-errors">
                  <strong>Validation Issues</strong>
                  <ul>
                    {formErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {currentPage === 1 && <p>Provide all personal details for the individual.</p>}
              {currentPage === 2 && <p>Include trustees and trust info as per documents.</p>}
              {currentPage === 3 && <p>Provide registered company information.</p>}
              {currentPage === 4 && <p>Ensure withdrawal details match policy requirements.</p>}
              {currentPage === 5 && <p>Enter bank account details carefully.</p>}
              {currentPage === 6 && <p>Use "Add Another Row" to include multiple assets.</p>}
              {currentPage === 7 && <p>Don't forget to read the declaration and confirm by ticking the confirmation box</p>}
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
  )
}




