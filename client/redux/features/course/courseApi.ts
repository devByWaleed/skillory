import { apiSlice } from "../api/apiSlice"


export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builders) => ({
        createCourse: builders.mutation({
            query: (data) => ({
                url: "course/create-course",
                method: "POST",
                body: data,
                credentials: "include" as const
            })
        }),
        getAllCourses: builders.query({
            query: () => ({
                url: "course/get-admin-courses",
                method: "GET",
                credentials: "include" as const
            })
        }),
        deleteCourses: builders.mutation({
            query: (id) => ({
                url: `course/delete-course/${id}`,
                method: "DELETE",
                credentials: "include" as const
            })
        }),
        editCourse: builders.mutation({
            query: ({ id, data }) => ({
                url: `course/update-course/${id}`,
                method: "PUT",
                body: data,
                credentials: "include" as const
            })
        }),
    })
})

export const { useCreateCourseMutation, useGetAllCoursesQuery, useDeleteCoursesMutation, useEditCourseMutation } = courseApi;