import React, { forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAutoSave } from "../components/sow/useAutoSave";

export type WealthFormValues = {
  planNumber: string;
  name: string;
  dobDate: string;
  wealthSources: string[];
};

type Props = {
  data: WealthFormValues | null;
  setData: (data: WealthFormValues) => void;
};

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

const WealthForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    reset
  } = useForm<WealthFormValues>({
    defaultValues: {
      planNumber: "",
      name: "",
      dobDate: "",
      wealthSources: [],
      ...(data || {})
    },
    mode: "onBlur"
  });

  // ✅ FIX 1: prevent infinite reset loop
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      reset({
        planNumber: "",
        name: "",
        dobDate: "",
        wealthSources: [],
        ...(data || {})
      });
      isFirstLoad.current = false;
    }
  }, [data, reset]);

  // ✅ FIX 2: use proper autosave (NOT manual watch)
  useAutoSave(watch, setData);

  // Expose submit + values to parent
  useImperativeHandle(ref, () => ({
    submit: async () => {
      let valid = false;

      await handleSubmit(
        v => {
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

  return (
    <form>
      <div className="form-group">
        <label>Plan number(s)</label>
        <input
          type="text"
          className="smallmed-input"
          {...register("planNumber")}
        />
      </div>

      <div className="form-group">
        <label>Name</label>
        <input type="text" {...register("name")} />
      </div>

      <div className="form-group">
        <label>Date of Birth</label>
        <input
          type="date"
          className="smallmed-input"
          {...register("dobDate")}
        />
      </div>

      <fieldset>
        <legend>What has generated your total body of wealth?</legend>

        <div className="inline-options">
          {wealthSourceOptions.map(({ label, value }) => (
            <label key={value}>
              <input
                type="checkbox"
                value={value}
                {...register("wealthSources")}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
    </form>
  );
});

export default WealthForm;