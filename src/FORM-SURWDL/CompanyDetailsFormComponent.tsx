// src/CompanyDetailsFormComponent.tsx
import React, { forwardRef, useImperativeHandle } from "react"
import countries from "../countries.json"

export interface CompanyFormValues {
  companyName?: string
  address1?: string
  address2?: string
  address3?: string
  city?: string
  postcode?: string
  country?: string
  companyTaxRef?: string
  companyFatcaGIIN?: string
  intlDialCode?: string
  phone?: string
  email?: string
}

export type CompanyFormHandle = {
  submit: () => Promise<CompanyFormValues | null>
  getData: () => CompanyFormValues
}

const CompanyDetailsFormComponent = forwardRef<
  CompanyFormHandle,
  { data: CompanyFormValues; setData: (d: CompanyFormValues) => void }
>(({ data, setData }, ref) => {

  const handleChange = (field: keyof CompanyFormValues, value: string) => {
    setData({ ...data, [field]: value })
  }

  useImperativeHandle(ref, () => ({
    submit: async () => data,
    getData: () => data
  }))

  const fields: [string, keyof CompanyFormValues][] = [
    ["Company name", "companyName"],
    ["Address line 1", "address1"],
    ["Address line 2", "address2"],
    ["Address line 3", "address3"],
    ["City", "city"],
    ["Post code", "postcode"],
    ["Company tax reference number", "companyTaxRef"],
    ["Company FATCA GIIN", "companyFatcaGIIN"]
  ]

  return (
    <form className="company-details-form policyholder-form">

      <h3 style={{ color: "red" }}>Company details (if applicable)</h3>

      {fields.map(([label, field]) => (
        <div className="form-group" key={field}>
          <label>{label}</label>
          <input
            className="xxlarge-input"
            value={data[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        </div>
      ))}

      {/* Country dropdown */}
      <div className="form-group">
        <label>Country</label>
        <select
          className="xlarge-input"
          value={data.country || ""}
          onChange={(e) => handleChange("country", e.target.value)}
        >
          <option value="">Select country</option>
          {countries.map((c) => (
            <option key={c.code} value={c.name}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>
      </div>

      {/* Dial code dropdown */}
      <div className="form-group">
        <label>International dialing code</label>
        <select
          className="xlarge-input"
          value={data.intlDialCode || ""}
          onChange={(e) => handleChange("intlDialCode", e.target.value)}
        >
          <option value="">Select dial code</option>
          {countries.map((c) => (
            <option key={c.code} value={c.dialCode}>
              {c.name} ({c.dialCode})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Telephone number</label>
        <input
          className="xlarge-input"
          value={data.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Email address</label>
        <input
          className="xxxlarge-input"
          type="email"
          value={data.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>

    </form>
  )
})

export default CompanyDetailsFormComponent


