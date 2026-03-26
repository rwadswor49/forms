import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef
} from "react";

import { useForm } from "react-hook-form";

import Card from "../components/COA/Card";
import { useAutoSave } from "../components/COA/useAutoSave";

export type CompanyDetails = {
  companyName: string;
  registeredAddress: string;
  dateMoved: string;
  correspondenceAddress: string;
  taxResidence: string;
  taxReference: string;
  noTaxRefReason: string;
  fatcaGiin: string;
};

export type Chgaddr2Values = {
  hasCompanyDetails: string; // "yes" | "no"
  company: CompanyDetails | null;
};

type Props = {
  data: Chgaddr2Values | null;
  setData: (data: Chgaddr2Values) => void;
};

const Chgaddr2 = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    watch
  } = useForm<Chgaddr2Values>({
    defaultValues: data || {
      hasCompanyDetails: "no",
      company: null
    },
    mode: "onChange"
  });

  const hasCompany = watch("hasCompanyDetails") === "yes";

  // -----------------------------
  // FIRST LOAD: restore saved data
  // -----------------------------
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current && data) {
      reset(data);
      firstLoad.current = false;
    }
  }, [data, reset]);

  // -----------------------------
  // AUTO SAVE
  // -----------------------------
  useAutoSave(watch, setData);

  // -----------------------------
  // SUBMIT / GET VALUES
  // -----------------------------
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

      return valid ? getValues() : null;
    },
    getValues
  }));

  return (
    <form>
      <h2>Company Details</h2>

      <p className="hint">
        Only complete this section if the plan owner or trustee is a company.
      </p>

      {/* YES / NO TOGGLE */}
      <div className="form-group">
        <label>Do you have company details to provide?</label>

        <div className="inline-options">
          <label>
            <input
              type="radio"
              value="yes"
              {...register("hasCompanyDetails")}
            />
            Yes
          </label>

          <label>
            <input
              type="radio"
              value="no"
              {...register("hasCompanyDetails")}
            />
            No
          </label>
        </div>
      </div>

      {/* COMPANY DETAILS CARD */}
      {hasCompany && (
        <Card
          index={0}
          title="Company Details"
          expanded={true}
          onToggle={() => {}}
          onDelete={undefined}
        >
          <div className="form-group">
            <label>Company name</label>
            <input
              className="large-input"
              {...register("company.companyName")}
            />
          </div>

          <div className="form-group">
            <label>New registered address and postcode (in full)</label>
            <textarea
              className="large-input"
              rows={3}
              {...register("company.registeredAddress")}
            />
          </div>

          <div className="form-group">
            <label>Date moved to new address</label>
            <input
              type="date"
              className="smallmed-input"
              {...register("company.dateMoved")}
            />
          </div>

          <div className="form-group">
            <label>New correspondence address and postcode (in full)</label>
            <textarea
              className="large-input"
              rows={3}
              {...register("company.correspondenceAddress")}
            />
          </div>

          <div className="form-group">
            <label>Country of residence for tax purposes</label>
            <input
              className="large-input"
              {...register("company.taxResidence")}
            />
          </div>

          <div className="form-group">
            <label>Company tax reference number(s)</label>
            <input
              className="large-input"
              {...register("company.taxReference")}
            />
          </div>

          <div className="form-group">
            <label>If no tax reference number, specify reason</label>
            <textarea
              className="large-input"
              rows={2}
              {...register("company.noTaxRefReason")}
            />
          </div>

          <div className="form-group">
            <label>FATCA GIIN (if applicable)</label>
            <input
              className="large-input"
              {...register("company.fatcaGiin")}
            />
          </div>
        </Card>
      )}
    </form>
  );
});

export default Chgaddr2;
