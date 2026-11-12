"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import AddressModal from "./AddressModal";
import Orders from "../Orders";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [addressModal, setAddressModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Live User State (Database ke columns: name, email, phone)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Password change form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Live User Data Fetch karna jab page load ho
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (res.ok && data.success) {
          setUserData({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
          });
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const openAddressModal = () => setAddressModal(true);
  const closeAddressModal = () => setAddressModal(false);

  // Handle Profile Update (Name / Phone update in DB)
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateProfile",
          name: userData.name,
          phone: userData.phone,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Profile updated successfully in database! 🎉");
      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  // Handle Password Change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "changePassword",
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Password changed successfully! 🔒");
        setPasswordData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      } else {
        alert(data.message || "Failed to change password.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-lg font-medium text-dark">
        Loading account details...
      </div>
    );
  }

  return (
    <>
      <Breadcrumb title={"My Account"} pages={["my account"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5">
            {/* <!--== user dashboard menu start ==--> */}
            <div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-1">
              <div className="flex xl:flex-col">
                <div className="hidden lg:flex flex-wrap items-center gap-5 py-6 px-4 sm:px-7.5 xl:px-9 border-r xl:border-r-0 xl:border-b border-gray-3">
                  <div className="max-w-[64px] w-full h-16 rounded-full overflow-hidden">
                    <Image
                      src="/images/users/user-04.png"
                      alt="user"
                      width={64}
                      height={64}
                    />
                  </div>

                  <div>
                    <p className="font-medium text-dark mb-0.5">
                      {userData.name || "User"}
                    </p>
                    <p className="text-custom-xs">{userData.email}</p>
                  </div>
                </div>

                <div className="p-4 sm:p-7.5 xl:p-9">
                  <div className="flex flex-wrap xl:flex-nowrap xl:flex-col gap-4">
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white cursor-pointer ${
                        activeTab === "dashboard"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white cursor-pointer ${
                        activeTab === "orders"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      Orders
                    </button>

                    <button
                      onClick={() => setActiveTab("account-details")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white cursor-pointer ${
                        activeTab === "account-details"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      Account Details
                    </button>

                    <button
                      onClick={() => {
                        window.location.href = "/signin";
                      }}
                      className="flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 text-dark-2 bg-gray-1 hover:bg-red-500 hover:text-white cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* <!--== user dashboard menu end ==--> */}

            {/* <!--== user dashboard content start ==--> */}
            <div className="w-full">
              
              {/* 1. Dashboard Tab */}
              <div
                className={`bg-white rounded-xl shadow-1 py-9.5 px-4 sm:px-7.5 xl:px-10 ${
                  activeTab === "dashboard" ? "block" : "hidden"
                }`}
              >
                <p className="text-dark">
                  Hello <strong className="text-blue">{userData.name}</strong> (not {userData.name}?{" "}
                  <a
                    href="/signin"
                    className="text-red ease-out duration-200 hover:underline"
                  >
                    Log Out
                  </a>
                  )
                </p>

                <p className="text-custom-sm mt-4 text-gray-600">
                  From your account dashboard you can view your recent orders,
                  manage your profile details, and securely change your password.
                </p>
              </div>

              {/* 2. Orders Tab */}
              <div
                className={`bg-white rounded-xl shadow-1 ${
                  activeTab === "orders" ? "block" : "hidden"
                }`}
              >
                <Orders />
              </div>

              {/* 3. Account Details Tab */}
              <div
                className={`${
                  activeTab === "account-details" ? "block" : "hidden"
                }`}
              >
                <form onSubmit={handleProfileUpdate} className="mb-8">
                  <div className="bg-white shadow-1 rounded-xl p-4 sm:p-8.5">
                    <h3 className="font-medium text-xl text-dark mb-5">Account Details</h3>
                    
                    <div className="mb-5">
                      <label htmlFor="name" className="block mb-2.5 font-medium text-dark">
                        Full Name <span className="text-red">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={userData.name}
                        onChange={(e) =>
                          setUserData({ ...userData, name: e.target.value })
                        }
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/25 text-dark"
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="email" className="block mb-2.5 font-medium text-dark">
                        Email Address <span className="text-gray-400 text-xs">(Cannot be changed)</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        disabled
                        value={userData.email}
                        className="rounded-md border border-gray-3 bg-gray-2 text-gray-500 w-full py-2.5 px-5 outline-none cursor-not-allowed"
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="phone" className="block mb-2.5 font-medium text-dark">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={userData.phone || ""}
                        onChange={(e) =>
                          setUserData({ ...userData, phone: e.target.value })
                        }
                        placeholder="+923001234567"
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/25 text-dark"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark cursor-pointer shadow-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>

                {/* Password Change Form */}
                <form onSubmit={handlePasswordChange}>
                  <p className="font-medium text-xl sm:text-2xl text-dark mb-5">
                    Password Change
                  </p>

                  <div className="bg-white shadow-1 rounded-xl p-4 sm:p-8.5">
                    <div className="mb-5">
                      <label htmlFor="oldPassword" className="block mb-2.5 font-medium text-dark">
                        Old Password
                      </label>
                      <input
                        type="password"
                        id="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, oldPassword: e.target.value })
                        }
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/25 text-dark"
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="newPassword" className="block mb-2.5 font-medium text-dark">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/25 text-dark"
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="confirmNewPassword" className="block mb-2.5 font-medium text-dark">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmNewPassword"
                        value={passwordData.confirmNewPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
                        }
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/25 text-dark"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-files font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark cursor-pointer shadow-md"
                    >
                      Change Password
                    </button>
                  </div>
                </form>
              </div>

            </div>
            {/* <!--== user dashboard content end ==--> */}

          </div>
        </div>
      </section>

      <AddressModal isOpen={addressModal} closeModal={closeAddressModal} />
    </>
  );
};

export default MyAccount;