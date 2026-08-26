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
        })
    })
})

export const { useCreateCourseMutation } = courseApi;