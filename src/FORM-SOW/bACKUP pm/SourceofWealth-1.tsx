import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { useForm } from "react-hook-form";
import countries from "../countries.json";
import { useAutoSave } from "../components/sow/useAutoSave";

export type WealthFormValues = {
  planNumber: string;
  name: string;
  dobDate: string;
  employmentStatus: string[];
  employmentRole: string[];
  employerName: string;
  occupation: string;
  industry: string;
  natureOfBusiness: string;
  netWorth: string;
  wealthSources: string[];
  salaryLastYear: string;
  bonus: string;
  joinDate: string;
  addressLine1: string;
  townOrCity: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
};

type Props = {
  data: WealthFormValues | null;
  setData: (data: WealthFormValues) => void;
};

// Alphabetical order
const wealthSourceOptions = [
  { label: "Art Investments", value: "artInvestments" },
  { label: "Business Income", value: "businessIncome" },
  { label: "Gift", value: "gift" },
  { label: "Inheritance", value: "inheritance" },
  { label: "Investments", value: "investments" },
  { label: "Lottery/Gaming Win", value: "lotteryGamingWin" },
  { label: "Other", value: "other" },
  { label: "Pension", value: "pension" },
  { label: "Property Sale", value: "propertySale" },
  { label: "Real Estate", value: "realEstate" },
  { label: "Salary", value: "salary" },
  { label: "Savings", value: "savings" }
];

const employmentStatusOptions = [
  { label: "Employed Full Time", value: "employedFullTime" },
  { label: "Employed Part Time", value: "employedPartTime" },
  { label: "Self Employed", value: "selfEmployed" },
  { label: "Unemployed", value: "unemployed" },
  { label: "Retired*", value: "retired" },
  { label: "Student", value: "student" },
  { label: "Homemaker", value: "homemaker" }
];

const employmentRoleOptions = [
  { label: "Employee", value: "employee" },
  { label: "Business Owner", value: "businessOwner" },
  { label: "Key Controller", value: "keyController" },
  { label: "Sole trader", value: "soleTrader" }
];

const WealthForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    reset
  } = useForm<WealthFormValues>({
    defaultValues: data || {},
    mode: "onBlur"
  });

  // Reset when parent data changes
  useEffect(() => reset(data || {}), [data, reset]);

  // Shared auto-save
  useAutoSave(watch, setData);

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

      <div className="form-group">
        <label htmlFor="planNumber">Plan number(s)</label>
        <input
          id="planNumber"
          type="text"
          className="smallmed-input"
          {...register("planNumber")}
        />
      </div>

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input id="name" type="text" {...register("name")} />
      </div>

      <div className="form-group">
        <label htmlFor="dobDate">Date of Birth</label>
        <input id="dobDate" type="date" className="smallmed-input" {...register("dobDate")} />
      </div>

      {/* Wealth Sources */}
      <fieldset>
        <legend>What has generated your total body of wealth?</legend>
        <div className="inline-options">
          {wealthSourceOptions.map(({ label, value }) => (
            <label key={value}>
              <input type="checkbox" value={value} {...register("wealthSources")} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Employment Status */}
      <fieldset>
        <legend>Current Employment Status</legend>
        <div className="inline-options">
          {employmentStatusOptions.map(({ label, value }) => (
            <label key={value}>
              <input type="radio" value={value} {...register("employmentStatus")} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Employment Role */}
      <fieldset>
        <legend>Employment Role</legend>
        <div className="inline-options">
          {employmentRoleOptions.map(({ label, value }) => (
            <label key={value}>
              <input type="radio" value={value} {...register("employmentRole")} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-group">
        <label htmlFor="employerName">Name of the employer</label>
        <input id="employerName" type="text" {...register("employerName")} />
      </div>

      <div className="form-group">
        <label htmlFor="occupation">Occupation</label>
        <input id="occupation" type="text" className="large-input" {...register("occupation")} />
      </div>

      <div className="form-group">
        <label htmlFor="industry">Industry</label>
        <input id="industry" type="text" className="large-input" {...register("industry")} />
      </div>

      <div className="form-group">
        <label htmlFor="natureOfBusiness">Nature of Business</label>
        <input id="natureOfBusiness" type="text" className="large-input" {...register("natureOfBusiness")} />
      </div>

      <div className="form-group">
        <label htmlFor="netWorth">Estimated Net Worth Including currency</label>
        <input id="netWorth" type="number" className="smallmed-input" {...register("netWorth")} />
      </div>

      {/* Salary Section */}
      <fieldset>
        <legend>Salary</legend>

        <div className="form-group">
          <label htmlFor="salaryLastYear">What did you earn in the last financial year?</label>
          <input id="salaryLastYear" type="number" className="smallmed-input" {...register("salaryLastYear")} />
        </div>

        <div className="form-group">
          <label htmlFor="bonus">What did you earn in bonuses?</label>
          <input id="bonus" type="number" className="smallmed-input" {...register("bonus")} />
        </div>

        <div className="form-group">
          <label htmlFor="joinDate">When did you join the company? (MM/YYYY)</label>
          <input id="joinDate" type="date" className="smallmed-input" {...register("joinDate")} />
        </div>
      </fieldset>

      {/* Employer Address */}
      <fieldset>
        <legend>Employer address</legend>

        <div className="form-group">
          <label htmlFor="addressLine1">Address line 1</label>
          <input id="addressLine1" type="text" {...register("addressLine1")} />
        </div>

        <div className="form-group">
          <label htmlFor="townOrCity">Town or city</label>
          <input id="townOrCity" type="text" className="large-input" {...register("townOrCity")} />
        </div>

        <div className="form-group">
          <label htmlFor="stateOrProvince">State, province or region</label>
          <input id="stateOrProvince" type="text" className="large-input" {...register("stateOrProvince")} />
        </div>

        <div className="field-row">
          <div className="form-group field">
            <label htmlFor="postalCode">Postal code or ZIP code</label>
            <input id="postalCode" type="text" {...register("postalCode")} />
          </div>

          <div className="form-group field">
            <label htmlFor="country">Country or region</label>
            <select id="country" className="large-input" {...register("country")}>
              <option value="">Select country</option>
              {countries.map(c => (
                <option key={c.code} value={c.name}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

    </form>
  );
});

export default WealthForm;


