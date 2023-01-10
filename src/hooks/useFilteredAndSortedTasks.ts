import { useMemo } from "react";
import { sortTaskUp, sortTaskDown, isTaskExpired, isTaskExpiringToday, isTaskActiveToday, isTaskRepeating } from "../utils/utils";
import { Task } from "../types";

const useSortedTasks = (tasks: Task[], sortType: string) => {

    const sortedTasks = useMemo(() => {
        if (tasks) {
            switch (sortType) {
                case 'up':
                    return [...tasks].sort(sortTaskUp)
                case 'down':
                    return [...tasks].sort(sortTaskDown)
                default:
                    return tasks
            }
        }
        return tasks
    }, [tasks, sortType])

    return sortedTasks
};

const filterTasks = (tasks: Task[], selectedTasksType: string) => {

    switch (selectedTasksType) {
        case 'all':
            return [...tasks].filter(task => task && !task.isArchived)
        case 'overdue':
            return [...tasks].filter(task => isTaskExpired(task.dueDate) && !task.isArchived)
        case 'today':
            return [...tasks].filter(task => (isTaskExpiringToday(task.dueDate) || isTaskActiveToday(task.repeatingDays).length) && !task.isArchived)
        case 'favorites':
            return [...tasks].filter(task => task.isFavorite && !task.isArchived)
        case 'repeating':
            return [...tasks].filter(task => isTaskRepeating(task.repeatingDays) && !task.isArchived)
        case 'archive':
            return [...tasks].filter(task => task.isArchived)
        default:
            return tasks
    }
};

const useFilteredAndSortedTasks = (tasks: Task[], taskType: string, sortType: string) => {

    const sortedTasks = useSortedTasks(tasks, sortType)

    const selectedAndSortedTasks = useMemo(() => {
        return filterTasks(sortedTasks, taskType)
    }, [sortedTasks, taskType])

    return selectedAndSortedTasks
};

export default useFilteredAndSortedTasks;