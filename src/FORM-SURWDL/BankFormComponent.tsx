// src/BankFormComponent.tsx
import { useForm, useWatch } from "react-hook-form"
import { forwardRef, useImperativeHandle, useEffect, useRef } from "react"
import isEqual from "lodash.isequal"
import "../App.css"
import countries from "../countries.json" // JSON file with { name, code, dialCode }

export type PaymentInstructionsFormValues = {
  paymentMethod?: "BACS" | "TT"

  bankName?: string
  bankAddress1?: string
  bankAddress2?: string
  bankAddress3?: string
  city?: string
  postcode?: string
  country?: string

  accountHolderName?: string
  accountCurrency?: string

  accountNumber?: string
  swiftCode?: string
  sortCode1?: string
  sortCode2?: string
  sortCode3?: string

  bankCountryExplanation?: string

  routingBankName?: string
  routingAccountNumber?: string
  routingSwiftCode?: string
  branchCode?: string
  abaNumber?: string
}

const PaymentInstructionsFormComponent = forwardRef(
  ({ data, setData }, ref) => {
    const {
      register,
      handleSubmit,
      trigger,
      getValues,
      reset,
      control,
      formState: { errors }
    } = useForm<PaymentInstructionsFormValues>({
      defaultValues: data,
      mode: "onBlur"
    })

    // Reset form on initial mount
    const initialized = useRef(false)
    useEffect(() => {
      if (!initialized.current) {
        reset(data)
        initialized.current = true
      }
    }, [data, reset])

    // Watch all values to update parent when changed
    const watchedValues = useWatch({ control })
    const prevValuesRef = useRef<PaymentInstructionsFormValues>(data)
    useEffect(() => {
      if (!isEqual(prevValuesRef.current, watchedValues)) {
        setData(watchedValues)
        prevValuesRef.current = watchedValues
      }
    }, [watchedValues, setData])

    // Expose submit/getData to parent
    useImperativeHandle(ref, () => ({
      submit: async () => {
        const valid = await trigger()
        if (!valid) {
          console.log("Payment Instructions validation errors:", errors)
          alert("Please fix validation errors in this form")
          return null
        }

        let dataOut: PaymentInstructionsFormValues | null = null
        await new Promise<void>((resolve) => {
          handleSubmit((formData) => {
            dataOut = formData
            console.log("Payment Instructions Submitted:", JSON.stringify(dataOut, null, 2))
            resolve()
          })()
        })
        return dataOut
      },
      getData: () => getValues()
    }))

    // Determine selected payment method for conditional rendering
    const paymentMethod = watchedValues.paymentMethod

    return (
      <form id="paymentInstructionsForm">
        <h3>PAYMENT INSTRUCTIONS – BANK CHARGES WILL BE INCURRED BY YOU</h3>

        {/* Payment Method */}
        <div className="radio-group">
          <label>
            <input type="radio" value="BACS" {...register("paymentMethod")} />
            BACS (GBP account in the UK only)
          </label>
          <label>
            <input type="radio" value="TT" {...register("paymentMethod")} />
            Telegraphic Transfer (TT)
          </label>
        </div>

        {/* Bank Details */}
        {[
          ["Bank name", "bankName", "xxlarge-input"],
          ["Bank address line 1", "bankAddress1", "xxlarge-input"],
          ["Bank address line 2", "bankAddress2", "xxlarge-input"],
          ["Bank address line 3", "bankAddress3", "xxlarge-input"],
          ["City", "city", "medium-input"],
          ["Post code", "postcode", "small-input"],
          ["Account holder’s name", "accountHolderName", "large-input"],
          ["Account currency (if applicable)", "accountCurrency", "small-input"]
        ].map(([label, field, cls]) => (
          <div className="form-group" key={field as string}>
            <label>{label}</label>
            <input {...register(field as any)} className={cls} />
          </div>
        ))}

        {/* Country Dropdown from JSON */}
        <div className="form-group">
          <label>Country</label>
          <select {...register("country")} className="large-input">
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Account Number & Swift/BIC */}
        <div style={{ display: "flex", gap: "6px" }}>
          {[
            ["Account number or IBAN", "accountNumber", "x-small-input"],
            ["Swift/BIC Code", "swiftCode", "x-small-input"]
          ].map(([label, field, cls]) => (
            <div className="form-group" key={field as string} style={{ flex: "0 0 auto" }}>
              <label>{label}</label>
              <input {...register(field as any)} className={cls} />
            </div>
          ))}
        </div>

        {/* Conditional Bank Sort Code (BACS only) */}
        {paymentMethod === "BACS" && (
          <div className="form-group">
            <label>Bank Sort Code (BACS payments only)</label>
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                {...register("sortCode1")}
                className="xxxx-small-input"
                style={{ flex: "0 0 auto", width: "3em" }}
                placeholder="XX"
              />
              <input
                {...register("sortCode2")}
                className="xx-small-input"
                style={{ flex: "0 0 auto", width: "3em" }}
                placeholder="XX"
              />
              <input
                {...register("sortCode3")}
                className="xx-small-input"
                style={{ flex: "0 0 auto", width: "3em" }}
                placeholder="XX"
              />
            </div>
          </div>
        )}

        {/* Bank Country Explanation */}
        <div className="form-group">
          <label>
            Please confirm your connection to the country where your bank
            account is held if this differs from your residency
          </label>
          <textarea rows={4} style={{ width: "100%" }} {...register("bankCountryExplanation")} />
        </div>

        <h3>ROUTING / INTERMEDIARY / CORRESPONDING BANK DETAILS (IF APPLICABLE)</h3>

        {[
          ["Routing bank name", "routingBankName", "small-input"],
          ["Routing bank account number", "routingAccountNumber", "x-small-input"],
          ["Routing bank Swift code", "routingSwiftCode", "x-small-input"],
          ["Branch Code (Hong Kong payments)", "branchCode", "xx-small-input"],
          ["ABA number (US Payments)", "abaNumber", "xx-small-input"]
        ].map(([label, field, cls]) => (
          <div className="form-group" key={field as string}>
            <label>{label}</label>
            <input {...register(field as any)} className={cls} />
          </div>
        ))}
      </form>
    )
  }
)

export default PaymentInstructionsFormComponent