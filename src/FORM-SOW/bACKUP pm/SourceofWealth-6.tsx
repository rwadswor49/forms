import React, { forwardRef, useImperativeHandle } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import Card from "../components/sow/Card";
import { useExpandableCards } from "../components/sow/useExpandableCards";
import { useAutoSave } from "../components/sow/useAutoSave";

import countries from "../countries.json";

export type LotteryEntry = {
  lotteryWinAmount: string;
  lotteryWinDate: string;
  lotteryOrganisation: string;
  lotteryOrgAddressLine1: string;
  lotteryOrgCity: string;
  lotteryOrgRegion: string;
  lotteryOrgPostalCode: string;
  lotteryOrgCountry: string;
};

export type LotteryFormValues = {
  lotteryWins: LotteryEntry[];
};

type Props = {
  data: LotteryFormValues | null;
  setData: (data: LotteryFormValues) => void;
};

const LotteryForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    watch
  } = useForm<LotteryFormValues>({
    defaultValues: data || {
      lotteryWins: [
        {
          lotteryWinAmount: "",
          lotteryWinDate: "",
          lotteryOrganisation: "",
          lotteryOrgAddressLine1: "",
          lotteryOrgCity: "",
          lotteryOrgRegion: "",
          lotteryOrgPostalCode: "",
          lotteryOrgCountry: ""
        }
      ]
    },
    mode: "onBlur"
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lotteryWins"
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
      <h2>Lottery / Gaming Win</h2>

      {fields.map((field, index) => {
        const title =
          watch(`lotteryWins.${index}.lotteryOrganisation`) ||
          watch(`lotteryWins.${index}.lotteryWinAmount`) ||
          "Lottery / Gaming Win";

        return (
          <Card
            key={field.id}
            index={index}
            title={title}
            expanded={expanded[index]}
            onToggle={() => toggleExpand(index)}
            onDelete={() => remove(index)}
          >
            <h4 className="section-title">Win Details</h4>

            <div className="form-group">
              <label>How much did you win?</label>
              <input
                className="large-input"
                {...register(`lotteryWins.${index}.lotteryWinAmount`)}
              />
            </div>

            <div className="form-group">
              <label>Date of Win (MM/YYYY)</label>
              <input
                type="month"
                className="smallmed-input"
                {...register(`lotteryWins.${index}.lotteryWinDate`)}
              />
            </div>

            <div className="form-group">
              <label>Name of lottery or gaming organisation</label>
              <input
                className="large-input"
                {...register(`lotteryWins.${index}.lotteryOrganisation`)}
              />
            </div>

            <h4 className="section-title">Organisation Address</h4>

            <div className="form-group">
              <label>Address line 1</label>
              <input
                className="large-input"
                {...register(`lotteryWins.${index}.lotteryOrgAddressLine1`)}
              />
            </div>

            <div className="form-group">
              <label>Town or city</label>
              <input
                className="large-input"
                {...register(`lotteryWins.${index}.lotteryOrgCity`)}
              />
            </div>

            <div className="form-group">
              <label>State, province or region</label>
              <input
                className="large-input"
                {...register(`lotteryWins.${index}.lotteryOrgRegion`)}
              />
            </div>

            <div className="form-group">
              <label>Postal code or ZIP code</label>
              <input
                className="large-input"
                {...register(`lotteryWins.${index}.lotteryOrgPostalCode`)}
              />
            </div>

            <div className="form-group">
              <label>Country or region</label>
              <select
                className="large-input"
                {...register(`lotteryWins.${index}.lotteryOrgCountry`)}
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
            lotteryWinAmount: "",
            lotteryWinDate: "",
            lotteryOrganisation: "",
            lotteryOrgAddressLine1: "",
            lotteryOrgCity: "",
            lotteryOrgRegion: "",
            lotteryOrgPostalCode: "",
            lotteryOrgCountry: ""
          })
        }
      >
        + Add another lottery / gaming win
      </button>
    </form>
  );
});

export default LotteryForm;
