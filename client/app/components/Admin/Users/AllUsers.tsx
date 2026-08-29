"use client"
import React, { FC, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { useTheme } from 'next-themes'
import { AiOutlineDelete, AiOutlineMail } from 'react-icons/ai'
import { Search } from 'lucide-react'
import { useDeleteUserMutation, useGetAllUsersQuery } from '@/redux/features/user/userApi'
import Loader from '../../Loader/Loader'
import { format } from "timeago.js"
import AddMemberModal from '@/app/utils/AddMemberModal'
import ConfirmationModal from '@/app/utils/ConfirmationModal'
import toast from 'react-hot-toast'


type Props = {
    isTeam: boolean;
}

const AllUsers: FC<Props> = ({ isTeam }) => {
    const { theme } = useTheme();
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState("");
    const [openAddMember, setOpenAddMember] = useState(false);

    const { isLoading, data, refetch } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });

    const [deleteCourse, { isSuccess, error, }] = useDeleteUserMutation({})

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5, minWidth: 90 },
        { field: "name", headerName: "Name", flex: 1, minWidth: 200 },
        { field: "email", headerName: "Email", flex: 0.5, minWidth: 100 },
        { field: "role", headerName: "Role", flex: 0.5, minWidth: 110 },
        { field: "courses", headerName: "Purchased", flex: 0.5, minWidth: 130 },
        { field: "created_at", headerName: "Joined At", flex: 0.5, minWidth: 130 },

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
                        setUserId(params.row.id);
                    }}
                    aria-label="Delete user"
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                    <AiOutlineDelete size={19} />
                </button>
            ),
        },
        // Replace the old send_email column block:
        {
            field: "send_email",
            headerName: "Email",
            flex: 0.3,
            minWidth: 100,
            sortable: false,
            renderCell: (params: any) => (
                <a
                    href={`mailto:${params.row.email}`}
                    aria-label="Email"
                    className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors inline-flex items-center justify-center"
                >
                    <AiOutlineMail size={19} />
                </a>
            ),
        }
    ];

    // Dummy data — replace with real course list once wired to the backend
    const rows: any = [];

    if (isTeam) {
        const newData = data && data?.allUsers.filter((item: any) => item.role === "admin")
        newData && newData.forEach((item: any) => {
            rows.push({
                id: item._id,
                name: item.name,
                email: item.email,
                role: item.role,
                courses: item.courses.length,
                created_at: format(item.createdAt),
            })
        })
    } else {
        data && data.allUsers.forEach((item: any) => {
            rows.push({
                id: item._id,
                name: item.name,
                email: item.email,
                role: item.role,
                courses: item.courses.length,
                created_at: format(item.createdAt),
            })
        })
    }

    const filteredRows = rows.filter((row: any) =>
        row.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success("User Deleted Successfully!");
            setOpen(false);
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }


    }, [isSuccess, error])

    const handleDeleteUser = async () => {
        const id = userId;
        await deleteCourse(id);
    }

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                <h1 className="text-xl font-josefin font-bold text-brand-900 dark:text-white">
                    {isTeam ? "Team Members" : "All Users"}
                </h1>

                <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-surface-800 bg-white dark:bg-surface-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                    />
                </div>
                {isTeam && (
                    <button
                        onClick={() => setOpenAddMember(true)}
                        className="px-5 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                    >
                        Add new member
                    </button>
                )}
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
                title="Delete this user?"
                message="This will permanently remove the user and all its content. This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                isLoading={isLoading}
                onConfirm={handleDeleteUser}
            />
            {/* Render Modal Component Here */}
            <AddMemberModal
                open={openAddMember}
                setOpen={setOpenAddMember}
                refetch={refetch}
            />
        </div>
    )
}

export default AllUsers