import { useRef, useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useToast from "../../hook/toast/toast";
import { useTitle } from "../../hook/title/title";
import { Login } from "./type/login";
import { useCookies } from "react-cookie";
import Yup from "../../yupConfig";
import "./auth.scss";
import { AuthService } from "../../service/auth";

function Auth() {
  const { showToast } = useToast();
  const [cookies, setCookie] = useCookies(['ACCESS_TOKEN']);
  
  useTitle("login");
  const schema = Yup.object().shape({
    username: Yup.string().required().label("username"),
    password: Yup.string().required().label("password"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data: Login) => {
    const result = await AuthService.login(data.username, data.password)
    if(result.status == 200) {
      showToast("Login successfully", 'success');
      setCookie('ACCESS_TOKEN', '123')
    }
    else{
      console.log(result)
    }
  };

  const title = <h3 className="text-center">Sign in</h3>;
  const form = (
    <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
      <section className="p-inputgroup flex-1 input">
        <span className="p-inputgroup-addon">
          <i className="pi pi-user"></i>
        </span>
        <InputText
          {...register("username")}
          className="shadow-none"
          placeholder="Username"
        />
      </section>
      <small>{errors.username?.message}</small>
      <section className="p-inputgroup flex-1 input mt-3">
        <span className="p-inputgroup-addon">
          <i className="pi pi-lock"></i>
        </span>
        <InputText
          {...register("password")}
          className="shadow-none"
          placeholder="Password"
        />
      </section>
      <small>{errors.password?.message}</small>
      <Button className="button mt-3 shadow-none" label="Login" />
    </form>
  );

  return (
    <section className="auth-admin-page">
      <Card header={title} className="auth-admin-page-card">
        {form}
      </Card>
    </section>
  );
}

export default Auth;