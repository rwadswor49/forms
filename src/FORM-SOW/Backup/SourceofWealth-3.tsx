import React, { forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

export type PensionInvestmentsFormValues = {
  pensionType: "employer" | "personal" | "";
  employerSchemeName: string;
  occupation: string;
  yearsWorked: number | "";
  employmentPensionInstitution: string;
  employmentPensionValue: string;
  personalPensionInstitution: string;
  personalPensionJurisdiction: string;
  personalPensionValue: string;
  investmentIncome: string;
  portfolioValue: string;
  investmentCompany: string;
  investmentLocation: string;
  investmentStartDate: string;
  investmentWealthSource: string;
  artDescription: string;
  artNetIncome: string;
  artInvestmentDetails: string;
};

type Props = {
  data: PensionInvestmentsFormValues | null;
  setData: (data: PensionInvestmentsFormValues) => void;
};

const PensionInvestmentsForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<PensionInvestmentsFormValues>({
    defaultValues: data || {
      pensionType: "",
      employerSchemeName: "",
      occupation: "",
      yearsWorked: "",
      employmentPensionInstitution: "",
      employmentPensionValue: "",
      personalPensionInstitution: "",
      personalPensionJurisdiction: "",
      personalPensionValue: "",
      investmentIncome: "",
      portfolioValue: "",
      investmentCompany: "",
      investmentLocation: "",
      investmentStartDate: "",
      investmentWealthSource: "",
      artDescription: "",
      artNetIncome: "",
      artInvestmentDetails: "",
    },
    mode: "onBlur",
  });

  // Prevent reset loop
// Watch all fields live
const watched = watch();

// Reset form whenever parent data changes
useEffect(() => {
  reset(data || {});
}, [data, reset]);

// Track previous values to avoid unnecessary updates
const prevRef = useRef<PensionInvestmentsFormValues | null>(null);

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



  // For radio checked state
  const pensionTypeValue = watch("pensionType");

  // Expose submit + getValues to parent
  useImperativeHandle(ref, () => ({
    submit: async () => {
      console.log("Submitting page...");

      let valid = false;

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

      const out = getValues();
      console.log("submit() returning:", out, "valid?", valid);

      return valid ? out : null;
    },

    getValues: () => {
      const values = getValues();
      console.log("getValues() called, returning:", values);
      return values;
    },
  }));

  return (
    <form>
      {/* Pension */}
      <section className="section section-pension">
        <h2>Pension</h2>

        <div className="field">
          <label>Is this an Employment Pension or Personal Pension</label>
          <div className="options-horizontal">
            <label>
              <input
                type="radio"
                value="employer"
                {...register("pensionType")}
                checked={pensionTypeValue === "employer"}
              />
              Employer
            </label>
            <label>
              <input
                type="radio"
                value="personal"
                {...register("pensionType")}
                checked={pensionTypeValue === "personal"}
              />
              Personal
            </label>
          </div>
        </div>

        <div className="field">
          <label htmlFor="employerSchemeName">
            If employer scheme – Employment occupation scheme name?
          </label>
          <input id="employerSchemeName" {...register("employerSchemeName")} type="text" />
        </div>

        <div className="field">
          <label htmlFor="occupation">What was your occupation?</label>
          <input id="occupation" {...register("occupation")} type="text" />
        </div>
      </section>

      {/* Pension – Employment Scheme */}
      <section className="section section-pension-employment">
        <h2>Pension – Employment Scheme</h2>

        <div className="field">
          <label htmlFor="yearsWorked">How many years did you work for them?</label>
          <input
            id="yearsWorked"
            type="number"
            {...register("yearsWorked", { valueAsNumber: true })}
          />
        </div>

        <div className="field">
          <label htmlFor="employmentPensionInstitution">
            Name of institution where pension held
          </label>
          <input
            id="employmentPensionInstitution"
            type="text"
            {...register("employmentPensionInstitution")}
          />
        </div>

        <div className="field">
          <label htmlFor="employmentPensionValue">Value of pension</label>
          <input
            id="employmentPensionValue"
            type="text"
            {...register("employmentPensionValue")}
          />
        </div>
      </section>

      {/* Pension – Personal Scheme */}
      <section className="section section-pension-personal">
        <h2>Pension – Personal Scheme</h2>

        <div className="field">
          <label htmlFor="personalPensionInstitution">
            Name of institution where pension held
          </label>
          <input
            id="personalPensionInstitution"
            type="text"
            {...register("personalPensionInstitution")}
          />
        </div>

        <div className="field">
          <label htmlFor="personalPensionJurisdiction">
            What jurisdiction is the pension held in
          </label>
          <input
            id="personalPensionJurisdiction"
            type="text"
            {...register("personalPensionJurisdiction")}
          />
        </div>

        <div className="field">
          <label htmlFor="personalPensionValue">Value of pension</label>
          <input
            id="personalPensionValue"
            type="text"
            {...register("personalPensionValue")}
          />
        </div>
      </section>

      {/* Investments */}
      <section className="section section-investments">
        <h2>Investments</h2>
        <p className="hint">Including stocks, shares, cryptocurrencies & other</p>

        <div className="field">
          <label htmlFor="investmentIncome">Total income from investment</label>
          <input id="investmentIncome" type="text" {...register("investmentIncome")} />
        </div>

        <div className="field">
          <label htmlFor="portfolioValue">Total value of your portfolio</label>
          <input id="portfolioValue" type="text" {...register("portfolioValue")} />
        </div>

        <div className="field">
          <label htmlFor="investmentCompany">
            Name of company where your investment is held
          </label>
          <input id="investmentCompany" type="text" {...register("investmentCompany")} />
        </div>

        <div className="field">
          <label htmlFor="investmentLocation">Location of your investment</label>
          <input id="investmentLocation" type="text" {...register("investmentLocation")} />
        </div>

        <div className="field">
          <label htmlFor="investmentStartDate">Start date of investment</label>
          <input
            id="investmentStartDate"
            type="date"
            {...register("investmentStartDate")}
            className="smallmed-input"
          />
        </div>

        <div className="field">
          <label htmlFor="investmentWealthSource">
            Where did you get the wealth to fund your initial investment?
          </label>
          <textarea
            id="investmentWealthSource"
            rows={3}
            placeholder="For instance, real estate or securities"
            {...register("investmentWealthSource")}
          />
        </div>
      </section>

      {/* Art Investments */}
      <section className="section section-art-investments">
        <h2>Art Investments</h2>

        <div className="field">
          <label htmlFor="artDescription">Please describe the artwork or artworks</label>
          <textarea
            id="artDescription"
            rows={3}
            placeholder="For instance, the artist, title, date of artwork, size and medium"
            {...register("artDescription")}
          />
        </div>

        <div className="field">
          <label htmlFor="artNetIncome">Estimated net income from art investments</label>
          <input id="artNetIncome" type="text" {...register("artNetIncome")} />
        </div>

        <div className="field">
          <label htmlFor="artInvestmentDetails">Please give details of your investments</label>
          <textarea
            id="artInvestmentDetails"
            rows={3}
            placeholder="Include dates and amounts"
            {...register("artInvestmentDetails")}
          />
        </div>
      </section>
    </form>
  );
});

export default PensionInvestmentsForm;
