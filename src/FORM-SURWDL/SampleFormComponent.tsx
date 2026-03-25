// src/SampleFormComponent.tsx
import { useForm, useFieldArray } from "react-hook-form"
import { forwardRef, useImperativeHandle } from "react"
import countries from "../countries.json" 

export type AdditionalTaxInfo = { country?: string; tin?: string }
export type Signatory = {
  fullName?: string
  country?: string        // country dropdown only
  tin?: string
  additionalTaxInfo?: AdditionalTaxInfo[]
  specifiedUSPerson?: "Yes" | "No"
}
export type SampleFormValues = {
  declarationChecked: boolean
  signatories: Signatory[]
}

const SampleFormComponent = forwardRef((_, ref) => {
  const { register, control, trigger, getValues, formState } = useForm<SampleFormValues>({
    defaultValues: {
      declarationChecked: false,
      signatories: Array.from({ length: 4 }, () => ({
        additionalTaxInfo: []
      }))
    },
    mode: "onBlur"
  })

  const { fields: signatoryFields } = useFieldArray({ control, name: "signatories" })

  useImperativeHandle(ref, () => ({
    submit: async () => {
      const valid = await trigger()
      console.log("Validation result:", valid)
      console.log("Validation errors:", formState.errors)
      if (!valid) {
        alert("Please fix errors in Sample Form. See console.")
        return null
      }
      const data = getValues()
      console.log("Sample Form Submitted:", JSON.stringify(data, null, 2))
      return data
    },
    getData: () => getValues()
  }))

  return (
    <form id="sampleForm">
      <div style={{ border: "1px solid #ccc", borderRadius: 6, padding: 15 }}>
        <h3>DECLARATION</h3>
        <p>
          I/We hereby confirm that I/We have read and agreed with the Important Notes and all notes specified in the relevant sections above.
        </p>
        <p>
          I/We request that RL360 Insurance Company Limited makes a payment by withdrawal from the policy listed above in accordance with the Policy conditions.
        </p>

        <label>
          <input type="checkbox" {...register("declarationChecked", { required: true })} />{" "}
          All policyholders have read the declaration and the RL360 Insurance Company Limited privacy policy.
        </label>

        <h4>Signatories</h4>
        {signatoryFields.map((field, index) => {
          const taxInfoArray = `signatories.${index}.additionalTaxInfo`
          const { fields: taxFields, append, remove } = useFieldArray({ control, name: taxInfoArray })

          return (
            <div key={field.id} style={{ marginBottom: 15, paddingBottom: 10, borderBottom: "1px solid #ccc" }}>
              {/* Full Name */}
              <input
                placeholder="Full Name"
                {...register(`signatories.${index}.fullName`)}
                className="large-input"
              />

              {/* Country Dropdown (main signatory) */}
              <select {...register(`signatories.${index}.country`)} className="large-input">
                <option value="">Select country</option>
                {countries.map(c => (
                  <option key={c.code} value={c.name}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>

              {/* TIN code as free input */}
              <input
                placeholder="Tax ID"
                {...register(`signatories.${index}.tin`)}
                className="smallmed-input"
              />

              {/* Additional Tax Info */}
              <div style={{ marginTop: 5 }}>
                {taxFields.map((taxField, tIndex) => (
                  <div
                    key={taxField.id}
                    style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}
                  >
                    <input
                      placeholder="Country"
                      {...register(`${taxInfoArray}.${tIndex}.country`)}
                      className="small-input"
                    />
                    <input
                      placeholder="TIN"
                      {...register(`${taxInfoArray}.${tIndex}.tin`)}
                      type="text"
                      className="small-input"
                    />
                    <button type="button" onClick={() => remove(tIndex)}>X</button>
                  </div>
                ))}
                <button type="button" onClick={() => append({ country: "", tin: "" })}>
                  Add Tax Info
                </button>
              </div>

              {/* Specified US Person Question */}
              <div style={{ marginTop: 5 }}>
                <p>Are you a specified US Person?</p>
                <div className="radio-group">
                  <label>
                    <input type="radio" value="Yes" {...register(`signatories.${index}.specifiedUSPerson`)} /> Yes
                  </label>
                  <label>
                    <input type="radio" value="No" {...register(`signatories.${index}.specifiedUSPerson`)} /> No
                  </label>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </form>
  )
})

export default SampleFormComponent