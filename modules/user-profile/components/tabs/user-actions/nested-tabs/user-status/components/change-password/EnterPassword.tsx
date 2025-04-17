"use client";
import EyeIcon from "@/public/icons/eye-icon";
import EyeOffIcon from "@/public/icons/eye-off-icon";
import { useState } from "react";

export default function EnterPassword() {
  // declare and define component state and variables
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (value: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!regex.test(value)) {
      return "لابد أن تتكون كلمة المرور من 8 حروف حيث تحتوي علي.حرف كبير.حرف صغير.رمز";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setError(validatePassword(value));
  };

  return (
    <div className="flex flex-col">
      {/* advice */}
      <div className="flex flex-col gap-1 p-3 bg-[#121426]">
        <p className="text-primary font-semibold">
          تأكد من تلبية هذه المتطلبات:
        </p>
        <p className="text-primary text-sm font-thin">
          أن تكون كلمة المرور بطول 8 أحرف على الأقل، حرف كبير واحد على الأقل،
          استخدام رمز خاص واحد على الأقل.
        </p>
      </div>
      {/* password field */}
      <div className="w-full flex flex-col gap-2">
        <label htmlFor="password" className="font-medium text-sm text-gray-700">
          كلمة المرور
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handleChange}
            className={`w-full px-4 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
              error
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {error && (
          <div>
            {error.split(".")?.map((message) => (
              <p key={message} className="text-sm text-red-500">
                {message}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
