import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import Card from "../components/sow/Card";
import { useExpandableCards } from "../components/sow/useExpandableCards";
import { useAutoSave } from "../components/sow/useAutoSave";

export type OtherEntry = {
  otherIncomeDescription: string;
  otherWealthSource: string;
  otherWealthValue: string;
  fundsOriginExtra: string;
};

export type OtherFormValues = {
  other: OtherEntry[];
};

type Props = {
  data: OtherFormValues | null;
  setData: (data: OtherFormValues) => void;
};

const OtherForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    watch
  } = useForm<OtherFormValues>({
    defaultValues: data || { other: [] },
    mode: "onChange"
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "other"
  });

  // Expand/collapse logic (shared hook)
  const { expanded, toggleExpand } = useExpandableCards(fields.length);

  // Shared auto-save logic (subscription)
  React.useEffect(() => {
    const subscription = watch((values) => {
      setData(values);
    });
    return () => subscription.unsubscribe();
  }, [watch, setData]);

  // -----------------------------
  // FIRST LOAD
  // -----------------------------
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      if (!data?.other || data.other.length === 0) {
        append({
          otherIncomeDescription: "",
          otherWealthSource: "",
          otherWealthValue: "",
          fundsOriginExtra: ""
        });
      } else {
        reset(data);
      }
      firstLoad.current = false;
    }
  }, [data, append, reset]);

  // Expose submit + getValues to parent
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
      <h2>Other</h2>

      {fields.map((field, index) => {
        const title =
          watch(`other.${index}.otherIncomeDescription`) ||
          watch(`other.${index}.otherWealthValue`) ||
          "Other Income / Wealth Entry";

        return (
          <Card
            key={field.id}
            index={index}
            title={title}
            expanded={expanded[index]}
            onToggle={() => toggleExpand(index)}
            onDelete={() => remove(index)}
          >
            <h4 className="section-title">Description</h4>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={3}
                className="large-input"
                {...register(`other.${index}.otherIncomeDescription`)}
              />
            </div>

            <h4 className="section-title">Source of Wealth</h4>

            <div className="form-group">
              <label>Source of wealth</label>
              <textarea
                rows={3}
                className="large-input"
                {...register(`other.${index}.otherWealthSource`)}
              />
            </div>

            <h4 className="section-title">Value</h4>

            <div className="form-group">
              <label>Value of wealth</label>
              <input
                type="number"
                className="smallmed-input"
                {...register(`other.${index}.otherWealthValue`)}
              />
            </div>

            <h4 className="section-title">Origin of Funds</h4>

            <div className="form-group">
              <label>Where did the funds originally come from?</label>
              <textarea
                rows={4}
                className="large-input"
                {...register(`other.${index}.fundsOriginExtra`)}
              />
            </div>
          </Card>
        );
      })}

      <button
        type="button"
        className="add-button"
        onClick={() =>
          append({
            otherIncomeDescription: "",
            otherWealthSource: "",
            otherWealthValue: "",
            fundsOriginExtra: ""
          })
        }
      >
        + Add another entry
      </button>
    </form>
  );
});

export default OtherForm;

