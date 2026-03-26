import React, { 
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef
} from "react";

import { useForm, useFieldArray } from "react-hook-form";
import countries from "../countries.json";
import Card from "../components/coa/Card";
import { useExpandableCards } from "../components/coa/useExpandableCards";

export type PepEntry = { 
  surname: string;
  forenames: string;
  companyName: string;
  positionHeld: string;
  country: string;
  dateFrom: string;
  dateTo: string;
  relationship: string;
};

export type Chgaddr3Values = {
  peps: PepEntry[];
};

type Props = {
  data: Chgaddr3Values | null;
  setData: (data: Chgaddr3Values) => void;
};

const Chgaddr3 = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    watch
  } = useForm<Chgaddr3Values>({
    defaultValues: data || { peps: [] },
    mode: "onChange"
  });

  // -----------------------------
  // FIELD ARRAY FOR PEP CARDS
  // -----------------------------
  const { fields, append, remove } = useFieldArray({
    control,
    name: "peps"
  });

  // -----------------------------
  // EXPANDABLE CARD STATE
  // -----------------------------
  const initialExpanded = data?.peps?.length
    ? data.peps.map(() => false)
    : [];

  const { expanded, toggleExpand, setExpanded } = useExpandableCards(
    fields.length,
    initialExpanded
  );

  // -----------------------------
  // FIRST LOAD: RESTORE FROM LOCALSTORAGE
  // -----------------------------
  const firstLoad = useRef(true);
  useEffect(() => {
    if (firstLoad.current) {
      const saved = localStorage.getItem("chgaddr_page3_peps");
      if (saved) {
        reset(JSON.parse(saved));
      } else if (data) {
        reset(data);
      }
      firstLoad.current = false;
    }
  }, [data, reset]);

  // -----------------------------
  // AUTO SAVE TO LOCALSTORAGE
  // -----------------------------
  useEffect(() => {
    const subscription = watch((values) => {
      setData(values);
      localStorage.setItem("chgaddr_page3_peps", JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [watch, setData]);

  // -----------------------------
  // SUBMIT / GET VALUES
  // -----------------------------
  useImperativeHandle(ref, () => ({
    submit: async () => {
      let valid = false;

      await handleSubmit(
        (values) => {
          valid = true;
          setData(values);
          localStorage.setItem("chgaddr_page3_peps", JSON.stringify(values));
        },
        () => {
          valid = false;
        }
      )();

      return valid ? getValues() : null;
    },
    getValues
  }));

  // -----------------------------
  // ADD NEW PEP CARD
  // -----------------------------
  const handleAddPep = () => {
    append({
      surname: "",
      forenames: "",
      companyName: "",
      positionHeld: "",
      country: "",
      dateFrom: "",
      dateTo: "",
      relationship: ""
    });
    setExpanded((prev) => [...prev, true]);
  };

  return (
    <form>
      <h2>Politically Exposed Persons (PEPs)</h2>

      <p className="notice-box">
        A Politically Exposed Person (PEP) is someone who is, or has been,
        entrusted with prominent public functions. This includes their close
        family members and close associates.
      </p>

      <p className="hint">
        Add all individuals who meet the PEP definition, including family
        members and close associates.
      </p>

      {/* ============================= */}
      {/* PEP CARDS                     */}
      {/* ============================= */}
      {fields.map((field, index) => {
        const title =
          watch(`peps.${index}.surname`) ||
          watch(`peps.${index}.forenames`) ||
          `PEP ${index + 1}`;

        return (
          <Card
            key={field.id}
            index={index}
            title={title}
            expanded={expanded[index]}
            onToggle={() => toggleExpand(index)}
            onDelete={() => remove(index)}
          >
            <div className="form-group">
              <label>Surname</label>
              <input
                className="large-input"
                {...register(`peps.${index}.surname`)}
              />
            </div>

            <div className="form-group">
              <label>Forename(s)</label>
              <input
                className="large-input"
                {...register(`peps.${index}.forenames`)}
              />
            </div>

            <div className="form-group">
              <label>Company name</label>
              <input
                className="large-input"
                {...register(`peps.${index}.companyName`)}
              />
            </div>

            <div className="form-group">
              <label>Position held as PEP</label>
              <input
                className="large-input"
                {...register(`peps.${index}.positionHeld`)}
              />
            </div>

<div className="form-group">
  <label>Country position held</label>
  <select
    className="large-input"
    {...register(`peps.${index}.country`)}
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
              <label>Date position held (From)</label>
              <input
                type="date"
                className="smallmed-input"
                {...register(`peps.${index}.dateFrom`)}
              />
            </div>

            <div className="form-group">
              <label>Date position held (To)</label>
              <input
                type="date"
                className="smallmed-input"
                {...register(`peps.${index}.dateTo`)}
              />
            </div>

            <div className="form-group">
              <label>
                If the PEP is a family member or close associate, confirm the
                relationship
              </label>
              <input
                className="large-input"
                {...register(`peps.${index}.relationship`)}
              />
            </div>
          </Card>
        );
      })}

      {/* ADD BUTTON */}
      <button
        type="button"
        className="add-button"
        onClick={handleAddPep}
      >
        + Add PEP
      </button>
    </form>
  );
});

export default Chgaddr3;