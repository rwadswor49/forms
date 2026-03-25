import React, { forwardRef, useImperativeHandle } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import Card from "../components/sow/Card";
import { useExpandableCards } from "../components/sow/useExpandableCards";
import { useAutoSave } from "../components/sow/useAutoSave";

export type SavingsEntry = {
  savingsInstitution: string;
  savingsValue: string;
  savingsLocation: string;
  savingsOrigin: string;
};

export type SavingsFormValues = {
  savings: SavingsEntry[];
};

type Props = {
  data: SavingsFormValues | null;
  setData: (data: SavingsFormValues) => void;
};

const SavingsForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    watch
  } = useForm<SavingsFormValues>({
    defaultValues: data || {
      savings: [
        {
          savingsInstitution: "",
          savingsValue: "",
          savingsLocation: "",
          savingsOrigin: ""
        }
      ]
    },
    mode: "onBlur"
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "savings"
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
      <h2>Savings</h2>

      {fields.map((field, index) => {
        const title =
          watch(`savings.${index}.savingsInstitution`) ||
          watch(`savings.${index}.savingsValue`) ||
          "Savings Entry";

        return (
          <Card
            key={field.id}
            index={index}
            title={title}
            expanded={expanded[index]}
            onToggle={() => toggleExpand(index)}
            onDelete={() => remove(index)}
          >
            <h4 className="section-title">Savings Details</h4>

            <div className="form-group">
              <label>Institution</label>
              <input
                className="large-input"
                {...register(`savings.${index}.savingsInstitution`)}
              />
            </div>

            <div className="form-group">
              <label>Total value</label>
              <input
                className="large-input"
                {...register(`savings.${index}.savingsValue`)}
              />
            </div>

            <div className="form-group">
              <label>Location of savings</label>
              <input
                className="large-input"
                {...register(`savings.${index}.savingsLocation`)}
              />
            </div>

            <div className="form-group">
              <label>Where did the funds originally come from?</label>
              <textarea
                rows={3}
                className="large-input"
                {...register(`savings.${index}.savingsOrigin`)}
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
            savingsInstitution: "",
            savingsValue: "",
            savingsLocation: "",
            savingsOrigin: ""
          })
        }
      >
        + Add another savings entry
      </button>
    </form>
  );
});

export default SavingsForm;
