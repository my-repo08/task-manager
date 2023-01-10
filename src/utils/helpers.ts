import axios from "axios"
import { z, ZodError } from 'zod';
import { BASE_URL } from "../const"
import { GenericResponse, Task } from "../types"

const ValidTask = z.object({
    id: z.string(),
    color: z.string(),
    description: z.string(),
    dueDate: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    isArchived: z.boolean(),
    isFavorite: z.boolean(),
    repeatingDays: z.object({
        mo: z.boolean(),
        tu: z.boolean(),
        we: z.boolean(),
        th: z.boolean(),
        fr: z.boolean(),
        sa: z.boolean(),
        su: z.boolean()
    })
}).strict()

export const getTasks = async () => {
    const response = await axios.get<Task[]>(`${BASE_URL}`)
    return response.data
}

export const addTask = async (task: Task) => {

    try {
        const data = ValidTask.parse(task)
        const response = await axios.post<Task>(`${BASE_URL}`, data)
        return response.data

    } catch (error) {
        if (error instanceof ZodError) {
            return error.flatten()
        } else {
            throw error
        }
    }
}

export const deleteTask = async (taskId: string) => {
    const response = await axios.delete<GenericResponse>(`${BASE_URL}/${taskId}`)
    return response.data
}

export const updateTask = async ({ taskId, data }: { taskId: string, data: any }) => {
    const response = await axios.patch<Task>(`${BASE_URL}/${taskId}`, data)
    return response.data
}