import React, { forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import isEqual from "lodash.isequal";
import countries from "../countries.json";

export type LotterySavingsOtherFormValues = {
  // Giver Address
  giverAddressLine1: string;
  giverCity: string;
  giverRegion: string;
  giverPostalCode: string;
  giverCountry: string;

  // Lottery / Gaming
  lotteryWinAmount: string;
  lotteryWinDate: string;
  lotteryOrganisation: string;
  lotteryOrgAddressLine1: string;
  lotteryOrgCity: string;
  lotteryOrgRegion: string;
  lotteryOrgPostalCode: string;
  lotteryOrgCountry: string;

  // Savings
  savingsInstitution: string;
  savingsValue: string;
  savingsLocation: string;
  savingsOrigin: string;

  // Other Income
  otherIncomeDescription: string;
  otherWealthSource: string;
  otherWealthValue: string;

  // Extra Funds Origin
  fundsOriginExtra: string;
};

type Props = {
  data: LotterySavingsOtherFormValues | null;
  setData: (data: LotterySavingsOtherFormValues) => void;
};

const LotterySavingsOtherForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    reset,
    formState: { errors }
  } = useForm<LotterySavingsOtherFormValues>({
    defaultValues: data || {
      giverAddressLine1: "",
      giverCity: "",
      giverRegion: "",
      giverPostalCode: "",
      giverCountry: "",
      lotteryWinAmount: "",
      lotteryWinDate: "",
      lotteryOrganisation: "",
      lotteryOrgAddressLine1: "",
      lotteryOrgCity: "",
      lotteryOrgRegion: "",
      lotteryOrgPostalCode: "",
      lotteryOrgCountry: "",
      savingsInstitution: "",
      savingsValue: "",
      savingsLocation: "",
      savingsOrigin: "",
      otherIncomeDescription: "",
      otherWealthSource: "",
      otherWealthValue: "",
      fundsOriginExtra: "",
    },
    mode: "onBlur"
  });

  // Prevent reset loop

// Watch all fields live
const watched = watch();

// Reset form whenever parent data changes
useEffect(() => {
  reset(data || {});
}, [data, reset]);

// Track previous values to avoid unnecessary updates
const prevRef = useRef<LotterySavingsOtherFormValues | null>(null);

// Push updates to parent ONLY when values actually change
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


  // Expose submit + getValues to parent
useImperativeHandle(ref, () => ({
  submit: async () => {
    console.log("Submitting page...");

    let valid = false;

    // Run react-hook-form validation
    await handleSubmit(
      (values) => {
        valid = true;
        setData(values);
        console.log("Validation passed. Values set:", values);
      },
      (errors) => {
        console.log("Validation errors:", errors);
        valid = false;
      }
    )();

    const out = getValues(); // get all current form values
    console.log("submit() returning:", out, "valid?", valid);

    return valid ? out : null;
  },

  getValues: () => {
    const values = getValues();
    console.log("getValues() called, returning:", values);
    return values;
  }
}));


  return (
    <form>
      {/* Giver Address */}
      <section className="section section-giver-address">
        <h2>Address of giver</h2>
        <div className="field">
          <label htmlFor="giverAddressLine1">Address line 1</label>
          <input id="giverAddressLine1" {...register("giverAddressLine1")} type="text" />
        </div>
        <div className="field">
          <label htmlFor="giverCity">Town or city</label>
          <input id="giverCity" {...register("giverCity")} type="text" />
        </div>
        <div className="field">
          <label htmlFor="giverRegion">State, province or region</label>
          <input id="giverRegion" {...register("giverRegion")} type="text" />
        </div>
        <div className="field">
          <label htmlFor="giverPostalCode">Postal code or ZIP code</label>
          <input id="giverPostalCode" {...register("giverPostalCode")} type="text" />
        </div>
        <div className="field">
          <label htmlFor="giverCountry">Country or region</label>
          <select id="giverCountry" {...register("giverCountry")} className="large-input">
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Lottery / Gaming */}
      <section className="section section-lottery">
        <h2>Lottery / Gaming Win</h2>
        <div className="field">
          <label htmlFor="lotteryWinAmount">How much did you win?</label>
          <input id="lotteryWinAmount" {...register("lotteryWinAmount")} type="text" />
        </div>
        <div className="field">
          <label htmlFor="lotteryWinDate">Date of Win (MM/YYYY)</label>
          <input id="lotteryWinDate" type="month" {...register("lotteryWinDate")} />
        </div>
        <div className="field">
          <label htmlFor="lotteryOrganisation">Name of lottery or gaming organisation</label>
          <input id="lotteryOrganisation" {...register("lotteryOrganisation")} type="text" />
        </div>

        <fieldset className="fieldset">
          <legend>Lottery or gaming organisation address</legend>

          <div className="field">
            <label htmlFor="lotteryOrgAddressLine1">Address line 1</label>
            <input id="lotteryOrgAddressLine1" {...register("lotteryOrgAddressLine1")} type="text" />
          </div>

          <div className="field">
            <label htmlFor="lotteryOrgCity">Town or city</label>
            <input id="lotteryOrgCity" {...register("lotteryOrgCity")} type="text" />
          </div>

          <div className="field">
            <label htmlFor="lotteryOrgRegion">State, province or region</label>
            <input id="lotteryOrgRegion" {...register("lotteryOrgRegion")} type="text" />
          </div>

          <div className="field">
            <label htmlFor="lotteryOrgPostalCode">Postal code or ZIP code</label>
            <input id="lotteryOrgPostalCode" {...register("lotteryOrgPostalCode")} type="text" />
          </div>

          <div className="field">
            <label htmlFor="lotteryOrgCountry">Country or region</label>
            <select id="lotteryOrgCountry" {...register("lotteryOrgCountry")} className="large-input">
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </fieldset>
      </section>

      {/* Savings */}
      <section className="section section-savings">
        <h2>Savings</h2>

        {["savingsInstitution", "savingsValue", "savingsLocation"].map((field) => (
          <div className="field" key={field}>
            <label htmlFor={field}>{field.replace(/([A-Z])/g, " $1")}</label>
            <input id={field} {...register(field as keyof LotterySavingsOtherFormValues)} type="text" />
          </div>
        ))}

        <div className="field">
          <label htmlFor="savingsOrigin">Where did the funds originally come from?</label>
          <textarea id="savingsOrigin" {...register("savingsOrigin")} rows={3} placeholder="Please give details" />
        </div>
      </section>

      {/* Other Income */}
      <section className="section section-other-income">
        <h2>Other</h2>

        {["otherIncomeDescription", "otherWealthSource"].map((field) => (
          <div className="field" key={field}>
            <label htmlFor={field}>{field.replace(/([A-Z])/g, " $1")}</label>
            <textarea id={field} {...register(field as keyof LotterySavingsOtherFormValues)} rows={3} placeholder="Please give details" />
          </div>
        ))}

        <div className="field">
          <label htmlFor="otherWealthValue">Value of wealth</label>
          <input id="otherWealthValue" {...register("otherWealthValue")} type="text" />
        </div>
      </section>

      {/* Extra Funds Origin */}
      <section className="section section-funds-origin-extra">
        <h2>Source of Funds</h2>
        <div className="field">
          <label htmlFor="fundsOriginExtra">Where did the funds originally come from?</label>
          <textarea id="fundsOriginExtra" {...register("fundsOriginExtra")} rows={4} placeholder="Please give details" />
        </div>
      </section>
    </form>
  );
});

export default LotterySavingsOtherForm;
