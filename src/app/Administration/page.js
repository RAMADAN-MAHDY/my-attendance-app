
import UserTable from '../componant/Administration.js';

const Administration = async () => {
  let getUser = [];
  let loading = true;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getUser`, {
      cache: 'no-store', // لضمان أن البيانات تُجلب في كل طلب (SSR)
    });
    const data = await response.json();
    // console.log(data);

    getUser = data.getUser || [];
  } catch (error) {
    console.error('Error fetching attendance records:', error);
  } finally {
    loading = false;
  } 


  return (
    
    <>
      <h1 className='font-bold ml-[30%]'> بسم الله الرحمن الرحيم</h1>
      <UserTable users={getUser} loading={loading} />
    </>
  );
};

export default Administration;