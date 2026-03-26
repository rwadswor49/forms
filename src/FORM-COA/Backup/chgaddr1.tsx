import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef
} from "react";

import { useForm } from "react-hook-form";
import countries from "../countries.json";
import { useAutoSave } from "../components/COA/useAutoSave";

/* ---------------------------------------------
   TYPES
--------------------------------------------- */
export type PlanOwnerValues = {
  fullName: string;

  // Residential Address
  addressLine1: string;
  addressLine2: string;
  townOrCity: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;

  // Correspondence Address
  corrAddressLine1: string;
  corrAddressLine2: string;
  corrTownOrCity: string;
  corrStateOrProvince: string;
  corrPostalCode: string;
  corrCountry: string;

  // Contact Details
  homeTelephone: string;
  workTelephone: string;
  mobileTelephone: string;
  emailAddress: string;

  // Employment
  employmentStatus: string;
  employmentRole: string;
  occupation: string;
  natureOfBusiness: string;
};

type Props = {
  data: PlanOwnerValues | null;
  setData: (data: PlanOwnerValues) => void;
};

/* ---------------------------------------------
   OPTIONS
--------------------------------------------- */
const employmentStatusOptions = [
  { label: "Employed Full Time", value: "employedFullTime" },
  { label: "Employed Part Time", value: "employedPartTime" },
  { label: "Self Employed", value: "selfEmployed" },
  { label: "Unemployed", value: "unemployed" },
  { label: "Retired", value: "retired" },
  { label: "Student", value: "student" },
  { label: "Homemaker", value: "homemaker" }
];

const employmentRoleOptions = [
  { label: "Employee", value: "employee" },
  { label: "Business Owner", value: "businessOwner" },
  { label: "Key Controller", value: "keyController" },
  { label: "Sole Trader", value: "soleTrader" }
];

/* ---------------------------------------------
   MAIN COMPONENT
--------------------------------------------- */
const Chgaddr1 = forwardRef<any, Props>(({ data, setData }, ref) => {
  const { register, handleSubmit, watch, getValues, reset } =
    useForm<PlanOwnerValues>({
      defaultValues: {
        fullName: "",
        addressLine1: "",
        addressLine2: "",
        townOrCity: "",
        stateOrProvince: "",
        postalCode: "",
        country: "",

        corrAddressLine1: "",
        corrAddressLine2: "",
        corrTownOrCity: "",
        corrStateOrProvince: "",
        corrPostalCode: "",
        corrCountry: "",

        homeTelephone: "",
        workTelephone: "",
        mobileTelephone: "",
        emailAddress: "",

        employmentStatus: "",
        employmentRole: "",
        occupation: "",
        natureOfBusiness: "",

        ...(data || {})
      },
      mode: "onBlur"
    });

  /* Prevent reset loop */
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      reset({
        fullName: "",
        addressLine1: "",
        addressLine2: "",
        townOrCity: "",
        stateOrProvince: "",
        postalCode: "",
        country: "",

        corrAddressLine1: "",
        corrAddressLine2: "",
        corrTownOrCity: "",
        corrStateOrProvince: "",
        corrPostalCode: "",
        corrCountry: "",

        homeTelephone: "",
        workTelephone: "",
        mobileTelephone: "",
        emailAddress: "",

        employmentStatus: "",
        employmentRole: "",
        occupation: "",
        natureOfBusiness: "",

        ...(data || {})
      });
      isFirstLoad.current = false;
    }
  }, [data, reset]);

  /* Auto-save */
  useAutoSave(watch, setData);

  /* Expose submit + getValues to parent */
  useImperativeHandle(ref, () => ({
    submit: async () => {
      let valid = false;
      await handleSubmit(
        (v) => {
          valid = true;
          setData(v);
        },
        () => {
          valid = false;
        }
      )();
      return valid ? getValues() : null;
    },
    getValues
  }));

  /* ---------------------------------------------
     RENDER
  --------------------------------------------- */
  return (
    <form>
      <h2>Plan Owner Details</h2>

      {/* FULL NAME */}
      <div className="form-group">
        <label>Full Name</label>
        <input type="text" className="large-input" {...register("fullName")} />
      </div>

      {/* RESIDENTIAL ADDRESS */}
      <fieldset>
        <legend>Residential / Registered Address</legend>

        <div className="form-group">
          <label>Address Line 1</label>
          <input type="text" {...register("addressLine1")} />
        </div>

        <div className="form-group">
          <label>Address Line 2</label>
          <input type="text" {...register("addressLine2")} />
        </div>

        <div className="form-group">
          <label>Town or City</label>
          <input type="text" {...register("townOrCity")} />
        </div>

        <div className="form-group">
          <label>State / Province / Region</label>
          <input type="text" {...register("stateOrProvince")} />
        </div>

        <div className="field-row">
          <div className="form-group field">
            <label>Postal Code</label>
            <input type="text" {...register("postalCode")} />
          </div>

          <div className="form-group field">
            <label>Country</label>
            <select className="large-input" {...register("country")}>
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

      {/* CORRESPONDENCE ADDRESS */}
      <fieldset>
        <legend>Correspondence Address</legend>

        <div className="form-group">
          <label>Address Line 1</label>
          <input type="text" {...register("corrAddressLine1")} />
        </div>

        <div className="form-group">
          <label>Address Line 2</label>
          <input type="text" {...register("corrAddressLine2")} />
        </div>

        <div className="form-group">
          <label>Town or City</label>
          <input type="text" {...register("corrTownOrCity")} />
        </div>

        <div className="form-group">
          <label>State / Province / Region</label>
          <input type="text" {...register("corrStateOrProvince")} />
        </div>

        <div className="field-row">
          <div className="form-group field">
            <label>Postal Code</label>
            <input type="text" {...register("corrPostalCode")} />
          </div>

          <div className="form-group field">
            <label>Country</label>
            <select className="large-input" {...register("corrCountry")}>
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

      {/* CONTACT DETAILS */}
      <fieldset>
        <legend>Contact Details</legend>

        <div className="form-group">
          <label>Home Telephone</label>
          <input type="text" {...register("homeTelephone")} />
        </div>

        <div className="form-group">
          <label>Work Telephone</label>
          <input type="text" {...register("workTelephone")} />
        </div>

        <div className="form-group">
          <label>Mobile Telephone</label>
          <input type="text" {...register("mobileTelephone")} />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input type="email" {...register("emailAddress")} />
        </div>
      </fieldset>

      {/* EMPLOYMENT */}
      <fieldset>
        <legend>Employment Status</legend>
        <div className="inline-options">
          {employmentStatusOptions.map(({ label, value }) => (
            <label key={value}>
              <input type="radio" value={value} {...register("employmentStatus")} />
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
              <input type="radio" value={value} {...register("employmentRole")} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-group">
        <label>Occupation</label>
        <input type="text" className="large-input" {...register("occupation")} />
      </div>

      <div className="form-group">
        <label>Nature of Business</label>
        <input type="text" className="large-input" {...register("natureOfBusiness")} />
      </div>
    </form>
  );
});

export default Chgaddr1;
