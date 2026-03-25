import React, { forwardRef, useImperativeHandle } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import Card from "../components/sow/Card";
import { useExpandableCards } from "../components/sow/useExpandableCards";
import { useAutoSave } from "../components/sow/useAutoSave";

export type InvestmentEntry = {
  investmentIncome: string;
  portfolioValue: string;
  investmentCompany: string;
  investmentLocation: string;
  investmentStartDate: string;
  investmentWealthSource: string;
};

export type InvestmentsFormValues = {
  investments: InvestmentEntry[];
};

type Props = {
  data: InvestmentsFormValues | null;
  setData: (data: InvestmentsFormValues) => void;
};

const InvestmentsForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    watch
  } = useForm<InvestmentsFormValues>({
    defaultValues: data || {
      investments: [
        {
          investmentIncome: "",
          portfolioValue: "",
          investmentCompany: "",
          investmentLocation: "",
          investmentStartDate: "",
          investmentWealthSource: ""
        }
      ]
    },
    mode: "onBlur"
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "investments"
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
      <h2>Investments</h2>
      <p className="hint">Including stocks, shares, cryptocurrencies & other</p>

      {fields.map((field, index) => {
        const title =
          watch(`investments.${index}.investmentCompany`) ||
          watch(`investments.${index}.investmentLocation`) ||
          "Investment Details";

        return (
          <Card
            key={field.id}
            index={index}
            title={title}
            expanded={expanded[index]}
            onToggle={() => toggleExpand(index)}
            onDelete={() => remove(index)}
          >
            {/* SECTION: Financials */}
            <h4 className="section-title">Financials</h4>

            <div className="form-group">
              <label>Total income from investment</label>
              <input
                className="large-input"
                {...register(`investments.${index}.investmentIncome`)}
              />
            </div>

            <div className="form-group">
              <label>Total value of your portfolio</label>
              <input
                className="large-input"
                {...register(`investments.${index}.portfolioValue`)}
              />
            </div>

            {/* SECTION: Investment Details */}
            <h4 className="section-title">Investment Details</h4>

            <div className="form-group">
              <label>Company where your investment is held</label>
              <input
                className="large-input"
                {...register(`investments.${index}.investmentCompany`)}
              />
            </div>

            <div className="form-group">
              <label>Location of your investment</label>
              <input
                className="large-input"
                {...register(`investments.${index}.investmentLocation`)}
              />
            </div>

            <div className="form-group">
              <label>Start date of investment</label>
              <input
                type="date"
                className="smallmed-input"
                {...register(`investments.${index}.investmentStartDate`)}
              />
            </div>

            {/* SECTION: Wealth Source */}
            <h4 className="section-title">Source of Wealth</h4>

            <div className="form-group">
              <label>Where did you get the wealth to fund your initial investment?</label>
              <textarea
                rows={3}
                className="large-input"
                {...register(`investments.${index}.investmentWealthSource`)}
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
            investmentIncome: "",
            portfolioValue: "",
            investmentCompany: "",
            investmentLocation: "",
            investmentStartDate: "",
            investmentWealthSource: ""
          })
        }
      >
        + Add another investment
      </button>
    </form>
  );
});

export default InvestmentsForm;
