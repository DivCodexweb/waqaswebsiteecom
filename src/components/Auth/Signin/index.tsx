"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";
import { signIn, getSession } from "next-auth/react";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error || !res?.ok) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      // Session Fetching
      const session = await getSession();
      const userRole = (session?.user as any)?.role;

      // Local state clean karein login se pehle
      setEmail("");
      setPassword("");

      // Hard Refresh navigation taake fresh cookies update hon
      if (userRole === "admin") {
        window.location.replace("/admin");
      } else {
        window.location.replace("/");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Signin"} pages={["Signin"]} />
      <section className="overflow-hidden py-20 bg-gray-2 text-black">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Sign In to Your Account
              </h2>
              <p className="text-gray-600">Enter your detail below</p>
            </div>

            {error && (
              <div className="mb-4 text-red-500 text-center font-medium">
                {error}
              </div>
            )}

            <div>
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5 font-medium text-black">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 text-black outline-none focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5 font-medium text-black">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 text-black outline-none focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5"
                >
                  {loading ? "Signing in..." : "Sign in to account"}
                </button>

                <p className="text-center mt-6 text-gray-700">
                  Don&apos;t have an account?
                  <Link href="/signup" className="text-dark font-bold hover:text-blue pl-2">
                    Sign Up Now!
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;