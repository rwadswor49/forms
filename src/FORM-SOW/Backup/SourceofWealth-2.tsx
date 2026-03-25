import React, { forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import countries from "../countries.json";

export type BusinessEntry = {
  companyName: string;
  companySetupDate: string;
  companyAnnualRevenue: string;
  annualIncomeFromCompany: string;
  stake: "passive" | "significant" | "controlling" | "full" | "";
  otherOwners: string;
  businessType: string;
  mainBusinessActivity: string;
  capitalSource: string;
  companyAddressLine1: string;
  companyCity: string;
  companyRegion: string;
  companyPostalCode: string;
  companyCountry: string;
};

export type BusinessIncomePensionFormValues = {
  businesses: BusinessEntry[];
};

type Props = {
  data: BusinessIncomePensionFormValues | null;
  setData: (data: BusinessIncomePensionFormValues) => void;
};

const stakeOptions = [
  { label: "Passive interest: under 20% of shares", value: "passive" },
  { label: "Significant influence: 20% to 50% of shares", value: "significant" },
  { label: "Controlling interest: 50% to 99% of shares", value: "controlling" },
  { label: "Full ownership: 100% of shares", value: "full" }
];

const BusinessIncomePensionForm = forwardRef<any, Props>(({ data, setData }, ref) => {

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    reset
  } = useForm<BusinessIncomePensionFormValues>({
    defaultValues: data || {
      businesses: [
        {
          companyName: "",
          companySetupDate: "",
          companyAnnualRevenue: "",
          annualIncomeFromCompany: "",
          stake: "",
          otherOwners: "",
          businessType: "",
          mainBusinessActivity: "",
          capitalSource: "",
          companyAddressLine1: "",
          companyCity: "",
          companyRegion: "",
          companyPostalCode: "",
          companyCountry: ""
        }
      ]
    },
    mode: "onBlur"
  });

  // Field array for multiple businesses
  const { fields, append, remove } = useFieldArray({
    control,
    name: "businesses"
  });

  const watched = watch();
  const prevRef = useRef<BusinessIncomePensionFormValues | null>(null);

  useEffect(() => {
    reset(data || {});
  }, [data, reset]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const prev = prevRef.current;
      const next = watched;

      if (!prev || JSON.stringify(prev) !== JSON.stringify(next)) {
        prevRef.current = next;
        setData(next);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [watched, setData]);

  useImperativeHandle(ref, () => ({
    submit: async () => {
      let valid = false;

      await handleSubmit(
        (values) => {
          valid = true;
          setData(values);
        },
        () => {
          valid = false;
        }
      )();

      const out = getValues();
      return valid ? out : null;
    },
    getValues: () => getValues()
  }));

  return (
    <form>

      <h2>Business Income</h2>

      {fields.map((field, index) => (
        <div key={field.id} className="business-block">

          <h3>Business #{index + 1}</h3>

          {/* Company Name */}
          <div className="form-group">
            <label>Company Name</label>
            <input
              className="large-input"
              {...register(`businesses.${index}.companyName`)}
            />
          </div>

          {/* Setup Date */}
          <div className="form-group">
            <label>Company Setup Date</label>
            <input
              type="date"
              className="smallmed-input"
              {...register(`businesses.${index}.companySetupDate`)}
            />
          </div>

          {/* Annual Revenue */}
          <div className="form-group">
            <label>Annual Revenue</label>
            <input
              type="number"
              className="smallmed-input"
              {...register(`businesses.${index}.companyAnnualRevenue`)}
            />
          </div>

          {/* Income From Company */}
          <div className="form-group">
            <label>Your Annual Income</label>
            <input
              type="number"
              className="smallmed-input"
              {...register(`businesses.${index}.annualIncomeFromCompany`)}
            />
          </div>

          {/* Stake */}
          <fieldset>
            <legend>Your Stake</legend>
            <div className="inline-options">
              {stakeOptions.map(({ label, value }) => (
                <label key={value}>
                  <input
                    type="radio"
                    value={value}
                    {...register(`businesses.${index}.stake`)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Other Owners */}
          <div className="form-group">
            <label>Other Owners</label>
            <textarea
              rows={3}
              className="large-input"
              {...register(`businesses.${index}.otherOwners`)}
            />
          </div>

          {/* Business Type */}
          <div className="form-group">
            <label>Business Type</label>
            <input
              className="large-input"
              {...register(`businesses.${index}.businessType`)}
            />
          </div>

          {/* Main Activity */}
          <div className="form-group">
            <label>Main Business Activity</label>
            <textarea
              rows={3}
              className="large-input"
              {...register(`businesses.${index}.mainBusinessActivity`)}
            />
          </div>

          {/* Capital Source */}
          <div className="form-group">
            <label>Capital Source</label>
            <textarea
              rows={3}
              className="large-input"
              {...register(`businesses.${index}.capitalSource`)}
            />
          </div>

          {/* Address */}
          <fieldset>
            <legend>Company Address</legend>

            <div className="form-group">
              <label>Address Line 1</label>
              <input
                className="large-input"
                {...register(`businesses.${index}.companyAddressLine1`)}
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                className="large-input"
                {...register(`businesses.${index}.companyCity`)}
              />
            </div>

            <div className="form-group">
              <label>Region</label>
              <input
                className="large-input"
                {...register(`businesses.${index}.companyRegion`)}
              />
            </div>

            <div className="field-row">
              <div className="form-group field">
                <label>Postal Code</label>
                <input
                  className="smallmed-input"
                  {...register(`businesses.${index}.companyPostalCode`)}
                />
              </div>

              <div className="form-group field">
                <label>Country</label>
                <select
                  className="large-input"
                  {...register(`businesses.${index}.companyCountry`)}
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Remove Button */}
          {fields.length > 1 && (
            <button
              type="button"
              className="remove-button"
              onClick={() => remove(index)}
            >
              Remove this business
            </button>
          )}

          <hr />
        </div>
      ))}

      {/* Add Another Business */}
      <button
        type="button"
        className="add-button"
        onClick={() =>
          append({
            companyName: "",
            companySetupDate: "",
            companyAnnualRevenue: "",
            annualIncomeFromCompany: "",
            stake: "",
            otherOwners: "",
            businessType: "",
            mainBusinessActivity: "",
            capitalSource: "",
            companyAddressLine1: "",
            companyCity: "",
            companyRegion: "",
            companyPostalCode: "",
            companyCountry: ""
          })
        }
      >
        + Add another business
      </button>

    </form>
  );
});

export default BusinessIncomePensionForm;

