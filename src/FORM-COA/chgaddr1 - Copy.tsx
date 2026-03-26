import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef
} from "react";

import { useForm, useFieldArray } from "react-hook-form";

import Card from "../components/COA/Card";
import { useExpandableCards } from "../components/COA/useExpandableCards";
import { useAutoSave } from "../components/COA/useAutoSave";

/* ---------------------------------------------
   TYPES
--------------------------------------------- */
export type PlanOwner = {
  fullName: string;
  countryOfBirth: string;
};

export type PlanOwnersPageValues = {
  planNumber: string;
  owners: PlanOwner[];
};

type Props = {
  data: PlanOwnersPageValues | null;
  setData: (data: PlanOwnersPageValues) => void;
};

/* ---------------------------------------------
   COMPONENT
--------------------------------------------- */
const Chgaddr1 = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    watch
  } = useForm<PlanOwnersPageValues>({
    defaultValues: data || {
      planNumber: "",
      owners: []
    },
    mode: "onChange"
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "owners"
  });

  /* ---------------------------------------------
     EXPAND / COLLAPSE (THIS WAS MISSING ❌)
  --------------------------------------------- */
  const initialExpanded = fields.length ? fields.map(() => true) : [];

  const { expanded, toggleExpand, setExpanded } =
    useExpandableCards(fields.length, initialExpanded);

  /* ---------------------------------------------
     FIRST LOAD
  --------------------------------------------- */
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      if (!data?.owners || data.owners.length === 0) {
        append({
          fullName: "",
          countryOfBirth: ""
        });
        setExpanded([true]);
      } else {
        reset(data);
      }
      firstLoad.current = false;
    }
  }, [data, append, reset, setExpanded]);

  /* ---------------------------------------------
     AUTO SAVE
  --------------------------------------------- */
  useAutoSave(watch, setData);

  /* ---------------------------------------------
     SUBMIT
  --------------------------------------------- */
  useImperativeHandle(ref, () => ({
    submit: async () => {
      let valid = false;

      await handleSubmit(
        (values) => {
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

  /* ---------------------------------------------
     ADD OWNER
  --------------------------------------------- */
  const addOwner = () => {
    if (fields.length >= 2) return;

    append({
      fullName: "",
      countryOfBirth: ""
    });

    setExpanded((prev) => [...prev, true]); // ✅ auto expand new card
  };

  /* ---------------------------------------------
     RENDER
  --------------------------------------------- */
  return (
    <form>
      <h2>Plan Owner Details</h2>

      {/* PLAN NUMBER */}
      <div className="form-group">
        <label>Plan Number</label>
        <input
          className="large-input"
          {...register("planNumber")}
        />
      </div>

      {/* OWNER CARDS */}
      {fields.map((field, index) => (
        <Card
          key={field.id}
          index={index}
          title={index === 0 ? "Plan Owner 1" : "Plan Owner 2"}
          expanded={expanded[index]}
          onToggle={() => toggleExpand(index)}   // ✅ FIX
          onDelete={() => {
            remove(index);                       // ✅ FIX
            setExpanded((prev) => prev.filter((_, i) => i !== index));
          }}
        >
          <div className="form-group">
            <label>Full Name</label>
            <input
              className="large-input"
              {...register(`owners.${index}.fullName`)}
            />
          </div>

          <div className="form-group">
            <label>Country of Birth</label>
            <input
              className="large-input"
              {...register(`owners.${index}.countryOfBirth`)}
            />
          </div>
        </Card>
      ))}

      {/* ADD BUTTON */}
      {fields.length < 2 && (
        <button
          type="button"
          className="add-button"
          onClick={addOwner}
        >
          + Add Plan Owner
        </button>
      )}
    </form>
  );
});

export default Chgaddr1;