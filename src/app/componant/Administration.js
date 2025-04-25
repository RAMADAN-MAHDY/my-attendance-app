"use client"

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AttendanceTable from '@/app/componant/AttendanceTable';
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const UserTable = ({ users, loading }) => {
  const [adminPass, setAdminPass] = useState(0);
  const [refreshFlag, setrefreshFlag] = useState(true);
  const [loadingStatuse, setLoading] = useState(true);
  const [AttendancStatus, setAttendancStatus] = useState();
  const [showUserTable, setShowUserTable] = useState(false);
  const [userDetails, setUserDetails] = useState({ userId: null, userName: null, userCode: null });
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
//   const [sortOrder, setSortOrder] = useState();

  // جلب الحضور
  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/router_IsUserPresentToday`);
        const data = await response.json();
        setAttendancStatus(data);
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceStatus();
  }, [refreshFlag]);

  // تسجيل حضور
  const handle_checkIn = async (id) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkIn/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      setrefreshFlag(!refreshFlag);
    } catch (error) {
      console.error("خطأ في تسجيل الحضور", error);
    }
  };

  const handleAdminClick = (userId, userName, userCode) => {
    setUserDetails({ userId, userName, userCode });
    setShowUserTable(true);
  };

  const normalizeText = (text) => String(text).toLowerCase().normalize("NFKD");

  const getAttendanceStatus = (userId) => {
    if (AttendancStatus) {
      const userAttendance = AttendancStatus.usersWithAttendance.find(item => item.userId === userId);
      return userAttendance ? "✅" : "❌";
    }
    return "";
  };
// البحث
  const handleSearch = (searchText) => {
    const normalizedSearchText = normalizeText(searchText);
    const filtered = users.filter(user => {
      const userName = normalizeText(user.names);
      const userCode = normalizeText(user.code);
      const attendanceStatus = getAttendanceStatus(user._id);
      return (
        userName.includes(normalizedSearchText) ||
        userCode.includes(normalizedSearchText) ||
        attendanceStatus.includes(normalizedSearchText)
      );
    });
    setFilteredUsers(filtered);
  };

  const filterPresentUsers = () => {
    const presentUsers = users.filter(user => getAttendanceStatus(user._id) === "✅");
    setFilteredUsers(presentUsers);
  };

  const showAllUsers = () => setFilteredUsers(users);

  // ترتيب الجدول
//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });

//     const sorted = [...filteredUsers].sort((a, b) => {
//       const aVal = key === 'names' ? a.names : getAttendanceStatus(a._id);
//       const bVal = key === 'names' ? b.names : getAttendanceStatus(b._id);
//       return direction === "asc"
//         ? String(aVal).localeCompare(String(bVal))
//         : String(bVal).localeCompare(String(aVal));
//     });

//     setFilteredUsers(sorted);
//   };
// const handleSort = (field) => {
//     const sorted = [...filteredUsers].sort((a, b) => {
//       const aVal = a[field]?.toString() || "";
//       const bVal = b[field]?.toString() || "";
  
//       return sortOrder === "asc"
//         ? aVal.localeCompare(bVal, ["ar", "en"], { sensitivity: "base" })
//         : bVal.localeCompare(aVal, ["ar", "en"], { sensitivity: "base" });
//     });
  
//     setFilteredUsers(sorted);
//     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//   };
  
  if (process.env.NEXT_PUBLIC_Pass_admin !== adminPass) {
    return (
      <div className="text-center mt-[30%] m-6 sm:ml-[30%] py-4 sm:w-[40%] flex-col justify-start items-center text-gray-500 bg-[#d7da8ea6] rounded-3xl">
        <h2>دخول بصلاحية الادمن (الادارة)</h2>
        <h2>يرجى إدخال كلمة المرور الصحيحة</h2>
        <input type="number" onChange={(e) => setAdminPass(e.target.value)} className='border-[#29ff94] bg-[#f5f7f5] text-[#000] pl-3' />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full p-4">
      {/* شريط البحث والأزرار */}
      <div className="flex items-center mb-4">
        <input type="text" placeholder="ابحث بالاسم أو الكود" value={searchText} onChange={(e) => {
          setSearchText(e.target.value);
          handleSearch(e.target.value);
        }} className="border rounded-l-md p-2" />
        <button onClick={filterPresentUsers} className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600">الحاضرين فقط</button>
        <button onClick={showAllUsers} className="bg-gray-500 text-white p-2 ml-2 rounded-r-md hover:bg-gray-600">عرض الكل</button>
        <h2 className="text-center p-2 ml-2 font-bold">{format(new Date(), "EEEE , dd/ MM / yyyy", { locale: ar })}</h2>
      </div>

      {/* الجدول */}
      <Table className="w-full border rounded-xl shadow-md">
        <TableHeader>
          <TableRow className="bg-gray-100 text-gray-700">
            <TableHead>#</TableHead>
            <TableHead >الاسم</TableHead>
            <TableHead>الموبايل</TableHead>
            <TableHead >حضور اليوم</TableHead>
            <TableHead>الكود</TableHead>
            <TableHead>تسجيل حضور</TableHead>
            <TableHead>عرض</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow><TableCell colSpan={5} className="text-center py-4 text-gray-500">جاري التحميل...</TableCell></TableRow>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <TableRow key={user._id} className="border-b hover:bg-gray-100">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.names}</TableCell>
                <TableCell>0{user.phone}</TableCell>
                <TableCell>{loadingStatuse ? "..." : getAttendanceStatus(user._id)}</TableCell>
                <TableCell>{user.code}</TableCell>
                <TableCell className="bg-[#5bf020a9] rounded-3xl hover:bg-[#ffffffa9] cursor-pointer w-11">
                  <button className="w-full h-full" onClick={() => handle_checkIn(user._id)}>حضر</button>
                </TableCell>
                <TableCell className="bg-[#2092f0a9] rounded-3xl hover:bg-[#ffffffa9] cursor-pointer w-11">
                  <button className="w-full h-full" onClick={() => handleAdminClick(user._id, user.names, user.code)}>السجل</button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={5} className="text-center py-4 text-gray-500">لا توجد بيانات</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      {/* السجل */}
      {showUserTable && (
        <section className="fixed justify-center top-[70px] bottom-0 right-0 left-0 bg-[#fff]">
          <span className="absolute top-2 right-5 text-[#ff2d2d] p-2 rounded-full bg-[#eaff2e] font-bold cursor-pointer" onClick={() => {
            setShowUserTable(false);
            setUserDetails({ userId: null, userName: null, userCode: null });
          }}>X</span>

          <h1 className="text-center text-[#91914c] text-2xl">السجل</h1>
          <div>
            <h1 className="text-center text-black text-2xl">{userDetails.userCode}: الكود</h1>
            <h1 className="text-center text-black text-2xl" style={{ direction: "ltr" }}>{userDetails.userName} / الاسم</h1>
          </div>

          <AttendanceTable userId={userDetails.userId} />
        </section>
      )}
    </div>
  );
};

export default UserTable;