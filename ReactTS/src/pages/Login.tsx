import { FC, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../components/Loading";

const Login: FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    let isMount = true;
    async function checkRefreshToken() {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:7000/users/refresh-token",
          {},
          { withCredentials: true }
        );
        if (response.status == 200) {
          auth?.setdetails({
            accessToken: response.data.accessToken,
            user: response.data.user,
          });

          setTimeout(() => {
            navigate("/task-management");
          }, 1500);
        }
        // console.log("Login successful:", response.data);
      } catch (error) {
        console.error("Error logging in:", error);
      } finally {
        setLoading(false);
      }
    }
    checkRefreshToken();
    return () => {
      isMount = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const email = formdata.get("email") as string;
    const password = formdata.get("password") as string;
    try {
      const response = await axios.post(
        "http://localhost:7000/users/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.status == 200) {
        console.log(response);
        auth?.setdetails({
          accessToken: response.data.accessToken,
          user: response.data.user,
        });

        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/task-management");
        }, 1500);
      }
      // console.log("Login successful:", response.data);
    } catch (error) {
      toast.error("Login Failed!");
      console.error("Error logging in:", error);
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <ToastContainer />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Name"
            src="./a-logo.webp"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Login to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Login
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a Registered?{" "}
            <Link
              to={"/register"}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
export default Login;
