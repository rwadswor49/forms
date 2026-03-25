import React, { forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import isEqual from "lodash.isequal";

export type InheritanceGiftsFormValues = {
  inheritanceValue: string;
  inheritanceDate: string;
  inheritanceFrom: string;
  inheritanceRelationship: string;
  inheritanceAssetType: string;
  inheritanceWealthOrigin: string;
  giftAmount: string;
  giftType: "gift" | "allowance" | "";
  giftDate: string;
  giftFrequency: "once" | "monthly" | "quarterly" | "annually" | "other" | "";
  giftFrequencyOther: string;
  giftFrom: string;
  giftRelationship: string;
  giftFundsOrigin: string;
};

type Props = {
  data: InheritanceGiftsFormValues | null;
  setData: (data: InheritanceGiftsFormValues) => void;
};

const InheritanceGiftsForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    reset,
    formState: { errors }
  } = useForm<InheritanceGiftsFormValues>({
    defaultValues: data || {
      inheritanceValue: "",
      inheritanceDate: "",
      inheritanceFrom: "",
      inheritanceRelationship: "",
      inheritanceAssetType: "",
      inheritanceWealthOrigin: "",
      giftAmount: "",
      giftType: "",
      giftDate: "",
      giftFrequency: "",
      giftFrequencyOther: "",
      giftFrom: "",
      giftRelationship: "",
      giftFundsOrigin: "",
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
const prevRef = useRef<InheritanceGiftsFormValues | null>(null);

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


  const giftTypeValue = watch("giftType");
  const giftFrequencyValue = watch("giftFrequency");

  return (
    <form>

      {/* Inheritance */}
      <section className="section section-inheritance">
        <h2>Inheritance</h2>
        <div className="field">
          <label htmlFor="inheritanceValue">Value of your inheritance</label>
          <input id="inheritanceValue" {...register("inheritanceValue")} type="text" />
        </div>

        <div className="field">
          <label htmlFor="inheritanceDate">
            Date inheritance received (MM/YYYY)
          </label>
          <input
            id="inheritanceDate"
            type="month"
            {...register("inheritanceDate")}
            className="smallmed-input"
          />
        </div>

        <div className="field">
          <label htmlFor="inheritanceFrom">Who did you receive the inheritance from?</label>
          <input id="inheritanceFrom" {...register("inheritanceFrom")} type="text" />
        </div>

        <div className="field">
          <label htmlFor="inheritanceRelationship">What's their relationship to you?</label>
          <input
            id="inheritanceRelationship"
            {...register("inheritanceRelationship")}
            type="text"
            placeholder="For instance, father or mother"
          />
        </div>

        <div className="field">
          <label htmlFor="inheritanceAssetType">What type of asset did you inherit?</label>
          <input
            id="inheritanceAssetType"
            {...register("inheritanceAssetType")}
            type="text"
            placeholder="For instance, money, land, securities or trusts"
          />
        </div>

        <div className="field">
          <label htmlFor="inheritanceWealthOrigin">How was the wealth originally created?</label>
          <textarea id="inheritanceWealthOrigin" {...register("inheritanceWealthOrigin")} rows={3} />
        </div>
      </section>

      {/* Gift / Allowance */}
      <section className="section section-gift">
        <h2>Gift / Allowance</h2>

        <div className="field">
          <label htmlFor="giftAmount">Gift or allowance amount</label>
          <input id="giftAmount" {...register("giftAmount")} type="text" />
        </div>

        <div className="field">
          <label>Was this a gift or allowance?</label>
          <div className="options-horizontal">
            <label>
              <input
                type="radio"
                value="gift"
                {...register("giftType")}
                checked={giftTypeValue === "gift"}
              />
              Gift
            </label>
            <label>
              <input
                type="radio"
                value="allowance"
                {...register("giftType")}
                checked={giftTypeValue === "allowance"}
              />
              Allowance
            </label>
          </div>
        </div>

        <div className="field">
          <label htmlFor="giftDate">Date of payment (MM/YYYY)</label>
          <input
            id="giftDate"
            type="month"
            {...register("giftDate")}
            className="smallmed-input"
          />
        </div>

        <div className="field">
          <label>How often have you received this payment?</label>
          <div className="options-vertical">
            {["once", "monthly", "quarterly", "annually", "other"].map((freq) => (
              <label key={freq}>
                <input
                  type="radio"
                  value={freq}
                  {...register("giftFrequency")}
                  checked={giftFrequencyValue === freq}
                />
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="giftFrequencyOther">
            If other selected – Please confirm frequency of payment
          </label>
          <input id="giftFrequencyOther" {...register("giftFrequencyOther")} type="text" />
        </div>

        <div className="field">
          <label htmlFor="giftFrom">Name of who you received the Gift/Allowance from?</label>
          <input id="giftFrom" {...register("giftFrom")} type="text" />
        </div>

        <div className="field">
          <label htmlFor="giftRelationship">What's their relationship to you?</label>
          <input
            id="giftRelationship"
            {...register("giftRelationship")}
            type="text"
            placeholder="For instance, father or mother"
          />
        </div>

        <div className="field">
          <label htmlFor="giftFundsOrigin">
            Where did the funds for this gift or allowance originally come from?
          </label>
          <textarea
            id="giftFundsOrigin"
            {...register("giftFundsOrigin")}
            rows={3}
            placeholder="Please give details"
          />
        </div>
      </section>

    </form>
  );
});

export default InheritanceGiftsForm;
