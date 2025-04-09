"use client"
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AttendanceTable from '@/app/componant/AttendanceTable'

const UserTable = ({ users, loading }) => {

  const [showUserTable, setShowUserTable] = useState(false);
  const [userDetails, setUserDetails] = useState({
    userId: null,
    userName: null,
    userCode: null,
  });

  const handleAdminClick = (userId, userName, userCode) => {
    setUserDetails({ userId, userName, userCode });
    setShowUserTable(true);
  }

  return (
    <div className="overflow-x-auto w-full p-4">
      <Table className="w-full border rounded-xl shadow-md">
        <TableHeader>
          <TableRow className="bg-gray-100 text-gray-700">
            <TableHead>#</TableHead>
            <TableHead>الاسم</TableHead>
            <TableHead>الكود</TableHead>
            <TableHead>عرض</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                جاري التحميل...
              </TableCell>
            </TableRow>
          ) : users.length > 0 ? (
            users.map((user, index) => (
              <TableRow key={user._id} className="border-b hover:bg-gray-100">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.names}</TableCell>
                <TableCell>{user.code}</TableCell>
                <TableCell className="bg-[#2092f0a9] rounded-3xl hover:bg-[#ffffffa9] cursor-pointer w-11">
                  <button className="w-full h-full" onClick={() => handleAdminClick(user._id, user.names, user.code)}>
                    السجل
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                لا توجد بيانات
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {showUserTable && (
        <section className="fixed justify-center top-[70px] bottom-0 right-0 left-0 bg-[#fff]">
          <span className="absolute top-2 right-5 text-[#ff2d2d] font-bold cursor-pointer" onClick={() => {
            setShowUserTable(false);
            setUserDetails({ userId: null, userName: null, userCode: null });
          }}>X</span>
          <h1 className="text-center text-[#91914c] text-2xl">السجل</h1>

          <div>
            <h1 className="text-center text-black text-2xl">{userDetails.userCode}: الكود</h1>
            <h1 className="text-center text-black text-2xl" style={{ direction: "ltr" }}>
              <span>   </span>{userDetails.userName} / الاسم
            </h1>
          </div>

          <AttendanceTable userId={userDetails.userId} />
        </section>
      )}
    </div>
  );
};

export default UserTable;
