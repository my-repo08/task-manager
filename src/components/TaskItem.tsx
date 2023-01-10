import { useMutation, useQueryClient } from 'react-query';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { BsArchive, BsArchiveFill } from 'react-icons/bs'
import { BiEdit } from 'react-icons/bi'
import { MdDeleteOutline, MdFavorite, MdOutlineFavoriteBorder } from 'react-icons/md'
import { formatTaskDueDate, isTaskExpired, taskRepeatingDays } from '../utils/utils';
import { deleteTask, updateTask } from '../utils/helpers';
import { Task } from '../types';

interface TaskItemProps {
    task: Task
    onTaskEdit: (evt: React.MouseEvent<HTMLButtonElement>, task: Task) => void
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskEdit }) => {

    const queryClient = useQueryClient()

    const {
        id,
        color,
        description,
        dueDate,
        isArchived,
        isFavorite,
        repeatingDays
    } = task

    const isExpired = isTaskExpired(dueDate)
    const repeatsOn = taskRepeatingDays(repeatingDays)

    const { mutate: deleteTaskHandle, isLoading: isDeletingLoading } =
        useMutation((taskId: string) => deleteTask(taskId), {
            onSuccess: () => {
                queryClient.invalidateQueries('tasks')
                toast.success('Task deleted')
            },
            onError: () => {
                toast.error('Something went wrong')
            }
        })

    const { mutate: archiveTaskToggle, isLoading: isArchivedToggling } =
        useMutation((data: any) => updateTask(data), {
            onSuccess: () => {
                queryClient.invalidateQueries('tasks')
                toast.success(`Task ${isArchived ? 'unarchived' : 'archived'}`)
            },
            onError: () => {
                toast.error('Something went wrong')
            }
        })

    const { mutate: favoriteTaskToggle, isLoading: isFavoriteToggling } =
        useMutation((data: any) => updateTask(data), {
            onSuccess: () => {
                queryClient.invalidateQueries('tasks')
                toast.success(`Task ${isFavorite ? 'deleted from' : 'added to'} favorites`)
            },
            onError: () => {
                toast.error('Something went wrong')
            }
        })

    const onDeleteTask = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.stopPropagation()
        deleteTaskHandle(id)
    }

    const onToggleArchive = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.stopPropagation()
        archiveTaskToggle({
            taskId: id,
            data: {
                isArchived: !isArchived
            }
        })
    }

    const onToggleFavorite = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.stopPropagation()
        favoriteTaskToggle(
            {
                taskId: id,
                data: {
                    isFavorite: !isFavorite
                }
            }
        )
    }

    return (
        <Box
            width='250px'
            height='240px'
            sx={{ cursor: 'pointer' }}
        >
            <Box
                height='100%'
                display='flex'
                flexDirection='column'
                px='20px'
                borderRadius='10px'
                boxShadow={isExpired ? '0 2px 38px 0 rgba(240, 0, 0, 0.19)' : '0 9px 38px 0 rgb(0 17 45 / 12%)'}
            >
                <Box
                    display='flex'
                    justifyContent='flex-end'
                    alignItems='center'
                    mr='-10px'
                >
                    <Tooltip title={`${isFavorite ? 'Delete from favorites' : 'Add to favorites'}`}>
                        <IconButton
                            disabled={isFavoriteToggling}
                            onClick={onToggleFavorite}
                        >
                            {isFavorite
                                ? <MdFavorite size={16} />
                                : <MdOutlineFavoriteBorder size={16} />
                            }
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={`${isArchived ? 'Unarchive' : 'Archive'}`}>
                        <IconButton
                            disabled={isArchivedToggling}
                            onClick={onToggleArchive}
                        >
                            {isArchived
                                ? <BsArchiveFill size={16} />
                                : <BsArchive size={16} />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Edit'>
                        <IconButton onClick={evt => onTaskEdit(evt, task)}>
                            <BiEdit size={16} />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box borderBottom={`10px ${dueDate ? 'solid' : 'dashed'} ${isExpired ? 'red' : color}`} />
                <Box height='80%' pr='10px' overflow='auto'>
                    <Typography
                        variant='h3'
                        mt='10px'
                        fontSize='16px'
                        fontWeight={600}
                    >
                        {description}
                    </Typography>
                </Box>
                <Box display='flex' justifyContent='space-between' alignItems='center' mt='auto' mb='10px' mr='-10px'>
                    {dueDate ? (
                        <Typography
                            mb='-5px'
                            fontSize='12px'
                            fontWeight={700}
                            textTransform='uppercase'
                            color={isExpired ? 'red' : 'black'}
                        >
                            {formatTaskDueDate(dueDate)}
                        </Typography>
                    ) : (
                        <Box>
                            {repeatsOn.map(day => (
                                <Typography
                                    key={day[0]}
                                    component='span'
                                    mb='-5px'
                                    mr='3px'
                                    fontSize='12px'
                                    fontWeight={700}
                                    textTransform='uppercase'
                                >
                                    {day[0]}
                                </Typography>
                            ))}
                        </Box>
                    )}
                    <Tooltip title='Delete'>
                        <IconButton
                            disabled={isDeletingLoading}
                            onClick={onDeleteTask}
                        >
                            <MdDeleteOutline size={20} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    )
};

export default TaskItem;