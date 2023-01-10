import dayjs from "dayjs";
import { Task } from "../types";

interface RepeatingDays {
    [key: string]: boolean
};

type DueDate = string | null

interface SortType {
    dueDate: DueDate
}

export const isTaskExpired = (dueDate: DueDate) => dueDate && dayjs().isAfter(dueDate, 'D');

export const isTaskExpiringToday = (dueDate: DueDate) => dueDate && dayjs(dueDate).isSame(dayjs(), 'D');

export const formatTaskDueDate = (dueDate: DueDate) => dayjs(dueDate).format('D MMMM');

export const formatTaskDateInfo = (dueDate: DueDate) => dayjs(dueDate).format('D MMM YYYY');

export const isTaskRepeating = (repeatingDays: RepeatingDays) => Object.values(repeatingDays).some(Boolean);

export const isTaskActiveToday = (repeatingDays: RepeatingDays) => Object.entries(repeatingDays).filter(day => day[1] && (day[0] === dayjs().format('dd').toLowerCase()));

export const taskRepeatingDays = (repeatingDays: RepeatingDays) => Object.entries(repeatingDays).filter(day => day[1])

const getWeightForNullDate = (dateA: DueDate, dateB: DueDate) => {
    if (dateA === null && dateB === null) {
        return 0;
    }

    if (dateA === null) {
        return 1;
    }

    if (dateB === null) {
        return -1;
    }

    return null;
};

export const sortTaskUp = (taskA: SortType, taskB: SortType) => {
    const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

    return weight ?? dayjs(taskA.dueDate).diff(dayjs(taskB.dueDate));
};

export const sortTaskDown = (taskA: SortType, taskB: SortType) => {
    const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

    return weight ?? dayjs(taskB.dueDate).diff(dayjs(taskA.dueDate));
};

export const getAllTasksNum = (tasks: Task[]) => tasks.filter(task => task && !task.isArchived).length
export const getExpiredTasksNum = (tasks: Task[]) => tasks.filter(task => isTaskExpired(task.dueDate) && !task.isArchived).length
export const getTodayTasksNum = (tasks: Task[]) => tasks.filter(task => (isTaskExpiringToday(task.dueDate) || isTaskActiveToday(task.repeatingDays).length) && !task.isArchived).length
export const getFavoriteTasksNum = (tasks: Task[]) => tasks.filter(task => task.isFavorite && !task.isArchived).length
export const getRepeatingTasksNum = (tasks: Task[]) => tasks.filter(task => isTaskRepeating(task.repeatingDays) && !task.isArchived).length
export const getArchivedTasksNum = (tasks: Task[]) => tasks.filter(task => task.isArchived).length
