"use client";
// import { useRouter } from 'next/router';
import { useState } from 'react';
import cookie from 'cookie';

function LoginForm({ onSignInSuccess, onSignUp }) {
    // const router = useRouter();

    const [names, setEmail] = useState( '');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [go, setGo] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const URL= process.env.NEXT_PUBLIC_API_URL

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ names, password, code }),
            });
            const data = await response.json();

            if (data.message === 'Login successful') {
                localStorage.setItem('codeattendance', code);
                localStorage.setItem('id', data.id);
                localStorage.setItem('emailattendance', names);

                document.cookie = cookie.serialize('accessToken', data.accessToken, { path: '/' });
            document.cookie = cookie.serialize('refreshToken', data.refreshToken, { path: '/' });

                setGo(true);
                onSignInSuccess(names, code);
                setEmail('');
                setCode('');
                setPassword('')
                setErrorMessage('')
                window.location.href = '/';
            } else {
                setErrorMessage(data.message || 'خطأ في التسجيل');
            }
        } catch (error) {
            setErrorMessage('خطأ في التسجيل');
            console.error('There was a problem with your fetch operation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-[#06f8a8] drop-shadow-2xl rounded-3xl px-8 pt-6 pb-8 mb-4">
            <h2 className='text-[24px] font-bold text-center dark:text-[#000]'>تسجيل الدخول</h2>
            <div className="mb-4">
                <label htmlFor="email" className={`block ${go ? "text-[#449029]" : "text-gray-700"} text-sm font-bold mb-2`}> اسم المستخدم</label>
                <input
                    type="text"
                    id="email"
                    value={names}
                    onChange={handleEmailChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2"> كلمة المرور </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="code" className={`block ${go ? "text-[#449029]" : "text-gray-700"} text-sm font-bold mb-2`}> الكود</label>
                <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={handleCodeChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errorMessage && <p className='text-red-800 shadow'>{errorMessage}</p>}
            </div>
            <div className="flex items-center justify-between">
                {isLoading ? (
                    <p className="text-gray-700 font-bold">جاري تسجيل الدخول...</p>
                ) : !go ? (

                    <button type="submit" className={`${go ? "bg-green-500" : "bg-blue-500"} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}>
                 
                  تسجيل الدخول
                    </button>
                ) :
                (

                    <button type="submit" className={`${go ? "bg-green-500" : "bg-blue-500"} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}>
                        
                     تم تسجيل الدخول</button>

                )
                
                
                
                }

                <button type='button' onClick={() => onSignUp()} className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}> إنشاء حساب</button>
            </div>
        </form>
    );
}

export default LoginForm;
