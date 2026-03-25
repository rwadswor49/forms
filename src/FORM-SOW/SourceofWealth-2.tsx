import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import Card from "../components/sow/Card";
import { useExpandableCards } from "../components/sow/useExpandableCards";
import { useAutoSave } from "../components/sow/useAutoSave";

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
    defaultValues: data || { businesses: [] },
    mode: "onChange"
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "businesses"
  });

  // -----------------------------
  // INITIAL EXPANDED STATE
  // -----------------------------
  const initialExpanded = data?.businesses?.length
    ? data.businesses.map(() => false)
    : [true]; // auto-expand first row if no data

  const { expanded, toggleExpand, setExpanded } = useExpandableCards(fields.length, initialExpanded);

  // -----------------------------
  // FIRST LOAD: ensure at least 1 row
  // -----------------------------
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      if (!data?.businesses || data.businesses.length === 0) {
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
        });
      } else {
        reset(data);
      }
      firstLoad.current = false;
    }
  }, [data, append, reset]);

  // -----------------------------
  // AUTO SAVE
  // -----------------------------
  useEffect(() => {
    const subscription = watch((values) => {
      setData(values);
    });
    return () => subscription.unsubscribe();
  }, [watch, setData]);

  // -----------------------------
  // SUBMIT / GET VALUES
  // -----------------------------
  useImperativeHandle(ref, () => ({
    submit: async () => {
      let valid = false;

      await handleSubmit(
        values => {
          valid = true;
          setData(values);
        },
        () => {
          valid = false;
        }
      )();

      return valid ? getValues() : null;
    },
    getValues
  }));

  return (
    <form>
      <h2>Business Income</h2>

      {fields.map((field, index) => {
        const title =
          watch(`businesses.${index}.companyName`) || "Untitled Business";

        return (
          <Card
            key={field.id}
            index={index}
            title={title}
            expanded={expanded[index]}
            onToggle={() => toggleExpand(index)}
            onDelete={() => remove(index)}
          >
            {/* SECTION: Company Details */}
            <h4 className="section-title">Company Details</h4>

            <div className="form-group">
              <label>Company Name</label>
              <input
                className="large-input"
                {...register(`businesses.${index}.companyName`)}
              />
            </div>

            <div className="form-group">
              <label>Setup Date</label>
              <input
                type="date"
                className="smallmed-input"
                {...register(`businesses.${index}.companySetupDate`)}
              />
            </div>

            <div className="form-group">
              <label>Business Type</label>
              <input
                className="large-input"
                {...register(`businesses.${index}.businessType`)}
              />
            </div>

            {/* SECTION: Financials */}
            <h4 className="section-title">Financials</h4>

            <div className="form-group">
              <label>Annual Revenue</label>
              <input
                type="number"
                className="smallmed-input"
                {...register(`businesses.${index}.companyAnnualRevenue`)}
              />
            </div>

            <div className="form-group">
              <label>Your Annual Income</label>
              <input
                type="number"
                className="smallmed-input"
                {...register(`businesses.${index}.annualIncomeFromCompany`)}
              />
            </div>

            {/* SECTION: Ownership */}
            <h4 className="section-title">Ownership</h4>

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

            <div className="form-group">
              <label>Other Owners</label>
              <textarea
                rows={3}
                className="large-input"
                {...register(`businesses.${index}.otherOwners`)}
              />
            </div>

            {/* SECTION: Business Activity */}
            <h4 className="section-title">Business Activity</h4>

            <div className="form-group">
              <label>Main Business Activity</label>
              <textarea
                rows={3}
                className="large-input"
                {...register(`businesses.${index}.mainBusinessActivity`)}
              />
            </div>

            <div className="form-group">
              <label>Capital Source</label>
              <textarea
                rows={3}
                className="large-input"
                {...register(`businesses.${index}.capitalSource`)}
              />
            </div>

            {/* SECTION: Address */}
            <h4 className="section-title">Company Address</h4>

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
                  {countries.map(c => (
                    <option key={c.code} value={c.name}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        );
      })}

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
