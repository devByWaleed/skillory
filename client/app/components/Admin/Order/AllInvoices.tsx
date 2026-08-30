"use client";

import React, { FC, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useTheme } from "next-themes";
import { AiOutlineMail } from "react-icons/ai";
import { Search } from "lucide-react";
import { useGetAllCoursesQuery } from "@/redux/features/course/courseApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useGetOrdersDataQuery } from "@/redux/features/orders/orderApi";


type Props = {
    isDashboard?: boolean;
};

const AllInvoices: FC<Props> = ({ isDashboard }) => {
    const { theme } = useTheme();
    const [search, setSearch] = useState("");

    const { isLoading, data } = useGetOrdersDataQuery({});
    const { data: usersData } = useGetAllUsersQuery({});
    const { data: coursesData } = useGetAllCoursesQuery({});

    const [orderData, setOrderData] = useState<any[]>([]);

    useEffect(() => {
        if (data && usersData && coursesData) {
            const temp = data.allOrders.map((item: any) => {
                const user = usersData?.allUsers?.find(
                    (u: any) => u._id === item.userId
                );
                const course = coursesData?.allCourses?.find(
                    (c: any) => c._id === item.courseId
                );

                return {
                    id: item._id,
                    userName: user?.name || "N/A",
                    userEmail: user?.email || "N/A",
                    title: course?.name || "N/A",
                    price: "$ " + (course?.price || item.payment_info?.amount || 0),
                    created_at: format(item.createdAt),
                };
            });
            setOrderData(temp);
        }
    }, [data, usersData, coursesData]);

    const columns = [
        ...(isDashboard ? [] : [{ field: "id", headerName: "ID", flex: 0.5, minWidth: 100 }]),
        { field: "userName", headerName: "Name", flex: 0.8, minWidth: 140 },
        ...(isDashboard ? [] : [{ field: "userEmail", headerName: "Email", flex: 1, minWidth: 200 }]),
        { field: "title", headerName: "Course Title", flex: 1, minWidth: 160 },
        { field: "price", headerName: "Price", flex: 0.5, minWidth: 90 },
        ...(isDashboard
            ? []
            : [
                { field: "created_at", headerName: "Created At", flex: 0.5, minWidth: 130 },
                {
                    field: "send_email",
                    headerName: "Email",
                    flex: 0.3,
                    minWidth: 90,
                    sortable: false,
                    renderCell: (params: any) => (
                        <a
                            href={`mailto:${params.row.userEmail}`}
                            target="_blank"
                            aria-label="Email Customer"
                            className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors inline-flex items-center justify-center"
                        >
                            <AiOutlineMail size={19} />
                        </a>
                    ),
                },
            ]),
    ];

    const filteredRows = orderData.filter(
        (row) =>
            row.userName.toLowerCase().includes(search.toLowerCase()) ||
            row.userEmail.toLowerCase().includes(search.toLowerCase()) ||
            row.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={"w-full"}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                <h1 className="text-xl font-josefin font-bold text-brand-900 dark:text-white">
                    {isDashboard ? "Recent Invoices" : "All Invoices"}
                </h1>

                {!isDashboard && (
                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search invoice..."
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-surface-800 bg-white dark:bg-surface-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                        />
                    </div>
                )}
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        overflowX: "auto",
                        "& .MuiDataGrid-root": {
                            border: "none",
                            borderRadius: "1rem",
                            backgroundColor:
                                theme === "dark" ? "#1e293b !important" : "#ffffff !important",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor:
                                theme === "dark" ? "#334155 !important" : "#eef2ff !important",
                        },
                        "& .MuiDataGrid-columnHeader": {
                            backgroundColor:
                                theme === "dark" ? "#334155 !important" : "#eef2ff !important",
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                            color:
                                theme === "dark" ? "#f1f5f9 !important" : "#1e1b4b !important",
                            fontWeight: 600,
                        },
                        "& .MuiDataGrid-cell": {
                            color:
                                theme === "dark" ? "#e2e8f0 !important" : "#0f172a !important",
                        },
                        "& .MuiDataGrid-row": {
                            backgroundColor:
                                theme === "dark" ? "#1e293b !important" : "#ffffff !important",
                        },
                        "& .MuiDataGrid-row:hover": {
                            backgroundColor:
                                theme === "dark" ? "#475569 !important" : "#eef2ff !important",
                        },
                        "& .MuiDataGrid-footerContainer": {
                            backgroundColor:
                                theme === "dark" ? "#1e293b !important" : "#ffffff !important",
                            color:
                                theme === "dark" ? "#f1f5f9 !important" : "#0f172a !important",
                        },
                        "& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                        {
                            color:
                                theme === "dark"
                                    ? "#f1f5f9 !important"
                                    : "#0f172a !important",
                        },
                        "& .MuiTablePagination-select, & .MuiSelect-icon, & .MuiTablePagination-actions svg":
                        {
                            color:
                                theme === "dark"
                                    ? "#f1f5f9 !important"
                                    : "#0f172a !important",
                        },
                        "& .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton, & .MuiDataGrid-iconButtonContainer svg":
                        {
                            color:
                                theme === "dark"
                                    ? "#cbd5e1 !important"
                                    : "#64748b !important",
                        },
                        "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
                        {
                            outline: "none",
                        },
                        "& .MuiDataGrid-overlay": {
                            backgroundColor:
                                theme === "dark" ? "#1e293b !important" : "#ffffff !important",
                            color:
                                theme === "dark" ? "#f1f5f9 !important" : "#0f172a !important",
                        },
                    }}
                >
                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        autoHeight
                        disableRowSelectionOnClick
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: isDashboard ? 5 : 10 },
                            },
                        }}
                        pageSizeOptions={isDashboard ? [5, 10] : [10, 25, 50]}
                    />
                </Box>
            )}
        </div>
    );
};

export default AllInvoices;