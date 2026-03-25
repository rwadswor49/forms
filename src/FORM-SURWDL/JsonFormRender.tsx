import { useForm } from "react-hook-form"

export default function JsonFormRenderer({ schema, onSubmit }: any) {

  const { register, handleSubmit } = useForm()

  return (

    <form onSubmit={handleSubmit(onSubmit)}>

      {schema.fields?.map((field:any) => (

        <div key={field.name}>

          <label>{field.label}</label>

          <input
            type={field.type}
            {...register(field.name)}
          />

        </div>

      ))}

      <button type="submit">
        Submit
      </button>

    </form>
  )
}