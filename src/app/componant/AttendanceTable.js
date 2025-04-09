"use client"

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

const AttendanceTable = ({userId}) => {

// console.log("userId", userId.userId)
  const [records, setRecords] = useState([]);
  const [currentUrl, setcurrentUrl] = useState();
//   const [loading, setLoading] = useState(true); // حالة التحميل
//   const [error, setError] = useState(null); // حالة الخطأ
  const [getDataToAdmin, setgetDataToAdmin] = useState(false); // حالة إظهار الجدول
console.log("getDataToAdmin", getDataToAdmin)
  const fetchRecords = async (id) => {
    if (id) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/router_Record/${id}`);
        const data = await response.json();
        setRecords(data.getRecord);
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      }
    }
  };

// جلب البيانات للادمن
  useEffect(() => {
    const setValue_id = localStorage.getItem('id');

    setcurrentUrl(window.location.pathname); // الحصول على المسار الحالي

    console.log("Current URL:", currentUrl);

    if (currentUrl === "/Administration") {
        setgetDataToAdmin(true); 
        
        fetchRecords(userId); // جلب بيانات الادمن

    }else{
        fetchRecords(setValue_id);// جلب بيانات المستخدم العادي
    }


  }, [currentUrl ,getDataToAdmin]);



  return (
    <div className="overflow-x-auto w-full p-4">
      <Table className="w-full border rounded-xl shadow-md">
        <TableHeader>
          <TableRow className="bg-gray-100 text-gray-700">
            <TableHead>#</TableHead>
            <TableHead>تاريخ الحضور</TableHead>
            <TableHead>تاريخ الانصراف</TableHead>
            <TableHead>حضور</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length > 0 ? (
            records.map((record, index) => (
              <TableRow key={record._id} className="border-b">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{format(new Date(record.checkIn), "yyyy-MM-dd / HH:mm")}</TableCell>
                <TableCell>{record.checkOut ? format(new Date(record.checkOut), "yyyy-MM-dd / HH:mm") : "لم يسجل خروج"}</TableCell>
                <TableCell>{record.status === "Present" ? "✅" : "❌"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-gray-500">لا توجد سجلات</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;
