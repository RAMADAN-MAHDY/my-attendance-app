"use client"
import { Amiri , Scheherazade_New ,Cairo , El_Messiri ,Lateef ,Markazi_Text ,Mirza , Tajawal ,Vazirmatn , Reem_Kufi ,Harmattan , Alkalami} from 'next/font/google';

import LoginForm from '@/app/componant/login';
import SignUpComponent from '@/app/componant/sinUp';
// import Navebar from "@/app/componant/navbar";
import { useState,useEffect } from 'react';

// import io from 'socket.io-client';

const amiri = Alkalami   ({
    weight: ['400'],
    subsets: ['arabic'],
  });


export default function Home() {
    const [userEmail, setUserEmail] = useState( typeof window !== 'undefined' ?localStorage.getItem('emailorderaffilate') || '' : '');
    const [usercode, setUsercode] = useState( typeof window !== 'undefined' ?localStorage.getItem('codeorderaffilate') || '':'');
    const handleSignInSuccess = (email,code) => {
        setUserEmail(email);
        setUsercode(code);
      };
      const [showsignup , setshowsignup] = useState(false)// shwo sign up     and   shwo sign in

      const handleShowSignUp = ()=>{
        setshowsignup(!showsignup)
    }


      const removeNumbers = (str) => {
        return str.replace(/\d/g, '');
    }
      console.log(userEmail)
      console.log(usercode)
      const [showChild, setShowChild] = useState(false)

      useEffect(() => {
        setShowChild(true)
      }, [])

      
  if (!showChild) {
    return null
  }
  
  return (

    <main className="flex min-h-screen flex-col items-center mt-24">
     
    {/* <Navebar/> */}

      {/* <dev className='flex justify-between '>
         <div className="mb-3 self-center border border-gray-400 rounded-lg p-4 group hover:bg-white bg-gradient-to-br from-red-500 to-blue-500 via-green-500">

<span className="bg-clip-text bg-gradient-to-br from-red-500 to-blue-500 via-green-500 text-[#fff] hover:text-white animate-pulse">
  El mahdy
</span>
</div>

  
  </dev> */}
    
      {/* <img src="/WhatsApp Image 2024-07-11 at 21.01.51_df437c70.jpg" alt='image' className='w-[154px] rounded-full m-3 justify-end'/> */}
      

        
         {!showsignup? <LoginForm onSignInSuccess={handleSignInSuccess} onSignUp={handleShowSignUp} />  : <SignUpComponent onSignin={handleShowSignUp}/> }
         
      
      
    </main>
  );
}
