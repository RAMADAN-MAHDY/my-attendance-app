// التصميم المحسّن للواجهة
'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { LogOut, Check, X } from "lucide-react";

export default function Buttons() {
  const URL = process.env.NEXT_PUBLIC_API_URL;

  const [code, setValueCode] = useState();
  const [name, setValueName] = useState();
  const [id, setValue_id] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setValueCode(localStorage.getItem("codeattendance"));
      setValueName(localStorage.getItem("emailattendance"));
      setValue_id(localStorage.getItem("id"));
    }
  }, []);

  const handle_checkIn = async () => {
    if (!id) {
      setMessage("يرجى تسجيل الدخول أولًا");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${URL}/checkIn/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setMessage(data);
    } catch (error) {
      setMessage("خطأ في تسجيل الحضور");
    } finally {
      setIsLoading(false);
    }
  };

  const handle_checkOut = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${URL}/checkOut/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setMessage(data);
    } catch (error) {
      setMessage("خطأ في تسجيل الانصراف");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("codeattendance");
    localStorage.removeItem("emailattendance");
    localStorage.removeItem("id");
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="text-xl md:text-2xl font-bold text-center text-[#111]">
        بسم الله الرحمن الرحيم
      </h1>

      {!code ? (
        <Link
          href="/login_signin"
          className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600"
        >
          تسجيل دخول
        </Link>
      ) : (
        <div className="bg-yellow-100 text-[#222] rounded-xl p-4 shadow-md">
          <p className="mb-1 font-semibold">الاسم: {name}</p>
          <p>الكود: {code}</p>
        </div>
      )}

      {code && (
        <div className="flex gap-4 mt-6 bg-gray-50 p-6 rounded-2xl shadow-inner">
          <button
            className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 flex items-center gap-2"
            onClick={handle_checkOut}
            disabled={isLoading}
          >
            <X size={20} />
            {isLoading ? "..." : "انصراف"}
          </button>

          <button
            className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 flex items-center gap-2"
            onClick={handle_checkIn}
            disabled={isLoading}
          >
            <Check size={20} />
            {isLoading ? "..." : "حضور"}
          </button>
        </div>
      )}

      {code && (
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 flex items-center gap-2"
        >
          <LogOut size={18} /> تسجيل خروج
        </button>
      )}

      {message && (
        <div className="mt-4 bg-blue-100 text-blue-700 px-4 py-2 rounded shadow">
          {message}
        </div>
      )}
    </div>
  );
}
