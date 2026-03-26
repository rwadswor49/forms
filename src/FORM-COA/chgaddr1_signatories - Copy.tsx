import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef
} from "react";

import { useForm, useFieldArray } from "react-hook-form";
import countries from "../countries.json";
import Card from "../components/COA/Card";


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

export type Page2Values = {
  numberOfSignatories: number;
  includePO1: string;
  includePO2: string;
  signatories: Signatory[];
};

type PlanOwnerData = {
  fullName?: string;
  countryOfBirth?: string;
};

type Props = {
  data: Page2Values | null;
  setData: (data: Page2Values) => void;
  planOwner1?: PlanOwnerData | null;
  planOwner2?: PlanOwnerData | null;
};

/* ---------------------------------------------
   SIGNATORY CARD
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

const [expandedStates, setExpandedStates] = useState(
  fields.map(() => true)
);

useEffect(() => {
  setExpandedStates(fields.map(() => true));
}, [fields]);

<h4>Tax Residency</h4>

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

{fields.map((tr, trIndex) => (
  <Card
    key={tr.id}
    title={`Tax Residency #${trIndex + 1}`}
    expanded={expandedStates[trIndex]}
    onToggle={() =>
      setExpandedStates((prev) => {
        const copy = [...prev];
        copy[trIndex] = !copy[trIndex];
        return copy;
      })
    }
    onDelete={() => remove(trIndex)}
  >
    <div className="form-group">
      <label>Country of Tax Residence</label>
      <select
        className="large-input"
        {...register(
          `signatories.${index}.taxResidencies.${trIndex}.country`
        )}
      >
        <option value="">Select</option>
        {countries.map((c) => (
          <option key={c.code} value={c.name}>
            {c.name} ({c.code})
          </option>
        ))}
      </select>
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


      {fields.map((tr, trIndex) => (
        <Card
          key={tr.id}
          title={`Tax Residency #${trIndex + 1}`}
          expanded={true}
          onDelete={() => remove(trIndex)}
        >
          <div className="form-group">
            <label>Country of Tax Residence</label>
            <select
              className="large-input"
              {...register(
                `signatories.${index}.taxResidencies.${trIndex}.country`
              )}
            >
              <option value="">Select</option>
              {countries.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
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
    </Card>
  );
};

/* ---------------------------------------------
   MAIN COMPONENT
--------------------------------------------- */
const Chgaddr1_Signatories = forwardRef<any, Props>(
  ({ data, setData, planOwner1, planOwner2 }, ref) => {
    const isFirstLoad = useRef(true);

    const {
      register,
      control,
      watch,
      reset,
      getValues,
      setValue
    } = useForm<Page2Values>({
      defaultValues: data || {
        numberOfSignatories: 1,
        includePO1: "no",
        includePO2: "no",
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
    const includePO1 = watch("includePO1");
    const includePO2 = watch("includePO2");

    const { fields: signatoryFields, append, remove } = useFieldArray({
      control,
      name: "signatories"
    });

    /* ---------------------------------------------
       RESTORE FROM LOCAL STORAGE
    --------------------------------------------- */
    useEffect(() => {
      if (isFirstLoad.current) {
        const saved = localStorage.getItem("chgaddr_page2");
        if (saved) {
          reset(JSON.parse(saved));
        } else if (data) {
          reset(data);
        }
        isFirstLoad.current = false;
      }
    }, [data, reset]);

    /* ---------------------------------------------
       AUTO SAVE
    --------------------------------------------- */
    useEffect(() => {
      const subscription = watch((values) => {
        setData(values);
        localStorage.setItem("chgaddr_page2", JSON.stringify(values));
      });
      return () => subscription.unsubscribe();
    }, [watch, setData]);

    /* ---------------------------------------------
       ENSURE SIGNATORIES ARRAY LENGTH
    --------------------------------------------- */
    useEffect(() => {
      const ownerCount =
        (includePO1 === "yes" ? 1 : 0) +
        (includePO2 === "yes" && planOwner2 ? 1 : 0);

      const desiredLength = Math.max(
        Number(numberOfSignatories),
        ownerCount
      );

      const currentLength = signatoryFields.length;

      if (currentLength < desiredLength) {
        for (let i = currentLength; i < desiredLength; i++) {
          append({
            fullName: "",
            countryOfBirth: "",
            usSpecifiedPerson: "no",
            taxResidencies: []
          });
        }
      } else if (currentLength > desiredLength) {
        for (let i = currentLength - 1; i >= desiredLength; i--) {
          remove(i);
        }
      }
    }, [
      numberOfSignatories,
      includePO1,
      includePO2,
      planOwner2,
      append,
      remove,
      signatoryFields.length
    ]);

    /* ---------------------------------------------
       SYNC PLAN OWNER DATA INTO SIGNATORIES
    --------------------------------------------- */

const prevValuesRef = useRef({
  po1Full: "",
  po1Country: "",
  po2Full: "",
  po2Country: ""
});

useEffect(() => {
  if (!signatoryFields.length) return;

  /* -----------------------------
     PLAN OWNER 1
  ----------------------------- */
  if (includePO1 === "yes" && planOwner1) {
    const full = planOwner1.fullName || "";
    const country = planOwner1.countryOfBirth || "";

    const changed =
      prevValuesRef.current.po1Full !== full ||
      prevValuesRef.current.po1Country !== country;

    if (changed) {
      setValue("signatories.0.fullName", full);
      setValue("signatories.0.countryOfBirth", country);
      setValue("signatories.0.isPlanOwner1", true);

      prevValuesRef.current.po1Full = full;
      prevValuesRef.current.po1Country = country;
    }
  }

  if (includePO1 === "no") {
    setValue("signatories.0.fullName", "");
    setValue("signatories.0.countryOfBirth", "");
    setValue("signatories.0.isPlanOwner1", false);

    prevValuesRef.current.po1Full = "";
    prevValuesRef.current.po1Country = "";
  }

  /* -----------------------------
     PLAN OWNER 2
  ----------------------------- */
  if (planOwner2 && signatoryFields.length > 1) {
    if (includePO2 === "yes") {
      const full = planOwner2.fullName || "";
      const country = planOwner2.countryOfBirth || "";

      const changed =
        prevValuesRef.current.po2Full !== full ||
        prevValuesRef.current.po2Country !== country;

      if (changed) {
        setValue("signatories.1.fullName", full);
        setValue("signatories.1.countryOfBirth", country);
        setValue("signatories.1.isPlanOwner2", true);

        prevValuesRef.current.po2Full = full;
        prevValuesRef.current.po2Country = country;
      }
    }

    if (includePO2 === "no") {
      setValue("signatories.1.fullName", "");
      setValue("signatories.1.countryOfBirth", "");
      setValue("signatories.1.isPlanOwner2", false);

      prevValuesRef.current.po2Full = "";
      prevValuesRef.current.po2Country = "";
    }
  }
}, [
  includePO1,
  includePO2,
  planOwner1?.fullName,
  planOwner1?.countryOfBirth,
  planOwner2?.fullName,
  planOwner2?.countryOfBirth,
  signatoryFields.length,
  setValue
]);



    /* ---------------------------------------------
       SUBMIT HANDLER
    --------------------------------------------- */
    useImperativeHandle(ref, () => ({
      submit: async () => getValues(),
      getValues
    }));

    /* ---------------------------------------------
       RENDER
    --------------------------------------------- */
    return (
      <div>
        <h2>Signatories Setup</h2>

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

        {/* PLAN OWNER 1 */}
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

        {/* PLAN OWNER 2 — ONLY IF EXISTS */}
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
