import React, { forwardRef, useImperativeHandle } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import Card from "../components/sow/Card";
import { useExpandableCards } from "../components/sow/useExpandableCards";
import { useAutoSave } from "../components/sow/useAutoSave";

export type InheritanceEntry = {
  inheritanceAmount: string;
  inheritanceDate: string;
  inheritanceFrom: string;
  inheritanceRelationship: string;
  inheritanceDetails: string;
};

export type InheritanceFormValues = {
  inheritances: InheritanceEntry[];
};

type Props = {
  data: InheritanceFormValues | null;
  setData: (data: InheritanceFormValues) => void;
};

const InheritanceForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    watch
  } = useForm<InheritanceFormValues>({
    defaultValues: data || {
      inheritances: [
        {
          inheritanceAmount: "",
          inheritanceDate: "",
          inheritanceFrom: "",
          inheritanceRelationship: "",
          inheritanceDetails: ""
        }
      ]
    },
    mode: "onBlur"
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inheritances"
  });

  // Shared expand/collapse logic
  const { expanded, toggleExpand } = useExpandableCards(fields.length);

  // Shared auto-save logic
  useAutoSave(watch, setData);

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
      <h2>Inheritance</h2>

      {fields.map((field, index) => {
        const title =
          watch(`inheritances.${index}.inheritanceFrom`) ||
          watch(`inheritances.${index}.inheritanceAmount`) ||
          "Inheritance Entry";

        return (
          <Card
            key={field.id}
            index={index}
            title={title}
            expanded={expanded[index]}
            onToggle={() => toggleExpand(index)}
            onDelete={() => remove(index)}
          >
            <h4 className="section-title">Inheritance Details</h4>

            <div className="form-group">
              <label>Amount received</label>
              <input
                className="large-input"
                {...register(`inheritances.${index}.inheritanceAmount`)}
              />
            </div>

            <div className="form-group">
              <label>Date received</label>
              <input
                type="date"
                className="smallmed-input"
                {...register(`inheritances.${index}.inheritanceDate`)}
              />
            </div>

            <div className="form-group">
              <label>From whom did you inherit?</label>
              <input
                className="large-input"
                {...register(`inheritances.${index}.inheritanceFrom`)}
              />
            </div>

            <div className="form-group">
              <label>Relationship to you</label>
              <input
                className="large-input"
                {...register(`inheritances.${index}.inheritanceRelationship`)}
              />
            </div>

            <div className="form-group">
              <label>Details</label>
              <textarea
                rows={3}
                className="large-input"
                {...register(`inheritances.${index}.inheritanceDetails`)}
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
            inheritanceAmount: "",
            inheritanceDate: "",
            inheritanceFrom: "",
            inheritanceRelationship: "",
            inheritanceDetails: ""
          })
        }
      >
        + Add another inheritance
      </button>
    </form>
  );
});

export default InheritanceForm;

