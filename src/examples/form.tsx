import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { createGStore } from "../../lib";
import "./examples.css";

// Define form input types
type Inputs = {
  example: string;
  exampleRequired: string;
};

// Create a global state from the form hook
const useGForm = createGStore(() => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    (data) => console.log(data),
    []
  );

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
});

// Main form component using global state
export function GlobalForm() {
  const { handleSubmit, onSubmit } = useGForm();
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <FormInput
            id="example"
            label="Example Field"
            placeholder="Enter some text"
          />
        </div>
        <div className="form-field">
          <FormInputRequired
            id="exampleRequired"
            label="Required Field"
            placeholder="This field is required"
          />
        </div>
        <FormErrors />
        <div className="form-field">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

// Form input component with label
export function FormInput({
  id,
  label,
  placeholder,
}: {
  id: "example" | "exampleRequired";
  label: string;
  placeholder: string;
}) {
  const { register } = useGForm();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input defaultValue="test" {...register(id)} placeholder={placeholder} />
    </div>
  );
}

// Form input component with validation
export function FormInputRequired({
  id,
  label,
  placeholder,
}: {
  id: "example" | "exampleRequired";
  label: string;
  placeholder: string;
}) {
  const { register, errors } = useGForm();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input {...register(id, { required: true })} placeholder={placeholder} />
      {errors[id] && (
        <span className="error-message">This field is required</span>
      )}
    </div>
  );
}

// Component to display form errors
export function FormErrors() {
  const { errors } = useGForm();

  if (!errors.example && !errors.exampleRequired) return null;

  return (
    <div className="form-errors">
      {errors.example && <p>Example field has errors</p>}
      {errors.exampleRequired && <p>Required field has errors</p>}
    </div>
  );
}
