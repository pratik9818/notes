import { ChangeEvent, useState, MouseEvent, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { islogin } from "../store/notes";
const AuthForm = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [errormodal, setErrormodal] = useState({
    error: false,
    errorstate: "",
  });
  const [usercrenditials, setUsercrenditials] = useState({
    email: "",
    password: "",
  });
  const setTokeninfo = useSetRecoilState(islogin)
 
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };
  function crenditials(e: ChangeEvent<HTMLInputElement>) {
    const names = e.target.name;
    const values = e.target.value;
    setUsercrenditials({
      ...usercrenditials,
      [names]: values,
    });
  }

  useEffect(() => {
    if (errormodal.error) {
      setTimeout(() => {
        setErrormodal({
          error: false,
          errorstate: "",
        });
      }, 4000);
    }
  }, [errormodal]);
  const  senduserreq = (e: MouseEvent<HTMLButtonElement>)=> {
    e.preventDefault();
    if (isSignUp) {
      try {
        signup();
      } catch (error) {
        setErrormodal({
          error: true,
          errorstate: "something went wrong please try again",
        });
      }
    } else {
      try {
        signin();
      } catch (error) {
        setErrormodal({
          error: true,
          errorstate: "something went wrong please try again",
        });
      }
    }
  }
  async function signin() {
    localStorage.removeItem("token");
    const queryParams = new URLSearchParams({
      email: usercrenditials.email,
      password: usercrenditials.password,
    }).toString();
    const result = await fetch(
      `http://localhost:3001/api/signin?${queryParams}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const res = await result.json();
    console.log(res);

    if (res.error) {
      setErrormodal({
        error: true,
        errorstate: res.message,
      });
    } else {
      setTokeninfo({
        islogin:true,
        reason:'user signin',
        message:'user sign again'
      })
      localStorage.setItem("token", res.token);
      localStorage.setItem("email", res.useremail);

      navigate("/app");
    }
  }
  async function signup() {
    const formData = new URLSearchParams();
    formData.append("email", usercrenditials.email);
    formData.append("password", usercrenditials.password);
    const result = await fetch(`http://localhost:3001/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });
    const res = await result.json();
    console.log(res);

    if (res.error) {
      setErrormodal({
        error: true,
        errorstate: res.message,
      });
    } else {
      setTokeninfo({
        islogin:false,
        reason:'user signup',
        message:'user is new'
      })
        localStorage.setItem("token", res.token);
        localStorage.setItem("email", res.useremail);
        navigate("/app");
      }
  }
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm m-auto my-14">
      {errormodal.error ? (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
          <p className="font-semibold">Error:{errormodal.errorstate}</p>
        </div>
      ) : (
        ""
      )}
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {isSignUp ? "SIGN UP FOR AN ACCOUNT" : "SIGN IN TO YOUR ACCOUNT"}
      </h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            onChange={(e) => crenditials(e)}
            type="email"
            name="email"
            className="mt-1 w-full px-4 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            onChange={(e) => crenditials(e)}
            type="password"
            name="password"
            className="mt-1 w-full px-4 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Password"
          />
        </div>
        <div className="flex items-center mb-3">
          <div className="text-gray-700 text-sm">
            password should be minimum 10 words
          </div>
        </div>
        <button
          onClick={senduserreq}
          className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition duration-300"
        >
          {isSignUp ? "SIGN UP" : "SIGN IN"}
        </button>
        <p className="mt-4 text-center text-gray-600">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-purple-500 hover:underline"
                onClick={toggleAuthMode}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                className="text-purple-500 hover:underline"
                onClick={toggleAuthMode}
              >
                Sign Up
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
