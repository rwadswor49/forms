import React, { forwardRef, useImperativeHandle } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import Card from "../components/sow/Card";
import { useExpandableCards } from "../components/sow/useExpandableCards";
import { useAutoSave } from "../components/sow/useAutoSave";

import countries from "../countries.json";

export type GiftAllowanceEntry = {
  giftAmount: string;
  giftDate: string;
  giftFrom: string;
  giftRelationship: string;
  giftReason: string;
  giftDetails: string;
  giverAddressLine1: string;
  giverCity: string;
  giverRegion: string;
  giverPostalCode: string;
  giverCountry: string;
};

export type GiftAllowanceFormValues = {
  gifts: GiftAllowanceEntry[];
};

type Props = {
  data: GiftAllowanceFormValues | null;
  setData: (data: GiftAllowanceFormValues) => void;
};

const GiftAllowanceForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    watch
  } = useForm<GiftAllowanceFormValues>({
    defaultValues: data || {
      gifts: [
        {
          giftAmount: "",
          giftDate: "",
          giftFrom: "",
          giftRelationship: "",
          giftReason: "",
          giftDetails: "",
          giverAddressLine1: "",
          giverCity: "",
          giverRegion: "",
          giverPostalCode: "",
          giverCountry: ""
        }
      ]
    },
    mode: "onChange"
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "gifts"
  });

// Shared expand/collapse logic
const { expanded, toggleExpand } = useExpandableCards(fields.length);

// Shared auto-save logic (subscription)
React.useEffect(() => {
  const subscription = watch((values) => {
    setData(values);
  });
  return () => subscription.unsubscribe();
}, [watch, setData]);




  // Reset when parent data changes
  const firstLoad = React.useRef(true);

  React.useEffect(() => {
    if (firstLoad.current) {
      reset(data || {});
      firstLoad.current = false;
    }
  }, [data, reset]);

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
      <h2>Gift / Allowance</h2>

      {fields.map((field, index) => {
        const title =
          watch(`gifts.${index}.giftFrom`) ||
          watch(`gifts.${index}.giftAmount`) ||
          "Gift / Allowance Entry";

        return (
          <Card
            key={field.id}
            index={index}
            title={title}
            expanded={expanded[index]}
            onToggle={() => toggleExpand(index)}
            onDelete={() => remove(index)}
          >
            <h4 className="section-title">Gift Details</h4>

            <div className="form-group">
              <label>Amount received</label>
              <input
                className="large-input"
                {...register(`gifts.${index}.giftAmount`)}
              />
            </div>

            <div className="form-group">
              <label>Date received</label>
              <input
                type="date"
                className="smallmed-input"
                {...register(`gifts.${index}.giftDate`)}
              />
            </div>

            <div className="form-group">
              <label>From whom?</label>
              <input
                className="large-input"
                {...register(`gifts.${index}.giftFrom`)}
              />
            </div>

            <div className="form-group">
              <label>Relationship to you</label>
              <input
                className="large-input"
                {...register(`gifts.${index}.giftRelationship`)}
              />
            </div>

            <div className="form-group">
              <label>Reason for the gift or allowance</label>
              <input
                className="large-input"
                {...register(`gifts.${index}.giftReason`)}
              />
            </div>

            <div className="form-group">
              <label>Details</label>
              <textarea
                rows={3}
                className="large-input"
                {...register(`gifts.${index}.giftDetails`)}
              />
            </div>

            <h4 className="section-title">Address of Giver</h4>

            <div className="form-group">
              <label>Address line 1</label>
              <input
                className="large-input"
                {...register(`gifts.${index}.giverAddressLine1`)}
              />
            </div>

            <div className="form-group">
              <label>Town or city</label>
              <input
                className="large-input"
                {...register(`gifts.${index}.giverCity`)}
              />
            </div>

            <div className="form-group">
              <label>State, province or region</label>
              <input
                className="large-input"
                {...register(`gifts.${index}.giverRegion`)}
              />
            </div>

            <div className="form-group">
              <label>Postal code or ZIP code</label>
              <input
                className="large-input"
                {...register(`gifts.${index}.giverPostalCode`)}
              />
            </div>

            <div className="form-group">
              <label>Country or region</label>
              <select
                className="large-input"
                {...register(`gifts.${index}.giverCountry`)}
              >
                <option value="">Select country</option>
                {countries.map(c => (
                  <option key={c.code} value={c.name}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </Card>
        );
      })}

      <button
        type="button"
        className="add-button"
        onClick={() =>
          append({
            giftAmount: "",
            giftDate: "",
            giftFrom: "",
            giftRelationship: "",
            giftReason: "",
            giftDetails: "",
            giverAddressLine1: "",
            giverCity: "",
            giverRegion: "",
            giverPostalCode: "",
            giverCountry: ""
          })
        }
      >
        + Add another gift / allowance
      </button>
    </form>
  );
});

export default GiftAllowanceForm;
