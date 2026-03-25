import React, { forwardRef, useImperativeHandle } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import Card from "../components/sow/Card";
import { useExpandableCards } from "../components/sow/useExpandableCards";
import { useAutoSave } from "../components/sow/useAutoSave";

export type RealEstateEntry = {
  realEstateIncome: string;
  realEstateCompany: string;
  realEstateDetails: string;
  realEstateCapitalSource: string;
};

export type RealEstateFormValues = {
  realEstate: RealEstateEntry[];
};

type Props = {
  data: RealEstateFormValues | null;
  setData: (data: RealEstateFormValues) => void;
};

const RealEstateForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    watch
  } = useForm<RealEstateFormValues>({
    defaultValues: data || {
      realEstate: [
        {
          realEstateIncome: "",
          realEstateCompany: "",
          realEstateDetails: "",
          realEstateCapitalSource: ""
        }
      ]
    },
    mode: "onBlur"
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "realEstate"
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
      <h2>Real Estate</h2>

      {fields.map((field, index) => {
        const title =
          watch(`realEstate.${index}.realEstateCompany`) ||
          watch(`realEstate.${index}.realEstateDetails`) ||
          "Real Estate Entry";

        return (
          <Card
            key={field.id}
            index={index}
            title={title}
            expanded={expanded[index]}
            onToggle={() => toggleExpand(index)}
            onDelete={() => remove(index)}
          >
            <h4 className="section-title">Financials</h4>

            <div className="form-group">
              <label>Total income from real estate</label>
              <input
                className="large-input"
                {...register(`realEstate.${index}.realEstateIncome`)}
              />
            </div>

            <h4 className="section-title">Company / Source</h4>

            <div className="form-group">
              <label>
                Name of real estate company or companies
                <br />
                <span className="hint">Where the funds will be coming from</span>
              </label>
              <input
                className="large-input"
                {...register(`realEstate.${index}.realEstateCompany`)}
              />
            </div>

            <h4 className="section-title">Property Details</h4>

            <div className="form-group">
              <label>Please give details of the properties or developments</label>
              <textarea
                rows={4}
                className="large-input"
                {...register(`realEstate.${index}.realEstateDetails`)}
              />
            </div>

            <h4 className="section-title">Initial Investment Source</h4>

            <div className="form-group">
              <label>Where did you get the capital to fund your initial investment?</label>
              <textarea
                rows={3}
                className="large-input"
                placeholder="Please give details"
                {...register(`realEstate.${index}.realEstateCapitalSource`)}
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
            realEstateIncome: "",
            realEstateCompany: "",
            realEstateDetails: "",
            realEstateCapitalSource: ""
          })
        }
      >
        + Add another real estate entry
      </button>
    </form>
  );
});

export default RealEstateForm;
