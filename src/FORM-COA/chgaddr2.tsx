import React, { 
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef
} from "react";

import { useForm, useFieldArray } from "react-hook-form";

import Card from "../components/coa/Card";
import { useExpandableCards } from "../components/coa/useExpandableCards";
import countries from "../countries.json";

/* ---------------------------------------------
   TYPES
--------------------------------------------- */
export type CompanyDetails = {
  companyName: string;

  registeredAddress1: string;
  registeredAddress2: string;
  registeredAddress3: string;
  registeredCity: string;
  registeredPostcode: string;
  registeredCountry: string;

  correspondenceAddress1: string;
  correspondenceAddress2: string;
  correspondenceAddress3: string;
  correspondenceCity: string;
  correspondencePostcode: string;
  correspondenceCountry: string;

  dateMoved: string;

  taxResidence: string;
  taxReference: string;
  noTaxRefReason: string;
  fatcaGiin: string;

  copyRegistered?: boolean;
};

export type Chgaddr2Values = {
  companies: CompanyDetails[];
};

type Props = {
  data: Chgaddr2Values | null;
  setData: (data: Chgaddr2Values) => void;
};

/* ---------------------------------------------
   EMPTY TEMPLATE
--------------------------------------------- */
const EMPTY_COMPANY: CompanyDetails = {
  companyName: "",

  registeredAddress1: "",
  registeredAddress2: "",
  registeredAddress3: "",
  registeredCity: "",
  registeredPostcode: "",
  registeredCountry: "",

  correspondenceAddress1: "",
  correspondenceAddress2: "",
  correspondenceAddress3: "",
  correspondenceCity: "",
  correspondencePostcode: "",
  correspondenceCountry: "",

  dateMoved: "",

  taxResidence: "",
  taxReference: "",
  noTaxRefReason: "",
  fatcaGiin: "",

  copyRegistered: false
};

/* ---------------------------------------------
   COMPONENT
--------------------------------------------- */
const Chgaddr2 = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    watch,
    setValue
  } = useForm<Chgaddr2Values>({
    defaultValues: data || { companies: [] },
    mode: "onChange"
  });

  /* ---------------------------------------------
     FIELD ARRAY
  --------------------------------------------- */
  const { fields, append, remove } = useFieldArray({
    control,
    name: "companies"
  });

  /* ---------------------------------------------
     EXPANDABLE CARDS
  --------------------------------------------- */
  const initialExpanded = data?.companies?.length
    ? data.companies.map(() => false)
    : [];

  const { expanded, toggleExpand, setExpanded } = useExpandableCards(
    fields.length,
    initialExpanded
  );

  /* ---------------------------------------------
     FIRST LOAD RESTORE
  --------------------------------------------- */
  const firstLoad = useRef(true);
  useEffect(() => {
    if (firstLoad.current) {
      const saved = localStorage.getItem("chgaddr_page2_company");
      if (saved) {
        reset(JSON.parse(saved));
      } else if (data) {
        reset(data);
      }
      firstLoad.current = false;
    }
  }, [data, reset]);

  /* ---------------------------------------------
     AUTO SAVE
  --------------------------------------------- */
  useEffect(() => {
    const subscription = watch((values) => {
      setData(values);
      localStorage.setItem("chgaddr_page2_company", JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [watch, setData]);

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
          localStorage.setItem("chgaddr_page2_company", JSON.stringify(values));
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
     ADD COMPANY
  --------------------------------------------- */
  const handleAddCompany = () => {
    append({ ...EMPTY_COMPANY });
    setExpanded((prev) => [...prev, true]);
  };

  /* ---------------------------------------------
     COPY REGISTERED → CORRESPONDENCE
  --------------------------------------------- */
  const handleCopyAddress = (index: number, checked: boolean) => {
    setValue(`companies.${index}.copyRegistered`, checked);

    if (!checked) return;

    const reg = getValues().companies[index];

    setValue(`companies.${index}.correspondenceAddress1`, reg.registeredAddress1);
    setValue(`companies.${index}.correspondenceAddress2`, reg.registeredAddress2);
    setValue(`companies.${index}.correspondenceAddress3`, reg.registeredAddress3);
    setValue(`companies.${index}.correspondenceCity`, reg.registeredCity);
    setValue(`companies.${index}.correspondencePostcode`, reg.registeredPostcode);
    setValue(`companies.${index}.correspondenceCountry`, reg.registeredCountry);
  };

  /* ---------------------------------------------
     RENDER
  --------------------------------------------- */
  return (
    <form>
      <h2>Company Details</h2>

      <p className="hint">
        Add company details only if a plan owner or trustee is a company.
      </p>

      {/* COMPANY CARDS */}
      {fields.map((field, index) => {
        const title =
          watch(`companies.${index}.companyName`) ||
          `Company ${index + 1}`;

        return (
          <Card
            key={field.id}
            index={index}
            title={title}
            expanded={expanded[index]}
            onToggle={() => toggleExpand(index)}
            onDelete={() => remove(index)}
          >
            {/* COMPANY NAME */}
            <div className="form-group">
              <label>Company name</label>
              <input
                className="large-input"
                {...register(`companies.${index}.companyName`)}
              />
            </div>

            {/* REGISTERED ADDRESS */}
            <h4>Registered Address</h4>

            <div className="form-group">
              <label>Address Line 1</label>
              <input
                className="large-input"
                {...register(`companies.${index}.registeredAddress1`)}
              />
            </div>

            <div className="form-group">
              <label>Address Line 2</label>
              <input
                className="large-input"
                {...register(`companies.${index}.registeredAddress2`)}
              />
            </div>

            <div className="form-group">
              <label>Address Line 3</label>
              <input
                className="large-input"
                {...register(`companies.${index}.registeredAddress3`)}
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                className="large-input"
                {...register(`companies.${index}.registeredCity`)}
              />
            </div>

            <div className="form-group">
              <label>Postcode</label>
              <input
                className="large-input"
                {...register(`companies.${index}.registeredPostcode`)}
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <select
                className="large-input"
                {...register(`companies.${index}.registeredCountry`)}
              >
                <option value="">Select</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* COPY TICK */}
            <div className="form-group inline-options">
              <label>
                <input
                  type="checkbox"
                  checked={watch(`companies.${index}.copyRegistered`) || false}
                  onChange={(e) =>
                    handleCopyAddress(index, e.target.checked)
                  }
                />
                Copy registered address to correspondence
              </label>
            </div>

            {/* CORRESPONDENCE ADDRESS */}
            <h4>Correspondence Address</h4>

            <div className="form-group">
              <label>Address Line 1</label>
              <input
                className="large-input"
                {...register(`companies.${index}.correspondenceAddress1`)}
              />
            </div>

            <div className="form-group">
              <label>Address Line 2</label>
              <input
                className="large-input"
                {...register(`companies.${index}.correspondenceAddress2`)}
              />
            </div>

            <div className="form-group">
              <label>Address Line 3</label>
              <input
                className="large-input"
                {...register(`companies.${index}.correspondenceAddress3`)}
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                className="large-input"
                {...register(`companies.${index}.correspondenceCity`)}
              />
            </div>

            <div className="form-group">
              <label>Postcode</label>
              <input
                className="large-input"
                {...register(`companies.${index}.correspondencePostcode`)}
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <select
                className="large-input"
                {...register(`companies.${index}.correspondenceCountry`)}
              >
                <option value="">Select</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* DATE MOVED */}
            <div className="form-group">
              <label>Date moved to new address</label>
              <input
                type="date"
                className="smallmed-input"
                {...register(`companies.${index}.dateMoved`)}
              />
            </div>

            {/* TAX RESIDENCE */}
            <div className="form-group">
              <label>Country of residence for tax purposes</label>
              <select
                className="smallmed-input"
                {...register(`companies.${index}.taxResidence`)}
              >
                <option value="">Select</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* TAX REF */}
            <div className="form-group">
              <label>Company tax reference number(s)</label>
              <input
                className="large-input"
                {...register(`companies.${index}.taxReference`)}
              />
            </div>

            <div className="form-group">
              <label>If no tax reference number, specify reason</label>
              <textarea
                className="large-input"
                rows={2}
                {...register(`companies.${index}.noTaxRefReason`)}
              />
            </div>

            {/* FATCA */}
            <div className="form-group">
              <label>FATCA GIIN (if applicable)</label>
              <input
                className="large-input"
                {...register(`companies.${index}.fatcaGiin`)}
              />
            </div>
          </Card>
        );
      })}

      {/* ADD BUTTON */}
      <button
        type="button"
        className="add-button"
        onClick={handleAddCompany}
      >
        + Add Company
      </button>
    </form>
  );
});

export default Chgaddr2;



