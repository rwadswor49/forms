import React, { forwardRef, useImperativeHandle } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import Card from "../components/sow/Card";
import { useExpandableCards } from "../components/sow/useExpandableCards";
import { useAutoSave } from "../components/sow/useAutoSave";

export type PensionEntry = {
  pensionType: "employer" | "personal" | "";
  employerSchemeName: string;
  occupation: string;
  yearsWorked: number | "";
  employmentPensionInstitution: string;
  employmentPensionValue: string;
  personalPensionInstitution: string;
  personalPensionJurisdiction: string;
  personalPensionValue: string;
};

export type PensionFormValues = {
  pensions: PensionEntry[];
};

type Props = {
  data: PensionFormValues | null;
  setData: (data: PensionFormValues) => void;
};

const PensionForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    watch
  } = useForm<PensionFormValues>({
    defaultValues: data || {
      pensions: [
        {
          pensionType: "",
          employerSchemeName: "",
          occupation: "",
          yearsWorked: "",
          employmentPensionInstitution: "",
          employmentPensionValue: "",
          personalPensionInstitution: "",
          personalPensionJurisdiction: "",
          personalPensionValue: ""
        }
      ]
    },
    mode: "onChange"
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "pensions"
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
      <h2>Pension</h2>

      {fields.map((field, index) => {
        const pensionType = watch(`pensions.${index}.pensionType`);

        const title =
          pensionType === "employer"
            ? watch(`pensions.${index}.employerSchemeName`) || "Employment Pension"
            : pensionType === "personal"
            ? watch(`pensions.${index}.personalPensionInstitution`) || "Personal Pension"
            : "Pension Details";

        return (
          <Card
            key={field.id}
            index={index}
            title={title}
            expanded={expanded[index]}
            onToggle={() => toggleExpand(index)}
            onDelete={() => remove(index)}
          >
            {/* SECTION: Pension Type */}
            <h4 className="section-title">Pension Type</h4>

            <div className="form-group">
              <label>Is this an Employment Pension or Personal Pension?</label>
              <div className="inline-options">
                <label>
                  <input
                    type="radio"
                    value="employer"
                    {...register(`pensions.${index}.pensionType`)}
                  />
                  Employer
                </label>
                <label>
                  <input
                    type="radio"
                    value="personal"
                    {...register(`pensions.${index}.pensionType`)}
                  />
                  Personal
                </label>
              </div>
            </div>

            {/* COMMON FIELD */}
            <div className="form-group">
              <label>Occupation</label>
              <input
                className="large-input"
                {...register(`pensions.${index}.occupation`)}
              />
            </div>

            {/* EMPLOYER SECTION */}
            {pensionType === "employer" && (
              <>
                <h4 className="section-title">Employment Pension</h4>

                <div className="form-group">
                  <label>Employer Scheme Name</label>
                  <input
                    className="large-input"
                    {...register(`pensions.${index}.employerSchemeName`)}
                  />
                </div>

                <div className="form-group">
                  <label>Years Worked</label>
                  <input
                    type="number"
                    className="smallmed-input"
                    {...register(`pensions.${index}.yearsWorked`, {
                      valueAsNumber: true
                    })}
                  />
                </div>

                <div className="form-group">
                  <label>Institution</label>
                  <input
                    className="large-input"
                    {...register(`pensions.${index}.employmentPensionInstitution`)}
                  />
                </div>

                <div className="form-group">
                  <label>Value of Pension</label>
                  <input
                    className="large-input"
                    {...register(`pensions.${index}.employmentPensionValue`)}
                  />
                </div>
              </>
            )}

            {/* PERSONAL SECTION */}
            {pensionType === "personal" && (
              <>
                <h4 className="section-title">Personal Pension</h4>

                <div className="form-group">
                  <label>Institution</label>
                  <input
                    className="large-input"
                    {...register(`pensions.${index}.personalPensionInstitution`)}
                  />
                </div>

                <div className="form-group">
                  <label>Jurisdiction</label>
                  <input
                    className="large-input"
                    {...register(`pensions.${index}.personalPensionJurisdiction`)}
                  />
                </div>

                <div className="form-group">
                  <label>Value of Pension</label>
                  <input
                    className="large-input"
                    {...register(`pensions.${index}.personalPensionValue`)}
                  />
                </div>
              </>
            )}
          </Card>
        );
      })}

      <button
        type="button"
        className="add-button"
        onClick={() =>
          append({
            pensionType: "",
            employerSchemeName: "",
            occupation: "",
            yearsWorked: "",
            employmentPensionInstitution: "",
            employmentPensionValue: "",
            personalPensionInstitution: "",
            personalPensionJurisdiction: "",
            personalPensionValue: ""
          })
        }
      >
        + Add another pension
      </button>
    </form>
  );
});

export default PensionForm;
