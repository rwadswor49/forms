// src/SurrenderWithdrawalFormComponent.tsx
import { useForm, useWatch } from "react-hook-form"
import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from "react"
import isEqual from "lodash.isequal"
import "../App.css"

export type SurrenderWithdrawalFormValues = {
  requestType?: "surrender" | "withdrawal"
  surrenderOption?: "full" | "segments"
  segmentsToSurrender?: number
  awareOfPenalties?: boolean
  maxWithdrawalNoPenalty?: boolean
  withdrawalAmount?: number
  withdrawalType?: "oneoff" | "regular"
  maxIfUnavailable?: boolean
  regularFrequency?: "Monthly" | "Quarterly" | "Half-yearly" | "Yearly"
  startDate?: string
  cancelExistingWithdrawals?: "Yes" | "No"
  withdrawalCurrency?: string
  otherCurrency?: string
  withdrawalReason?: string[]
  otherReason?: string
}

const SurrenderWithdrawalFormComponent = forwardRef(
  ({ data, setData }, ref) => {
    const [importantNotesError, setImportantNotesError] = useState("")

    const {
      register,
      handleSubmit,
      trigger,
      getValues,
      reset,
      control,
      watch,
      setValue,
      clearErrors,
      formState: { errors }
    } = useForm<SurrenderWithdrawalFormValues>({
      defaultValues: data,
      mode: "onBlur",
      shouldUnregister: true
    })

    const initialized = useRef(false)
    useEffect(() => {
      if (!initialized.current) {
        reset(data)
        initialized.current = true
      }
    }, [data, reset])


// CLEAR ERRORS

const requestTypeRegister = register("requestType", {
  onChange: () => { clearErrors();
    setImportantNotesError(null)
}
})


const watchedValues = useWatch({ control })
const lastRequestType = useRef<SurrenderWithdrawalFormValues["requestType"] | null>(data.requestType || null)

useEffect(() => {
  const currentType = watchedValues.requestType

  if (currentType && currentType !== lastRequestType.current) {

    if (currentType === "withdrawal") {
      clearErrors([
        "surrenderOption",
        "segmentsToSurrender",
        "awareOfPenalties"
      ])

      setValue("surrenderOption", undefined)
      setValue("segmentsToSurrender", undefined)
      setValue("awareOfPenalties", false)
    }

    if (currentType === "surrender") {
      clearErrors([
        "maxWithdrawalNoPenalty",
        "withdrawalAmount",
        "withdrawalType",
        "maxIfUnavailable",
        "regularFrequency",
        "startDate",
        "cancelExistingWithdrawals"
      ])

      setValue("maxWithdrawalNoPenalty", undefined)
      setValue("withdrawalAmount", undefined)
      setValue("withdrawalType", undefined)
      setValue("maxIfUnavailable", false)
      setValue("regularFrequency", undefined)
      setValue("startDate", "")
      setValue("cancelExistingWithdrawals", undefined)
    }

    // Wait for RHF to clear errors before updating parent
    setTimeout(() => {
      setData(getValues())
    }, 0)

    lastRequestType.current = currentType
  }
}, [watchedValues.requestType])



useImperativeHandle(ref, () => ({
  // canProceed just always returns true, parent handles any surrender checks
  canProceed: () => true,

  // Submit form and return values
  submit: async () => {
    const valid = await trigger();
    if (!valid) {
      console.log("Surrender/Withdrawal Form validation errors:", errors);
      alert("Please fix validation errors in this form");
      return null;
    }

    let out: SurrenderWithdrawalFormValues | null = null;
    await new Promise<void>((resolve) => {
      handleSubmit((formData) => {
        out = formData;
        console.log("Surrender/Withdrawal Form Submitted:", JSON.stringify(out, null, 2));
        resolve();
      })();
    });
    return out;
  },

  // Return current form data
  getData: () => getValues(),

  // No-op: parent manages Important Notes error now
  clearImportantNotesError: () => {}
}));


    return (
      <form id="surrenderWithdrawalForm" className="policyholder-form">
        {/* NOTICE */}
        <div className="notice-box">
          Financial circumstances can change over the years, and we want to ensure that you
          understand all the options available to you, to give you the best opportunity to do
          what’s right for you when looking to reach your long-term savings goals. Early
          encashment can incur high penalties. If you would like to discuss alternative options
          that may be available, please contact our Customer Services Team.
        </div>

        {/* REQUEST TYPE */}
        <div className="form-row">
          <label className="label-block">Please select type of request</label>
          <div className="radio-group">
            <label>
              <input type="radio" value="surrender" {...requestTypeRegister} />
              Surrender
            </label>

            <label>
              <input type="radio" value="withdrawal" {...requestTypeRegister} />
              Withdrawal
            </label>
          </div>
        </div>

        {/* SURRENDER SECTION */}
        {watchedValues.requestType === "surrender" && (
          <>
            <div className="form-row">
              <label className="label-block">Surrender Options</label>
              <div className="radio-group">
                <label>
                  <input type="radio" value="full" {...register("surrenderOption")} />
                  Full surrender of policy
                </label>

                <label className="segments-row">
                  <input type="radio" value="segments" {...register("surrenderOption")} />
                  Full surrender of individual policy segments
                  {watchedValues.surrenderOption === "segments" && (
                    <input
                      type="number"
                      {...register("segmentsToSurrender", { valueAsNumber: true })}
                      placeholder="Number"
                      className="xxsmall-input"
                      min={1}
                      max={999}
                      onChange={(e) => {
                        let val = parseInt(e.target.value)
                        if (isNaN(val) || val < 1) val = 1
                        if (val > 999) val = 999
                        e.target.value = val.toString()
                      }}
                    />
                  )}
                </label>
              </div>
            </div>

            <div className="checkbox-group">
              <label>
                <input type="checkbox" {...register("awareOfPenalties")} />
                I am aware of any penalties that will be taken on my policy and I would like to proceed.
              </label>
            </div>
          </>
        )}

        {/* WITHDRAWAL SECTION */}
        {watchedValues.requestType === "withdrawal" && (
          <>
            <h3>MAXIMUM WITHDRAWAL WITHOUT PENALTY</h3>
            <div className="checkbox-group max-withdrawal-checkbox">
              <label>
                <input type="checkbox" {...register("maxWithdrawalNoPenalty")} />
                Request maximum withdrawal without triggering penalty
              </label>
            </div>

            <div className="form-row">
              <label className="label-block">Requested withdrawal amount</label>
              <input
                type="number"
                {...register("withdrawalAmount", { valueAsNumber: true })}
                className="medium-input"
              />
            </div>

            <div className="form-row">
              <label className="label-block">Withdrawal type</label>
              <div className="radio-group">
                <label>
                  <input type="radio" value="oneoff" {...register("withdrawalType")} /> One‑off
                </label>
                <label>
                  <input type="radio" value="regular" {...register("withdrawalType")} /> Regular
                </label>
              </div>
            </div>

            {watchedValues.withdrawalType === "oneoff" && (
              <div className="checkbox-group">
                <label>
                  <input type="checkbox" {...register("maxIfUnavailable")} />
                  If the requested withdrawal amount is not available, withdraw the maximum amount available
                </label>
              </div>
            )}

            {watchedValues.withdrawalType === "regular" && (
              <div className="form-section">
                <h4>For regular withdrawals</h4>

                <div className="form-row">
                  <label className="label-block">Frequency</label>
                  <div className="radio-group">
                    <label>
                      <input type="radio" value="Monthly" {...register("regularFrequency")} /> Monthly
                    </label>
                    <label>
                      <input type="radio" value="Quarterly" {...register("regularFrequency")} /> Quarterly
                    </label>
                    <label>
                      <input type="radio" value="Half-yearly" {...register("regularFrequency")} /> Half‑yearly
                    </label>
                    <label>
                      <input type="radio" value="Yearly" {...register("regularFrequency")} /> Yearly
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <label className="label-block">Date the regular withdrawal is due to commence</label>
                  <input type="date" {...register("startDate")} className="medium-input" />
                </div>

                <div className="form-row">
                  <label className="label-block">Cancel all existing regular withdrawals?</label>
                  <div className="radio-group">
                    <label><input type="radio" value="Yes" {...register("cancelExistingWithdrawals")} /> Yes</label>
                    <label><input type="radio" value="No" {...register("cancelExistingWithdrawals")} /> No</label>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ALWAYS VISIBLE SECTIONS */}
        <h3>REQUIRED CURRENCY</h3>
        <div className="form-row">
          <select {...register("withdrawalCurrency")} className="short-input">
            <option value="">Select</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="EUR">EUR</option>
            <option value="HKD">HKD</option>
            <option value="OTHER">Other</option>
          </select>
          {watchedValues.withdrawalCurrency === "OTHER" && (
            <input
              type="text"
              {...register("otherCurrency")}
              className="short-input"
              placeholder="Enter currency"
            />
          )}
        </div>

        <h3>REASON FOR WITHDRAWAL/SURRENDER</h3>
        <div className="form-row">
          <label className="label-block">Select reason(s) by CTRL & Mouse click</label>
          <select multiple {...register("withdrawalReason")} className="large-select">
            <option value="House purchase">House purchase</option>
            <option value="Poor investment returns">Poor investment returns</option>
            <option value="Unable to pay further premiums">Unable to pay further premiums</option>
            <option value="School fees">School fees</option>
            <option value="High product charges">High product charges</option>
            <option value="Moving to another provider">Moving to another provider</option>
            <option value="Medical emergency">Medical emergency</option>
            <option value="Poor customer service">Poor customer service</option>
            <option value="Payment terms completed">Payment terms completed</option>
            <option value="End of charging period">End of charging period</option>
            <option value="Urgent money requirements">Urgent money requirements</option>
            <option value="Mis-sold product">Mis-sold product</option>
            <option value="Change of investment strategy">Change of investment strategy</option>
            <option value="Tax reasons">Tax reasons</option>
            <option value="Financial concerns">Financial concerns</option>
            <option value="OTHER">Other</option>
          </select>

          {watchedValues.withdrawalReason?.includes("OTHER") && (
            <input
              type="text"
              {...register("otherReason")}
              className="large-input"
              placeholder="If other, please specify"
            />
          )}
        </div>
      </form>
    )
  }
)

export default SurrenderWithdrawalFormComponent