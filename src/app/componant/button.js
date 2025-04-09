'use client'
import Link from "next/link";
import {useState ,useEffect} from "react";

export default function Buttons() {
    const URL= process.env.NEXT_PUBLIC_API_URL

    const [code, setValueCode] = useState();
    const [name, setValueName] = useState();
    const [id, setValue_id] = useState();
    const [present, setpresent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        if (typeof window !== 'undefined') {  
            setValueCode(localStorage.getItem('codeattendance'));
            setValueName(localStorage.getItem('emailattendance'));
            setValue_id(localStorage.getItem('id'));
            console.log(code);
        }
    }, []);
    
    console.log(id);
    console.log(present);
    const handle_checkIn = async () => {
        if(!id){
            alert('يرجى تسجيل الدخول');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${URL}/checkIn/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

                alert(data);
                setpresent(true);
           
        } catch (error) {
            setErrorMessage('خطأ في التسجيل');
            console.error('There was a problem with your fetch operation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handle_checkOut = async () => { 
        setIsLoading(true);
        try {
            const response = await fetch(`${URL}/checkOut/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

        
                alert(data);

            

            setpresent(false);
        } catch (error) {
            setErrorMessage('خطأ في التسجيل');
            console.error('There was a problem with your fetch operation:', error);
        } finally {
            setIsLoading(false);
        }
    };


  return (

<>
{!code ? <Link href="/login_signin" className=" bg-[#07ff07ab] p-3 rounded-3xl hover:text-[#000] hover:bg-[#e0f3e0] hover:font-semibold mt-6">  
    تسجيل دخول 
    </Link>
    :
    <div  className="mt-6 bg-[#e6dbae9a] p-3 rounded-2xl text-[#000] font-semibold">
    <p  className=" bg-[#f1f0ebda] p-3 "> {name} : الاسم</p>
    <p  className=" bg-[#f8f5e9] p-3 "> {code} : الكود</p>
    </div>
    }


{code && 

<div className="flex gap-11 mt-11 bg-[#f0f8f0f8] p-11 md:p-[88px] rounded-3xl">
 <button  className="bg-[#ff0202]  p-5 rounded-3xl hover:bg-[#ff3d02a4]" onClick=  {handle_checkOut}>
  انصراف
</button> 
 <button  className="bg-[#2bff00] dark:text-[#0f0f0f] p-5 rounded-3xl hover:bg-[#ebeb0bd5] " onClick= {handle_checkIn}>
  حضور
</button>  
</div>

}
 
{code && <button onClick={()=>{
    localStorage.removeItem('codeattendance');
    localStorage.removeItem('emailattendance');
    localStorage.removeItem('id');
    window.location.href = '/';
}} className="bg-[#f00] dark:text-[#0f0f0f] p-3 rounded-3xl hover:bg-[#eb0b0bd5]  ">
    تسجيل خروج
    </button>}

  </>
  );
}
