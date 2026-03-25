// src/PolicyholderForm.tsx
import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import isEqual from "lodash.isequal"
import "../App.css"
import countries from "../countries.json" // JSON file with { name, code, dialCode }

export type Policyholder = {
  firstName?: string
  lastName?: string
  alias?: string
  address1?: string
  address2?: string
  address3?: string
  city?: string
  postcode?: string
  country?: string
  dialCode?: string
  telephone?: string
  email?: string
}

export type PolicyholderFormValues = {
  policyNumber?: string
  policyholders: Policyholder[]
  occupation?: string
  employmentStatus?: string
  statusDate?: string
  employerName?: string
  employerAddress?: string
}

type Props = {
  data: PolicyholderFormValues
  setData: (data: PolicyholderFormValues) => void
}

const PolicyholderForm = forwardRef(({ data, setData }: Props, ref) => {
  const { register, trigger, getValues, reset, watch, setValue } =
    useForm<PolicyholderFormValues>({
      defaultValues: data,
      mode: "onBlur"
    })

  const [policyType, setPolicyType] = useState<"individual" | "joint" | undefined>()
  const prevValuesRef = useRef<PolicyholderFormValues>(data)

  useEffect(() => reset(data), [data, reset])

  useEffect(() => {
    const subscription = watch((values) => {
      if (!isEqual(prevValuesRef.current, values)) {
        prevValuesRef.current = values
        setData(values)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setData])

  const handlePolicyTypeChange = (type: "individual" | "joint") => {
    setPolicyType(type)
    const ph = getValues("policyholders") || []

    if (type === "individual") setValue("policyholders", [ph[0] || {}])
    else if (type === "joint") {
      const newPh = [...ph]
      if (newPh.length < 2) newPh.push({})
      setValue("policyholders", newPh)
    }
  }

  const displayedFields =
    getValues("policyholders")?.slice(
      0,
      policyType === "individual" ? 1 : policyType === "joint" ? 2 : 0
    ) || []

  useImperativeHandle(ref, () => ({
    submit: async () => {
      const valid = await trigger()
      if (!valid) {
        alert("Please fix errors in Policyholder Form. See console.")
        console.log("Validation errors:", getValues())
        return null
      }
      const values = getValues()
      setData(values)
      console.log("Policyholder Form Submitted:", JSON.stringify(values, null, 2))
      return values
    },
    getData: () => getValues()
  }))

  return (
    <form id="policyholderForm" className="policyholder-form">
      <h3>Policyholder / Beneficial Owner Details</h3>

      <div className="form-group">
        <label>Policy Number</label>
        <input {...register("policyNumber")} className="smallmed-input" />
      </div>

      {/* Policy Type */}
      <div className="form-group">
        <p>Please select if it's an Individual or Joint policy.</p>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="policyType"
              value="individual"
              checked={policyType === "individual"}
              onChange={() => handlePolicyTypeChange("individual")}
            />{" "}
            Individual
          </label>
          <label>
            <input
              type="radio"
              name="policyType"
              value="joint"
              checked={policyType === "joint"}
              onChange={() => handlePolicyTypeChange("joint")}
            />{" "}
            Joint
          </label>
        </div>
      </div>

      {displayedFields.map((_, index) => (
        <div key={index} className="policyholder-section">
          <h4>Policyholder {index + 1}</h4>

          <div className="form-group">
            <label>First Name(s)</label>
            <input {...register(`policyholders.${index}.firstName`)} className="xxlarge-input" />
          </div>

          <div className="form-group">
            <label>Last Name(s)</label>
            <input {...register(`policyholders.${index}.lastName`)} className="xxlarge-input" />
          </div>

          <div className="form-group">
            <label>Alias (if applicable)</label>
            <input {...register(`policyholders.${index}.alias`)} className="xxlarge-input" />
          </div>

          <h5>Address</h5>
          <div className="policyholder-address">
            <div className="form-group">
              <label>Address Line 1</label>
              <input {...register(`policyholders.${index}.address1`)} className="xxlarge-input" />
            </div>
            <div className="form-group">
              <label>Address Line 2</label>
              <input {...register(`policyholders.${index}.address2`)} className="xxlarge-input" />
            </div>
            <div className="form-group">
              <label>Address Line 3</label>
              <input {...register(`policyholders.${index}.address3`)} className="xxlarge-input" />
            </div>
          </div>

          <div className="policyholder-city-postcode-country">
            <div className="form-group">
              <label>City</label>
              <input {...register(`policyholders.${index}.city`)} className="medium-input" />
            </div>
            <div className="form-group">
              <label>Postcode</label>
              <input {...register(`policyholders.${index}.postcode`)} className="small-input" />
            </div>
            <div className="form-group">
              <label>Country</label>
              <select {...register(`policyholders.${index}.country`)} className="large-input">
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>International Dialing Code</label>
            <select {...register(`policyholders.${index}.dialCode`)} className="large-input">
              <option value="">Select code</option>
              {countries.map((c) => (
                <option key={c.code} value={c.dialCode}>
                  {c.name} {c.dialCode}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Telephone Number</label>
            <input {...register(`policyholders.${index}.telephone`)} className="smallmed-input" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" {...register(`policyholders.${index}.email`)} className="xxlarge-input" />
          </div>
        </div>
      ))}

      {policyType && (
        <>
          <h3>Employment Details</h3>
          <div className="form-group">
            <label>Occupation</label>
            <input {...register("occupation")} className="xxlarge-input" />
          </div>

          <div className="form-group">
            <label>Employment Status</label>
            <div className="radio-group">
              <label>
                <input type="radio" value="employed" {...register("employmentStatus")} /> Employed
              </label>
              <label>
                <input type="radio" value="selfEmployed" {...register("employmentStatus")} /> Self Employed
              </label>
              <label>
                <input type="radio" value="retired" {...register("employmentStatus")} /> Retired
              </label>
              <label>
                <input type="radio" value="unemployed" {...register("employmentStatus")} /> Unemployed
              </label>
              <label>
                <input type="radio" value="homemaker" {...register("employmentStatus")} /> Homemaker
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Date of retirement / unemployment / became homemaker</label>
            <input type="date" {...register("statusDate")} className="smallmed-input" />
          </div>

          <div className="form-group">
            <label>Name of Employer</label>
            <input {...register("employerName")} className="xxlarge-input" />
          </div>

          <div className="form-group">
            <label>Employer Address</label>
            <textarea {...register("employerAddress")} className="xxlarge-input" />
          </div>
        </>
      )}
    </form>
  )
})

export default PolicyholderForm