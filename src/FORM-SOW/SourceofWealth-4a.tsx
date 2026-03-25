import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import Card from "../components/sow/Card";
import { useExpandableCards } from "../components/sow/useExpandableCards";
import { useAutoSave } from "../components/sow/useAutoSave";

import countries from "../countries.json";

export type PropertyEntry = {
  propertyPurchasePrice: string;
  propertyCurrentValue: string;
  propertyPurchaseDate: string;
  propertyOwned: "yes" | "no" | "";
  propertySalePrice: string;
  propertySaleDate: string;
  propertySaleFundsLocation: string;
  propertyAddressLine1: string;
  propertyCity: string;
  propertyRegion: string;
  propertyPostalCode: string;
  propertyCountry: string;
};

export type PropertyFormValues = {
  properties: PropertyEntry[];
};

type Props = {
  data: PropertyFormValues | null;
  setData: (data: PropertyFormValues) => void;
};

const PropertyForm = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    watch
  } = useForm<PropertyFormValues>({
    defaultValues: data || { properties: [] },
    mode: "onChange"
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "properties"
  });

  // -----------------------------
  // INITIAL EXPANDED STATE
  // -----------------------------
  const initialExpanded = data?.properties?.length
    ? data.properties.map(() => false)
    : [true]; // auto-expand first row if no data

  const { expanded, toggleExpand, setExpanded } = useExpandableCards(fields.length, initialExpanded);

  // -----------------------------
  // FIRST LOAD: ensure at least 1 row
  // -----------------------------
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      if (!data?.properties || data.properties.length === 0) {
        append({
          propertyPurchasePrice: "",
          propertyCurrentValue: "",
          propertyPurchaseDate: "",
          propertyOwned: "",
          propertySalePrice: "",
          propertySaleDate: "",
          propertySaleFundsLocation: "",
          propertyAddressLine1: "",
          propertyCity: "",
          propertyRegion: "",
          propertyPostalCode: "",
          propertyCountry: ""
        });
      } else {
        reset(data);
      }
      firstLoad.current = false;
    }
  }, [data, append, reset]);

  // -----------------------------
  // AUTO SAVE
  // -----------------------------
  useEffect(() => {
    const subscription = watch((values) => {
      setData(values);
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
      <h2>Property</h2>

      {fields.map((field, index) => {
        const owned = watch(`properties.${index}.propertyOwned`);

        const title =
          watch(`properties.${index}.propertyAddressLine1`) ||
          watch(`properties.${index}.propertyCity`) ||
          watch(`properties.${index}.propertyPurchasePrice`) ||
          "Property Entry";

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
              <label>What did you pay for the property?</label>
              <input
                type="number"
                className="smallmed-input"
                {...register(`properties.${index}.propertyPurchasePrice`)}
              />
            </div>

            <div className="form-group">
              <label>What is the current value of the property?</label>
              <input
                type="number"
                className="smallmed-input"
                {...register(`properties.${index}.propertyCurrentValue`)}
              />
            </div>

            <div className="form-group">
              <label>When did you buy the property? (MM/YYYY)</label>
              <input
                type="month"
                className="smallmed-input"
                {...register(`properties.${index}.propertyPurchaseDate`)}
              />
            </div>

            <h4 className="section-title">Ownership</h4>

            <div className="form-group">
              <label>Do you still own the property?</label>
              <div className="inline-options">
                <label>
                  <input
                    type="radio"
                    value="yes"
                    {...register(`properties.${index}.propertyOwned`)}
                    checked={owned === "yes"}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    value="no"
                    {...register(`properties.${index}.propertyOwned`)}
                    checked={owned === "no"}
                  />
                  No
                </label>
              </div>
            </div>

            {owned === "no" && (
              <>
                <div className="form-group">
                  <label>If sold – What did you sell it for?</label>
                  <input
                    className="large-input"
                    {...register(`properties.${index}.propertySalePrice`)}
                  />
                </div>

                <div className="form-group">
                  <label>When did you sell it? (MM/YYYY)</label>
                  <input
                    type="month"
                    className="smallmed-input"
                    {...register(`properties.${index}.propertySaleDate`)}
                  />
                </div>

                <div className="form-group">
                  <label>Where has the money been held since selling the property?</label>
                  <input
                    className="large-input"
                    {...register(`properties.${index}.propertySaleFundsLocation`)}
                  />
                </div>
              </>
            )}

            <h4 className="section-title">Property Address</h4>

            <div className="form-group">
              <label>Address line 1</label>
              <input
                className="large-input"
                {...register(`properties.${index}.propertyAddressLine1`)}
              />
            </div>

            <div className="form-group">
              <label>Town or city</label>
              <input
                className="large-input"
                {...register(`properties.${index}.propertyCity`)}
              />
            </div>

            <div className="form-group">
              <label>State, province or region</label>
              <input
                className="large-input"
                {...register(`properties.${index}.propertyRegion`)}
              />
            </div>

            <div className="form-group">
              <label>Postal code or ZIP code</label>
              <input
                className="large-input"
                {...register(`properties.${index}.propertyPostalCode`)}
              />
            </div>

            <div className="form-group">
              <label>Country or region</label>
              <select
                className="large-input"
                {...register(`properties.${index}.propertyCountry`)}
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
            propertyPurchasePrice: "",
            propertyCurrentValue: "",
            propertyPurchaseDate: "",
            propertyOwned: "",
            propertySalePrice: "",
            propertySaleDate: "",
            propertySaleFundsLocation: "",
            propertyAddressLine1: "",
            propertyCity: "",
            propertyRegion: "",
            propertyPostalCode: "",
            propertyCountry: ""
          })
        }
      >
        + Add another property
      </button>
    </form>
  );
});

export default PropertyForm;