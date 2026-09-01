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
        getUsersAllCourses: builders.query({
            query: () => ({
                url: `course/get-all-courses`,
                method: "GET",
                credentials: "include" as const
            })
        }),
        getCourseDetails: builders.query({
            query: (id) => ({
                url: `course/get-course/${id}`,
                method: "GET",
                credentials: "include" as const
            })
        }),
        getCourseContent: builders.query({
            query: (id) => ({
                url: `course/get-course-content/${id}`,
                method: "GET",
                credentials: "include" as const
            })
        }),
        addNewQuestion: builders.mutation({
            query: ({ question, courseID, contentID }) => ({
                url: `course/add-question`,
                method: "POST",
                body: { question, courseID, contentID },
                credentials: "include" as const
            })
        }),
    })
})

export const { useCreateCourseMutation, useGetAllCoursesQuery, useDeleteCoursesMutation, useEditCourseMutation, useGetUsersAllCoursesQuery, useGetCourseDetailsQuery, useGetCourseContentQuery, useAddNewQuestionMutation } = courseApi;