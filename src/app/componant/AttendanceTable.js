"use client"

import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { months } from "@/utils/months"; // استدعاء الشهور

const AttendanceTable = ({ userId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (currentUrl) {
      setLoading(true);
      const storedId = localStorage.getItem('id');
      if (currentUrl === "/Administration") {
        fetchRecords(userId);
      } else {
        fetchRecords(storedId);
      }
    }
  }, [currentUrl, userId]);

  const filteredRecords = records.filter(record => {
    const date = new Date(record.checkIn);
    const month = date.getMonth();
    const year = date.getFullYear();

    const monthMatch = selectedMonth === "all" || month === Number(selectedMonth);
    const yearMatch = selectedYear === "all" || year === Number(selectedYear);

    return monthMatch && yearMatch;
  });

  if (loading) {
    return <div className="text-center py-4 text-gray-500">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="overflow-x-auto w-full p-4">
      {/* الفلاتر */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
        <select
          className="border rounded px-3 py-1"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="all">كل الشهور</option>
          {months.map((month, idx) => (
            <option key={idx} value={month.value}>{month.name}</option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-1"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="all">كل السنوات</option>
          {[...new Set(records.map(r => new Date(r.checkIn).getFullYear()))].map((year, i) => (
            <option key={i} value={year}>{year}</option>
          ))}
        </select>

        <button
          onClick={() => {
            setSelectedMonth("all");
            setSelectedYear("all");
          }}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          عرض الكل
        </button>
      </div>

      {/* الجدول */}
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
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record, index) => (
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
