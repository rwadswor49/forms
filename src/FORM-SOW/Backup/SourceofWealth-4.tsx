import React, { forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import isEqual from "lodash.isequal";
import countries from "../countries.json";

export type RealEstateInvestmentsFormValues = {
  initialInvestmentWealth: string;
  realEstateIncome: string;
  realEstateCompany: string;
  realEstateDetails: string;
  realEstateCapitalSource: string;
  propertyPurchasePrice: string;
  propertyCurrentValue: string;
  propertyPurchaseDate: string;
  propertyOwned: "yes" | "no" | "";
  propertySalePrice: string;
  propertySaleDate: string;
  propertySaleFundsLocation: string;
  propertyAddressLine1: string;
  propertyCity: string;
  propertyRegion: string;
  propertyPostalCode: string;
  propertyCountry: string;
};

type Props = {
  data: RealEstateInvestmentsFormValues | null;
  setData: (data: RealEstateInvestmentsFormValues) => void;
};

const RealEstateInvestmentsForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    reset,
    formState: { errors }
  } = useForm<RealEstateInvestmentsFormValues>({
    defaultValues: data || {
      initialInvestmentWealth: "",
      realEstateIncome: "",
      realEstateCompany: "",
      realEstateDetails: "",
      realEstateCapitalSource: "",
      propertyPurchasePrice: "",
      propertyCurrentValue: "",
      propertyPurchaseDate: "",
      propertyOwned: "",
      propertySalePrice: "",
      propertySaleDate: "",
      propertySaleFundsLocation: "",
      propertyAddressLine1: "",
      propertyCity: "",
      propertyRegion: "",
      propertyPostalCode: "",
      propertyCountry: "",
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
const prevRef = useRef<RealEstateInvestmentsFormValues | null>(null);

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


  const propertyOwnedValue = watch("propertyOwned");

  return (
    <form>
      {/* Initial Investment Source */}
      <section className="section section-investment-source">
        <h2>Initial Investment Source</h2>
        <div className="field">
          <label htmlFor="initialInvestmentWealth">
            Where did you get the wealth to fund your initial investments?
          </label>
          <textarea
            id="initialInvestmentWealth"
            rows={3}
            {...register("initialInvestmentWealth")}
          />
        </div>
      </section>

      {/* Real Estate */}
      <section className="section section-real-estate">
        <h2>Real Estate</h2>
        <div className="field">
          <label htmlFor="realEstateIncome">Total income from real estate</label>
          <input id="realEstateIncome" type="text" {...register("realEstateIncome")} />
        </div>

        <div className="field">
          <label htmlFor="realEstateCompany">
            Name of real estate company or companies
            <br />
            <span className="hint">Where the funds will be coming from</span>
          </label>
          <input id="realEstateCompany" type="text" {...register("realEstateCompany")} />
        </div>

        <div className="field">
          <label htmlFor="realEstateDetails">
            Please give details of the properties or developments
          </label>
          <textarea
            id="realEstateDetails"
            rows={4}
            {...register("realEstateDetails")}
          />
        </div>

        <div className="field">
          <label htmlFor="realEstateCapitalSource">
            Where did you get the capital to fund your initial investment?
          </label>
          <textarea
            id="realEstateCapitalSource"
            rows={3}
            placeholder="Please give details"
            {...register("realEstateCapitalSource")}
          />
        </div>
      </section>

      {/* Property Section */}
      <section className="section section-property">
        <h2>Property</h2>

        <div className="field">
          <label htmlFor="propertyPurchasePrice">What did you pay for the property?</label>
          <input id="propertyPurchasePrice" type="text" {...register("propertyPurchasePrice")} />
        </div>

        <div className="field">
          <label htmlFor="propertyCurrentValue">What is the current value of the property?</label>
          <input id="propertyCurrentValue" type="text" {...register("propertyCurrentValue")} />
        </div>

        <div className="field">
          <label htmlFor="propertyPurchaseDate">
            When did you buy the property? (MM/YYYY)
          </label>
          <input
            id="propertyPurchaseDate"
            type="month"
            {...register("propertyPurchaseDate")}
            className="smallmed-input"
          />
        </div>

        <div className="field">
          <label>Do you still own the property</label>
          <div className="options-horizontal">
            <label>
              <input
                type="radio"
                value="yes"
                {...register("propertyOwned")}
                checked={propertyOwnedValue === "yes"}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="no"
                {...register("propertyOwned")}
                checked={propertyOwnedValue === "no"}
              />
              No
            </label>
          </div>
        </div>

        <div className="field">
          <label htmlFor="propertySalePrice">If sold – What did you sell it for?</label>
          <input id="propertySalePrice" type="text" {...register("propertySalePrice")} />
        </div>

        <div className="field">
          <label htmlFor="propertySaleDate">
            When did you sell it? (MM/YYYY)
          </label>
          <input
            id="propertySaleDate"
            type="month"
            {...register("propertySaleDate")}
            className="smallmed-input"
          />
        </div>

        <div className="field">
          <label htmlFor="propertySaleFundsLocation">
            Where has the money been held since selling the property?
          </label>
          <input id="propertySaleFundsLocation" type="text" {...register("propertySaleFundsLocation")} />
        </div>

        {/* Property Address */}
        <fieldset className="fieldset">
          <legend>Please give details of the property</legend>

          <div className="field">
            <label htmlFor="propertyAddressLine1">Address line 1</label>
            <input id="propertyAddressLine1" type="text" {...register("propertyAddressLine1")} />
          </div>

          <div className="field">
            <label htmlFor="propertyCity">Town or city</label>
            <input id="propertyCity" type="text" {...register("propertyCity")} />
          </div>

          <div className="field">
            <label htmlFor="propertyRegion">State, province or region</label>
            <input id="propertyRegion" {...register("propertyRegion")} type="text" />
          </div>

          <div className="field">
            <label htmlFor="propertyPostalCode">Postal code or ZIP code</label>
            <input id="propertyPostalCode" {...register("propertyPostalCode")} type="text" />
          </div>

          <div className="field">
            <label htmlFor="propertyCountry">Country or region</label>
            <select
              id="propertyCountry"
              {...register("propertyCountry")}
              className="large-input"
              defaultValue={data?.propertyCountry || ""}
            >
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
    </form>
  );
});

export default RealEstateInvestmentsForm;
