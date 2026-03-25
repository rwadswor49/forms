// src/AssetFormComponent.tsx
import { useForm, useFieldArray } from "react-hook-form"
import { forwardRef, useImperativeHandle, useEffect, useRef } from "react"
import isEqual from "lodash.isequal" // npm install lodash.isequal

export type Asset = {
  investmentName?: string
  ticker?: string
  cashAmount?: number
  unitAmount?: number
  percentage?: number
  settlementCurrency?: string
}

export type AssetFormValues = {
  assets: Asset[]
  additionalInfo?: string
}

const AssetFormComponent = forwardRef(({ data, setData }, ref) => {
  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    reset,
    formState: { errors }
  } = useForm<AssetFormValues>({
    defaultValues: data,
    mode: "onBlur"
  })

  // Prevent reset loop: only reset on initial mount
  const initialized = useRef(false)
  useEffect(() => {
    if (!initialized.current) {
      reset(data)
      initialized.current = true
    }
  }, [data, reset])

  // Store previous values to avoid unnecessary parent updates
  const prevValuesRef = useRef<AssetFormValues>(data)

  // Update parent data on any change (only if different)
  useEffect(() => {
    const currentValues = getValues()
    if (!isEqual(prevValuesRef.current, currentValues)) {
      setData(currentValues)
      prevValuesRef.current = currentValues
    }
  }, [getValues, setData])

  // Manage assets array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "assets"
  })

  // Auto-calc percentage based on cashAmount
  useEffect(() => {
    const assets = getValues().assets || []
    const totalCash = assets.reduce((sum, a) => sum + (Number(a.cashAmount) || 0), 0)

    assets.forEach((asset, index) => {
      const pct = totalCash ? ((Number(asset.cashAmount) || 0) / totalCash) * 100 : 0
      setValue(`assets.${index}.percentage`, Number(pct.toFixed(2)))
    })
  }, [getValues, setValue])

  // Expose submit/getData to parent
  useImperativeHandle(ref, () => ({
    submit: async () => {
      const valid = await trigger()
      if (!valid) {
        console.log("Asset Form validation errors:", errors)
        alert("Please fix validation errors in this form")
        return null
      }

      let dataOut: AssetFormValues | null = null
      await new Promise<void>((resolve) => {
        handleSubmit((formData) => {
          dataOut = formData
          console.log("Asset Form Submitted:", JSON.stringify(dataOut, null, 2))
          resolve()
        })()
      })
      return dataOut
    },
    getData: () => getValues()
  }))

  return (
    <form id="assetForm">
      <h3>SALE OF ASSETS (WITHDRAWALS ONLY)</h3>
      <p>List holdings, amount/unit or % to sell for withdrawal.</p>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="asset-row"
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 8,
            alignItems: "center"
          }}
        >
          <input
            placeholder="Cash Amount"
            type="number"
            className="asset-input-cash"
            {...register(`assets.${index}.cashAmount`, { valueAsNumber: true })}
          />

          <input
            placeholder="Unit Amount"
            type="number"
            className="asset-input-unit"
            {...register(`assets.${index}.unitAmount`, { valueAsNumber: true })}
          />

          <input
            placeholder="%"
            type="number"
            className="asset-input-percentage"
            {...register(`assets.${index}.percentage`, {
              valueAsNumber: true,
              min: { value: 0, message: "Must be ≥ 0" },
              max: { value: 100, message: "Cannot exceed 100" },
              validate: (v) => Number.isInteger(v) || "Only whole numbers allowed"
            })}
          />

          <input
            placeholder="Ticker"
            type="text"
            className="asset-input-ticker"
            {...register(`assets.${index}.ticker`)}
          />

          <input
            placeholder="Investment Name"
            type="text"
            className="asset-input-investment"
            {...register(`assets.${index}.investmentName`)}
          />

          <input
            placeholder="Currency"
            type="text"
            className="asset-input-currency"
            {...register(`assets.${index}.settlementCurrency`)}
          />

          <button type="button" onClick={() => remove(index)}>
            ×
          </button>
        </div>
      ))}

      <button type="button" onClick={() => append({})}>
        Add Another Row
      </button>

      <div style={{ marginTop: 10 }}>
        <label>Additional Information:</label>
        <textarea {...register("additionalInfo")} rows={4} style={{ width: "100%" }} />
      </div>
    </form>
  )
})

export default AssetFormComponent