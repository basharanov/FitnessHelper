import { date, object, string } from "yup";

export const LoginSchema = object({
  email: string()
    .min(3, "Username must be at least 3 characters")
    .email("must be a valid email")
    .required("Username is required"),
  password: string()
    .min(5, "Password must be at least 5 characters")
    .required("Password is required"),
});

export const RegisterSchema = object({
  email: string()
    .email("must be a valid email")
    .required("Username is required"),
  password: string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  birthDate: date().required("Birth date is required"),
  username: string()
    .min(2, "Username must be at least 2 characters")
    .required("Username is required"),
  height: string().required("Height is required"),
  currentWeight: string().required("Current weight is required"),
  goalWeight: string().required("Goal weight is required"),
});
