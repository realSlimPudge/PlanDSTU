import * as yup from "yup";

export const loginSchema = yup.object().shape({
  login: yup.string().required("Пожалуйсте введите логин").min(3),
  password: yup
    .string()
    .min(8, "Пароль должен состоять хотя бы из 8 символов")
    .required("Пожалуйста введите пароль"),
});

export const registerSchema = yup.object().shape({
  group: yup.string().required("Группа обязательна"),
  login: yup.string().required("Логин обязателен").min(3).max(50),
  password: yup
    .string()
    .min(8, "Пароль должен состоять хотя бы из 8 символов")
    .max(50)
    .required("Пароль обязателен"),
});
