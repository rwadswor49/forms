import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
  useState
} from "react";
import { useForm } from "react-hook-form";
import isEqual from "lodash.isequal";
import countries from "../countries.json";

/* ---------------------------------------------
   TYPES
--------------------------------------------- */
export type PlanOwner = {
  firstName?: string;
  lastName?: string;
  alias?: string;

  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  postcode?: string;
  country?: string;

  dialCode?: string;
  telephone?: string;
  email?: string;

  employmentStatus?: string;
  employmentRole?: string;
  occupation?: string;
  natureOfBusiness?: string;

  referenceCode?: string;
};

export type PlanOwnersPageValues = {
  planNumber?: string;
  owners: PlanOwner[];
};

type Props = {
  data: PlanOwnersPageValues;
  setData: (data: PlanOwnersPageValues) => void;
};

/* ---------------------------------------------
   OPTIONS
--------------------------------------------- */
const employmentStatusOptions = [
  "Employed",
  "Self Employed",
  "Retired",
  "Unemployed",
  "Homemaker"
];

const employmentRoleOptions = [
  "Employee",
  "Business Owner",
  "Director",
  "Sole Trader"
];

/* ---------------------------------------------
   COMPONENT
--------------------------------------------- */
const Chgaddr1 = forwardRef<any, Props>(({ data, setData }, ref) => {
  const {
    register,
    trigger,
    getValues,
    reset,
    watch,
    setValue
  } = useForm<PlanOwnersPageValues>({
    defaultValues: {
      planNumber: "",
      owners: [{}],
      ...(data || {})
    },
    mode: "onBlur"
  });

  const [ownerType, setOwnerType] = useState<"single" | "joint" | undefined>();
  const prevValuesRef = useRef(data);

  // FIRST LOAD RESET
  const isFirstLoad = useRef(true);
  useEffect(() => {
    if (isFirstLoad.current) {
      const saved = localStorage.getItem("chgaddr_page1");
      if (saved) {
        reset(JSON.parse(saved));
      } else {
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
      if (!isEqual(prevValuesRef.current, values)) {
        prevValuesRef.current = values;
        setData(values);
        localStorage.setItem("chgaddr_page1", JSON.stringify(values));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setData]);

  /* ---------------------------------------------
     OWNER TYPE
  --------------------------------------------- */
  const handleOwnerTypeChange = (type: "single" | "joint") => {
    setOwnerType(type);

    const owners = getValues("owners") || [];

    if (type === "single") {
      setValue("owners", [owners[0] || {}]);
    }

    if (type === "joint") {
      const newOwners = [...owners];
      if (newOwners.length < 2) newOwners.push({});
      setValue("owners", newOwners);
    }
  };

  const displayedOwners =
    getValues("owners")?.slice(
      0,
      ownerType === "single" ? 1 : ownerType === "joint" ? 2 : 0
    ) || [];

  /* ---------------------------------------------
     SUBMIT + EXPOSE TO PARENT
  --------------------------------------------- */
  useImperativeHandle(ref, () => ({
    submit: async () => {
      const valid = await trigger();
      if (!valid) return null;

      const values = getValues();
      setData(values);
      localStorage.setItem("chgaddr_page1", JSON.stringify(values));
      return values;
    },
    getValues
  }));

  /* ---------------------------------------------
     UI
  --------------------------------------------- */
  return (


    <form>
      <h2>Plan Owner Details</h2>

      {/* PLAN NUMBER */}
      <div className="form-group">
        <label>Plan Number</label>
        <input {...register("planNumber")} className="large-input" />
      </div>

      {/* TYPE */}
      <div className="form-group">
        <label>Single or Joint Plan?</label>
        <div className="inline-options">
          <label>
            <input
              type="radio"
              checked={ownerType === "single"}
              onChange={() => handleOwnerTypeChange("single")}
            />
            Single
          </label>
          <label>
            <input
              type="radio"
              checked={ownerType === "joint"}
              onChange={() => handleOwnerTypeChange("joint")}
            />
            Joint
          </label>
        </div>
      </div>

      {/* OWNERS */}
      {displayedOwners.map((_, index) => (
        <div key={index} className="form-section">
          <h3>Plan Owner {index + 1}</h3>

          {/* NAME */}
          <div className="form-group">
            <label>First Name</label>
            <input
              {...register(`owners.${index}.firstName`)}
              className="large-input"
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              {...register(`owners.${index}.lastName`)}
              className="large-input"
            />
          </div>

          <div className="form-group">
            <label>Alias</label>
            <input {...register(`owners.${index}.alias`)} className="large-input" />
          </div>

          {/* ADDRESS */}
          <h4>Address</h4>
          <div className="form-group">
            <label>Address Line 1</label>
            <input {...register(`owners.${index}.address1`)} />
          </div>
          <div className="form-group">
            <label>Address Line 2</label>
            <input {...register(`owners.${index}.address2`)} />
          </div>
          <div className="form-group">
            <label>Address Line 3</label>
            <input {...register(`owners.${index}.address3`)} />
          </div>
          <div className="form-group">
            <label>City</label>
            <input {...register(`owners.${index}.city`)} />
          </div>
          <div className="form-group">
            <label>Postcode</label>
            <input {...register(`owners.${index}.postcode`)} />
          </div>
          <div className="form-group">
            <label>Country</label>
            <select {...register(`owners.${index}.country`)}>
              <option value="">Select</option>
              {countries.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* CONTACT */}
          <h4>Contact</h4>
          <div className="form-group">
            <label>Dial Code</label>
            <select {...register(`owners.${index}.dialCode`)}>
              <option value="">Select</option>
              {countries.map((c) => (
                <option key={c.code} value={c.dialCode}>
                  {c.name} {c.dialCode}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Telephone</label>
            <input {...register(`owners.${index}.telephone`)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" {...register(`owners.${index}.email`)} />
          </div>

          {/* EMPLOYMENT */}
          <h4>Employment</h4>
          <div className="form-group">
            <label>Status</label>
            <select {...register(`owners.${index}.employmentStatus`)}>
              <option value="">Select</option>
              {employmentStatusOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Role</label>
            <select {...register(`owners.${index}.employmentRole`)}>
              <option value="">Select</option>
              {employmentRoleOptions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Occupation</label>
            <input {...register(`owners.${index}.occupation`)} />
          </div>
          <div className="form-group">
            <label>Nature of Business</label>
            <input {...register(`owners.${index}.natureOfBusiness`)} />
          </div>

          {/* REFERENCE */}
          <div className="form-group">
            <label>Reference Code</label>
            <input {...register(`owners.${index}.referenceCode`)} />
          </div>
        </div>
      ))}
    </form>
  );
});

export default Chgaddr1;