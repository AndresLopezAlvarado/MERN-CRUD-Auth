import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signIn, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    signIn(data);
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/tasks");
  }, [isAuthenticated]);

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
        {loginErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white text-center my-2" key={i}>
            {error}
          </div>
        ))}
        <h1 className="text-3xl font-bold my-2">Login</h1>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500">Email is required</p>}
          <input
            type="password"
            {...register("password", { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-500">Password is required</p>
          )}
          <button
            type="submit"
            className="bg-sky-500 text-white px-4 py-2 rounded-md my-2"
          >
            Login
          </button>
        </form>
        <p className="flex gap-x-2 justify-between">
          Don't have an account?{" "}
          <Link to="/register" className="text-sky-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
