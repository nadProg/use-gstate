import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { createGState } from "../lib";

type Inputs = {
  example: string;
  exampleRequired: string;
};

export const useGForm = createGState(() => {
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

export function GlobalForm() {
  const { handleSubmit, onSubmit } = useGForm();
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput />

        <FormInputRequired />

        <input type="submit" />
      </form>
    </>
  );
}

export function FormInput() {
  const { register } = useGForm();
  return <input defaultValue="test" {...register("example")} />;
}

export function FormInputRequired() {
  const { register, errors } = useGForm();
  return (
    <>
      <input {...register("exampleRequired", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}
    </>
  );
}

export function FormErrors() {
  const { errors } = useGForm();
  return (
    <>
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}
    </>
  );
}
