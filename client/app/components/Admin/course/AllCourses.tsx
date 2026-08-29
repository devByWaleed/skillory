"use client"
import React, { FC, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { useTheme } from 'next-themes'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiEdit2 } from 'react-icons/fi'
import { Search } from 'lucide-react'
import { useDeleteCoursesMutation, useGetAllCoursesQuery } from '@/redux/features/course/courseApi'
import Loader from '../../Loader/Loader'
import { format } from "timeago.js"
import toast from 'react-hot-toast'
import ConfirmationModal from '@/app/utils/ConfirmationModal'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


type Props = {}

const AllCourses: FC<Props> = () => {
    const { theme } = useTheme();
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [courseId, setCourseId] = useState("");

    const router = useRouter();

    const { isLoading, data, refetch } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });

    const [deleteCourse, { isSuccess, error, }] = useDeleteCoursesMutation({})

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5, minWidth: 90 },
        { field: "title", headerName: "Course Title", flex: 1, minWidth: 200 },
        { field: "ratings", headerName: "Ratings", flex: 0.5, minWidth: 100 },
        { field: "purchased", headerName: "Purchased", flex: 0.5, minWidth: 110 },
        { field: "created_at", headerName: "Created At", flex: 0.5, minWidth: 130 },
        {
            field: "edit",
            headerName: "Edit",
            flex: 0.3,
            minWidth: 80,
            sortable: false,
            renderCell: (params: any) => (
                <button
                    onClick={() => router.push(`/admin/edit-course/${params.row.id}`)}
                    aria-label="Edit course"
                    className="p-1.5 rounded-lg text-brand-600 dark:text-accent-400 hover:bg-brand-50 dark:hover:bg-surface-700 transition-colors"
                >
                    <FiEdit2 size={17} />
                </button>
                // <Link
                //     href={`/admin/edit-course/${params.row.id}`}
                //     aria-label="Edit course"
                //     className="p-1.5 rounded-lg text-brand-600 dark:text-accent-400 hover:bg-brand-50 dark:hover:bg-surface-700 transition-colors"
                // >
                //     <FiEdit2 size={17} />
                // </Link>
            ),
        },
        {
            field: "delete",
            headerName: "Delete",
            flex: 0.3,
            minWidth: 80,
            sortable: false,
            renderCell: (params: any) => (
                <button
                    onClick={() => {
                        setOpen(!open);
                        setCourseId(params.row.id);
                    }}
                    aria-label="Delete course"
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                    <AiOutlineDelete size={19} />
                </button>
            ),
        },
    ];

    // Dummy data — replace with real course list once wired to the backend
    const rows: any = [];

    {
        data && data.allCourses.forEach((item: any) => {
            rows.push({
                id: item._id,
                title: item.name,
                ratings: item.ratings,
                purchased: item.purchased,
                created_at: format(item.createdAt),
            })
        })
    }

    const filteredRows = rows.filter((row: any) =>
        row.title.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success("Course Deleted Successfully!");
            setOpen(false);
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }


    }, [isSuccess, error])


    const handleDeleteCourse = async () => {
        const id = courseId;
        await deleteCourse(id);
    }

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                <h1 className="text-xl font-josefin font-bold text-brand-900 dark:text-white">
                    All courses
                </h1>

                <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-surface-800 bg-white dark:bg-surface-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                    />
                </div>
            </div>

            {
                isLoading ? (
                    <Loader />

                ) : (
                    <Box
                        sx={{
                            width: "100%",
                            overflowX: "auto",
                            "& .MuiDataGrid-root": {
                                border: "none",
                                borderRadius: "1rem",
                                backgroundColor: theme === "dark" ? "#1e293b !important" : "#ffffff !important",
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: theme === "dark" ? "#334155 !important" : "#eef2ff !important",
                            },
                            "& .MuiDataGrid-columnHeader": {
                                backgroundColor: theme === "dark" ? "#334155 !important" : "#eef2ff !important",
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                color: theme === "dark" ? "#f1f5f9 !important" : "#1e1b4b !important",
                                fontWeight: 600,
                            },
                            "& .MuiDataGrid-cell": {
                                color: theme === "dark" ? "#e2e8f0 !important" : "#0f172a !important",
                            },
                            "& .MuiDataGrid-row": {
                                backgroundColor: theme === "dark" ? "#1e293b !important" : "#ffffff !important",
                            },
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: theme === "dark" ? "#475569 !important" : "#eef2ff !important",
                            },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: theme === "dark" ? "#1e293b !important" : "#ffffff !important",
                                color: theme === "dark" ? "#f1f5f9 !important" : "#0f172a !important",
                            },
                            "& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                                color: theme === "dark" ? "#f1f5f9 !important" : "#0f172a !important",
                            },
                            "& .MuiTablePagination-select, & .MuiSelect-icon, & .MuiTablePagination-actions svg": {
                                color: theme === "dark" ? "#f1f5f9 !important" : "#0f172a !important",
                            },
                            "& .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton, & .MuiDataGrid-iconButtonContainer svg": {
                                color: theme === "dark" ? "#cbd5e1 !important" : "#64748b !important",
                            },
                            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
                                outline: "none",
                            },
                            "& .MuiDataGrid-overlay": {
                                backgroundColor: theme === "dark" ? "#1e293b !important" : "#ffffff !important",
                                color: theme === "dark" ? "#f1f5f9 !important" : "#0f172a !important",
                            },
                        }}
                    >
                        <DataGrid
                            rows={filteredRows}
                            columns={columns}
                            autoHeight
                            disableRowSelectionOnClick
                            initialState={{
                                pagination: { paginationModel: { pageSize: 10 } },
                            }}
                            pageSizeOptions={[10, 25, 50]}
                        />
                    </Box>
                )}

            <ConfirmationModal
                open={open}
                setOpen={setOpen}
                title="Delete this course?"
                message="This will permanently remove the course and all its content. This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                isLoading={isLoading}
                onConfirm={handleDeleteCourse}
            />
        </div>
    )
}

export default AllCourses