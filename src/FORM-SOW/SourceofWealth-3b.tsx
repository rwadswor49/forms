import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import Card from "../components/sow/Card";
import { useExpandableCards } from "../components/sow/useExpandableCards";
import { useAutoSave } from "../components/sow/useAutoSave";

export type ArtInvestmentEntry = {
  artDescription: string;
  artNetIncome: string;
  artInvestmentDetails: string;
  artInitialInvestmentWealth: string;
};

export type ArtInvestmentsFormValues = {
  artInvestments: ArtInvestmentEntry[];
};

type Props = {
  data: ArtInvestmentsFormValues | null;
  setData: (data: ArtInvestmentsFormValues) => void;
};

const ArtInvestmentsForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    watch
  } = useForm<ArtInvestmentsFormValues>({
    defaultValues: data || { artInvestments: [] },
    mode: "onChange"
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "artInvestments"
  });

  // -----------------------------
  // INITIAL EXPANDED STATE
  // -----------------------------
  const initialExpanded = data?.artInvestments?.length
    ? data.artInvestments.map(() => false)
    : [true]; // auto-expand first row if no data

  const { expanded, toggleExpand, setExpanded } = useExpandableCards(fields.length, initialExpanded);

  // -----------------------------
  // FIRST LOAD: ensure at least 1 row
  // -----------------------------
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      if (!data?.artInvestments || data.artInvestments.length === 0) {
        append({
          artDescription: "",
          artNetIncome: "",
          artInvestmentDetails: "",
          artInitialInvestmentWealth: ""
        });
      } else {
        reset(data);
      }
      firstLoad.current = false;
    }
  }, [data, append, reset]);

  // -----------------------------
  // AUTO SAVE
  // -----------------------------
  useEffect(() => {
    const subscription = watch((values) => setData(values));
    return () => subscription.unsubscribe();
  }, [watch, setData]);

  // -----------------------------
  // SUBMIT / GET VALUES
  // -----------------------------
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
      <h2>Art Investments</h2>

      {fields.map((field, index) => {
        const title =
          watch(`artInvestments.${index}.artDescription`) ||
          "Art Investment";

        return (
          <Card
            key={field.id}
            index={index}
            title={title}
            expanded={expanded[index]}
            onToggle={() => toggleExpand(index)}
            onDelete={() => remove(index)}
          >
            {/* SECTION: Description */}
            <h4 className="section-title">Artwork Description</h4>
            <div className="form-group">
              <label>Describe the artwork(s)</label>
              <textarea
                rows={3}
                className="large-input"
                placeholder="Artist, title, date, size, medium"
                {...register(`artInvestments.${index}.artDescription`)}
              />
            </div>

            {/* SECTION: Financials */}
            <h4 className="section-title">Financials</h4>
            <div className="form-group">
              <label>Estimated net income from art investments</label>
              <input
                type="number"
                className="smallmed-input"
                {...register(`artInvestments.${index}.artNetIncome`)}
              />
            </div>

            {/* SECTION: Investment Details */}
            <h4 className="section-title">Investment Details</h4>
            <div className="form-group">
              <label>Details of your investments</label>
              <textarea
                rows={3}
                className="large-input"
                placeholder="Include dates and amounts"
                {...register(`artInvestments.${index}.artInvestmentDetails`)}
              />
            </div>

            {/* SECTION: Wealth Source */}
            <h4 className="section-title">Initial Investment Source</h4>
            <div className="form-group">
              <label>Where did you get the wealth to fund your initial investments?</label>
              <textarea
                rows={3}
                className="large-input"
                {...register(`artInvestments.${index}.artInitialInvestmentWealth`)}
              />
            </div>
          </Card>
        );
      })}

      <button
        type="button"
        className="add-button"
        onClick={() => {
          append({
            artDescription: "",
            artNetIncome: "",
            artInvestmentDetails: "",
            artInitialInvestmentWealth: ""
          });
          setExpanded(prev => [...prev, true]); // auto-expand newly added row
        }}
      >
        + Add another art investment
      </button>
    </form>
  );
});

export default ArtInvestmentsForm;
