import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef
} from "react";

import { useForm, useFieldArray } from "react-hook-form";

import Card from "../components/COA/Card";
import { useAutoSave } from "../components/COA/useAutoSave";

/* ---------------------------------------------
   TYPES
--------------------------------------------- */
export type TaxResidency = {
  country: string;
  tin: string;
  functionalEquivalent: string;
};

export type Signatory = {
  fullName: string;
  countryOfBirth: string;
  usSpecifiedPerson: string;
  taxResidencies: TaxResidency[];
  isPlanOwner1?: boolean;
  isPlanOwner2?: boolean;
};

export type Page1Values = {
  planNumber: string;
  numberOfSignatories: number;
  includePO1: string;
  includePO2: string;
  signatories: Signatory[];
};

type Props = {
  data: Page1Values | null;
  setData: (data: Page1Values) => void;

  planOwner1?: { fullName: string; countryOfBirth: string };
  planOwner2?: { fullName: string; countryOfBirth: string } | null;
};

/* ---------------------------------------------
   CHILD COMPONENT
--------------------------------------------- */
const SignatoryCard = ({ control, register, index, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `signatories.${index}.taxResidencies`
  });

  const titleName = watch(`signatories.${index}.fullName`);
  const title = titleName
    ? `Signatory #${index + 1} — ${titleName}`
    : `Signatory #${index + 1}`;

  return (
    <Card title={title} expanded={true}>
      <div className="form-group">
        <label>Full Name</label>
        <input
          className="large-input"
          {...register(`signatories.${index}.fullName`)}
        />
      </div>

      <div className="form-group">
        <label>Country of Birth</label>
        <input
          className="large-input"
          {...register(`signatories.${index}.countryOfBirth`)}
        />
      </div>

      <div className="form-group">
        <label>US Specified Person</label>
        <div className="inline-options">
          <label>
            <input
              type="radio"
              value="yes"
              {...register(`signatories.${index}.usSpecifiedPerson`)}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              value="no"
              {...register(`signatories.${index}.usSpecifiedPerson`)}
            />
            No
          </label>
        </div>
      </div>

      <h4>Tax Residency</h4>

      {fields.map((tr, trIndex) => (
        <Card
          key={tr.id}
          title={`Tax Residency #${trIndex + 1}`}
          expanded={true}
          onDelete={() => remove(trIndex)}
        >
          <div className="form-group">
            <label>Country of Tax Residence</label>
            <input
              className="large-input"
              {...register(
                `signatories.${index}.taxResidencies.${trIndex}.country`
              )}
            />
          </div>

          <div className="form-group">
            <label>TIN / NIN</label>
            <input
              className="large-input"
              {...register(
                `signatories.${index}.taxResidencies.${trIndex}.tin`
              )}
            />
          </div>

          <div className="form-group">
            <label>Functional Equivalent</label>
            <input
              className="large-input"
              {...register(
                `signatories.${index}.taxResidencies.${trIndex}.functionalEquivalent`
              )}
            />
          </div>
        </Card>
      ))}

      <button
        type="button"
        className="add-button"
        onClick={() =>
          append({
            country: "",
            tin: "",
            functionalEquivalent: ""
          })
        }
      >
        + Add Tax Residency
      </button>
    </Card>
  );
};

/* ---------------------------------------------
   MAIN PAGE COMPONENT
--------------------------------------------- */
const Chgaddr1_Signatories = forwardRef<any, Props>(
  ({ data, setData, planOwner1, planOwner2 }, ref) => {
    const {
      register,
      control,
      watch,
      reset,
      getValues,
      setValue
    } = useForm<Page1Values>({
      defaultValues: data || {
        planNumber: "",
        numberOfSignatories: 1,
        includePO1: "yes",
        includePO2: planOwner2 ? "yes" : "no",
        signatories: [
          {
            fullName: "",
            countryOfBirth: "",
            usSpecifiedPerson: "no",
            taxResidencies: []
          }
        ]
      },
      mode: "onChange"
    });

    const numberOfSignatories = watch("numberOfSignatories");
    const includePO1 = watch("includePO1") === "yes";
    const includePO2 = watch("includePO2") === "yes";

    const {
      fields: signatoryFields,
      append,
      remove
    } = useFieldArray({
      control,
      name: "signatories"
    });

    useEffect(() => {
      if (data) reset(data);
    }, [data, reset]);

    useAutoSave(watch, setData);

    /* AUTO-BUILD SIGNATORY LIST */
    useEffect(() => {
      const current = getValues("signatories") || [];
      const desired = numberOfSignatories;

      if (current.length < desired) {
        for (let i = current.length; i < desired; i++) {
          append({
            fullName: "",
            countryOfBirth: "",
            usSpecifiedPerson: "no",
            taxResidencies: []
          });
        }
      } else if (current.length > desired) {
        for (let i = current.length - 1; i >= desired; i--) {
          remove(i);
        }
      }
    }, [numberOfSignatories, append, remove, getValues]);

    /* AUTO-POPULATE PLAN OWNERS */
    useEffect(() => {
      const sigs = getValues("signatories");
      if (!sigs || sigs.length === 0) return;

      if (includePO1 && planOwner1) {
        setValue("signatories.0.fullName", planOwner1.fullName);
        setValue("signatories.0.countryOfBirth", planOwner1.countryOfBirth);
        setValue("signatories.0.isPlanOwner1", true);
      }

      if (includePO2 && planOwner2 && numberOfSignatories >= 2) {
        setValue("signatories.1.fullName", planOwner2.fullName);
        setValue("signatories.1.countryOfBirth", planOwner2.countryOfBirth);
        setValue("signatories.1.isPlanOwner2", true);
      }
    }, [
      includePO1,
      includePO2,
      planOwner1,
      planOwner2,
      numberOfSignatories,
      setValue,
      getValues
    ]);

    useImperativeHandle(ref, () => ({
      submit: async () => getValues(),
      getValues
    }));

    return (
      <div>
        <h2>Signatories Setup</h2>

        {/* PLAN NUMBER */}
        <div className="form-group">
          <label>Plan Number</label>
          <input
            className="large-input"
            {...register("planNumber", { required: true })}
          />
        </div>

        {/* NUMBER OF SIGNATORIES */}
        <div className="form-group">
          <label>Number of Signatories</label>
          <select
            className="smallmed-input"
            {...register("numberOfSignatories")}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>

        {/* PLAN OWNER 1 SIGNATORY QUESTION */}
        <div className="form-group">
          <label>Is Plan Owner 1 a signatory?</label>
          <div className="inline-options">
            <label>
              <input type="radio" value="yes" {...register("includePO1")} />
              Yes
            </label>
            <label>
              <input type="radio" value="no" {...register("includePO1")} />
              No
            </label>
          </div>
        </div>

        {/* PLAN OWNER 2 SIGNATORY QUESTION */}
        {planOwner2 && (
          <div className="form-group">
            <label>Is Plan Owner 2 a signatory?</label>
            <div className="inline-options">
              <label>
                <input type="radio" value="yes" {...register("includePO2")} />
                Yes
              </label>
              <label>
                <input type="radio" value="no" {...register("includePO2")} />
                No
              </label>
            </div>
          </div>
        )}

        {/* SIGNATORY CARDS */}
        {signatoryFields.map((field, index) => (
          <SignatoryCard
            key={field.id}
            control={control}
            register={register}
            index={index}
            watch={watch}
          />
        ))}
      </div>
    );
  }
);

export default Chgaddr1_Signatories;
