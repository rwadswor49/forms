import React, { forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import countries from "../countries.json";
import { useAutoSave } from "../components/sow/useAutoSave";

export type EmploymentFormValues = {
  employmentStatus: string;  
  employmentRole: string;   
  employerName: string;
  occupation: string;
  industry: string;
  natureOfBusiness: string;
  netWorth: string;
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
  data: EmploymentFormValues | null;
  setData: (data: EmploymentFormValues) => void;
};

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
  { label: "Business Owner", value: "BusinessOwner" },
  { label: "Key Controller", value: "KeyController" },
  { label: "Sole trader", value: "SoleTrader" }
];

const EmploymentForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const { register, handleSubmit, watch, getValues, reset } = useForm<EmploymentFormValues>({
    defaultValues: {
      employmentStatus: "",
      employmentRole: "",
      ...(data || {})
    },
    mode: "onBlur"
  });

  // prevent reset loop
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      reset({
        employmentStatus: "",
        employmentRole: "",
        ...(data || {})
      });
      isFirstLoad.current = false;
    }
  }, [data, reset]);

  // autosave
  useAutoSave(watch, setData);

  useImperativeHandle(ref, () => ({
    submit: async () => {
      let valid = false;
      await handleSubmit(
        v => { valid = true; setData(v); },
        () => { valid = false; }
      )();
      return valid ? getValues() : null;
    },
    getValues
  }));

  return (
    <form>

      <fieldset>
        <legend>Current Employment Status</legend>
        <div className="inline-options">
          {employmentStatusOptions.map(({ label, value }) => (
            <label key={value}>
              <input
                type="radio"
                value={value}
                {...register("employmentStatus")}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Employment Role</legend>
        <div className="inline-options">
          {employmentRoleOptions.map(({ label, value }) => (
            <label key={value}>
              <input
                type="radio"
                value={value}
                {...register("employmentRole")}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-group">
        <label>Name of the employer</label>
        <input type="text" {...register("employerName")} />
      </div>

      <div className="form-group">
        <label>Occupation</label>
        <input type="text" className="large-input" {...register("occupation")} />
      </div>

      <div className="form-group">
        <label>Industry</label>
        <input type="text" className="large-input" {...register("industry")} />
      </div>

      <div className="form-group">
        <label>Nature of Business</label>
        <input type="text" className="large-input" {...register("natureOfBusiness")} />
      </div>

      <div className="form-group">
        <label>Estimated Net Worth Including currency</label>
        <input type="number" className="smallmed-input" {...register("netWorth")} />
      </div>

      <fieldset>
        <legend>Salary</legend>

        <div className="form-group">
          <label>What did you earn in the last financial year?</label>
          <input type="number" className="smallmed-input" {...register("salaryLastYear")} />
        </div>

        <div className="form-group">
          <label>What did you earn in bonuses?</label>
          <input type="number" className="smallmed-input" {...register("bonus")} />
        </div>

        <div className="form-group">
          <label>When did you join the company?</label>
          <input type="date" className="smallmed-input" {...register("joinDate")} />
        </div>
      </fieldset>

      <fieldset>
        <legend>Employer address</legend>

        <div className="form-group">
          <label>Address line 1</label>
          <input type="text" {...register("addressLine1")} />
        </div>

        <div className="form-group">
          <label>Town or city</label>
          <input type="text" className="large-input" {...register("townOrCity")} />
        </div>

        <div className="form-group">
          <label>State, province or region</label>
          <input type="text" className="large-input" {...register("stateOrProvince")} />
        </div>

        <div className="field-row">
          <div className="form-group field">
            <label>Postal code</label>
            <input type="text" {...register("postalCode")} />
          </div>

          <div className="form-group field">
            <label>Country</label>
            <select className="large-input" {...register("country")}>
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

export default EmploymentForm;


