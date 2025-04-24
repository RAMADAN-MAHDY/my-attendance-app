'use client'
import React, { useState } from 'react';

const SignUpComponent = ({ onSignin }) => {
  // كائن يحتوي على جميع الحقول
  const [formData, setFormData] = useState({
    fullName: '',
    code: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('تأكيد انشاء الحساب');
  const URL = process.env.NEXT_PUBLIC_API_URL;

  // دالة التحقق من المدخلات
  const validateInputs = () => {
    const { fullName, code, phone, password, confirmPassword } = formData;
    
    if (!fullName || !code || !phone || !password || !confirmPassword) {
      return 'يرجى ملء جميع الحقول';
    }

    if (password.length < 6) {
      return 'كلمة السر يجب أن تكون أكثر من 6 أرقام أو أحرف';
    }

    if (password !== confirmPassword) {
      return 'كلمة السر غير متطابقة';
    }

    const phoneRegex = /^[0-9]{10,12}$/; // تحقق من صحة رقم الهاتف
    if (!phoneRegex.test(phone)) {
      return 'رقم الهاتف غير صالح';
    }

    return null; // إذا كانت المدخلات صحيحة
  };

  // دالة إنشاء الحساب
  const handleSignUp = async (e) => {
    e.preventDefault();

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading("جاري إنشاء الحساب...");

    try {
      const response = await fetch(`${URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setLoading("تأكيد إنشاء الحساب");
        throw new Error('فشل في إنشاء الحساب');
      }

      // إعادة تعيين الحقول بعد نجاح التسجيل
      setFormData({
        fullName: '',
        code: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
      setError('');
      setLoading("تم إنشاء الحساب بنجاح");

      alert('تم إنشاء حسابك بنجاح');
    } catch (err) {
      console.error(err.message);
      setLoading("تأكيد إنشاء الحساب");
      setError('حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.');
    }
  };

  // دالة لتحديث الحقول في الكائن
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <form className="p-8 rounded-3xl bg-[#06f8a8] drop-shadow-2xl w-80 ml-[10%] lg:ml-[20%]">
      <h2 className="text-2xl font-bold mb-4 text-center">إنشاء حساب</h2>

      {/* حقل الاسم */}
      <input
        required
        type="text"
        name="fullName"
        placeholder="الاسم ثلاثي"
        value={formData.fullName}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mb-4 text-[#000]"
      />

      {/* حقل كلمة السر */}
      <input
        required
        type="password"
        name="password"
        placeholder="كلمة السر"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mb-4 text-[#000]"
      />

      {/* حقل تأكيد كلمة السر */}
      <input
        required
        type="password"
        name="confirmPassword"
        placeholder="تأكيد كلمة السر"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mb-4 text-[#000]"
      />

      {/* حقل الكود */}
      <input
        required
        type="number"
        name="code"
        placeholder="الكود"
        value={formData.code}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mb-4 text-[#000]"
      />

      {/* حقل رقم الهاتف */}
      <input
        required
        type="tel"
        name="phone"
        placeholder="رقم الهاتف"
        value={formData.phone}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mb-4 text-[#000]"
      />

      {/* زر تقديم النموذج */}
      <button
        onClick={handleSignUp}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        {loading}
      </button>

      {/* زر لتوجيه المستخدم إلى صفحة تسجيل الدخول */}
      <button
        onClick={() => onSignin()}
        className="w-full mt-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        تسجيل الدخول
      </button>

      {/* عرض الرسالة في حال وجود خطأ */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default SignUpComponent;
