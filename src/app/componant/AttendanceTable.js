"use client"

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

const AttendanceTable = ({ userId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);  // حالة التحميل
  const [currentUrl, setCurrentUrl] = useState("");  // المسار الحالي يبدأ فارغًا

  // جلب السجلات
  const fetchRecords = async (id) => {
    if (!id) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/router_Record/${id}`);
      const data = await response.json();
      setRecords(data.getRecord);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    } finally {
      setLoading(false);
    }
  };

  // جلب البيانات بناءً على المسار
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.pathname);  // تحديث الـ URL فقط في المتصفح
    }
  }, []);  // يتم التحديث مرة واحدة بعد تحميل الصفحة

  useEffect(() => {
    if (currentUrl) {
      setLoading(true); // تبدأ التحميل
      const storedId = localStorage.getItem('id');
      if (currentUrl === "/Administration") {
        fetchRecords(userId);  // جلب بيانات الادمن
      } else {
        fetchRecords(storedId); // جلب بيانات المستخدم العادي
      }
    }
  }, [currentUrl, userId]);

  if (loading) {
    return <div className="text-center py-4 text-gray-500">جاري تحميل البيانات...</div>;
  }

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
              <TableRow key={record._id} className="border-b hover:bg-gray-50 transition-colors">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{format(new Date(record.checkIn), "yyyy-MM-dd / hh:mm a")}</TableCell>
               <TableCell>{record.checkOut ? format(new Date(record.checkOut), "yyyy-MM-dd / hh:mm a") : "لم يسجل خروج"}</TableCell>

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
