export interface Task {
    id: string,
    color: string,
    description: string,
    dueDate: string | null,
    createdAt: string,
    updatedAt: string,
    isArchived: boolean,
    isFavorite: boolean,
    repeatingDays: {
        [key: string]: boolean
    }
}

export interface GenericResponse {
    status: string;
    message: string;
}