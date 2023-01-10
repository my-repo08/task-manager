import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Box, Button, TextField, Typography } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Modal from './Modal';
import { updateTask } from '../../utils/helpers';
import { isTaskRepeating } from '../../utils/utils';
import { COLORS, IS_REPEATING_DAYS, MODAL_VARIANTS } from '../../const';
import { Task } from '../../types';

interface ModalProps {
    task: Task
    setOpen: (arg: boolean) => void
}

const EditTaskModal: React.FC<ModalProps> = ({ task, setOpen }) => {

    const {
        id,
        color,
        description,
        dueDate,
        repeatingDays
    } = task

    const queryClient = useQueryClient()

    const [taskColor, setTaskColor] = useState(color)
    const [taskDescription, setTaskDescription] = useState(description)
    const [taskDate, setTaskDate] = useState<Dayjs | null>(dueDate ? dayjs(dueDate) : null)
    const [taskRepeatingDays, setTaskRepeatingDays] = useState(repeatingDays)
    const [charsRemaining, setCharsRemaining] = useState(32 - taskDescription.length)

    const [isDateShown, setDateShown] = useState(Boolean(dueDate))
    const [isRepeatShown, setRepeatShown] = useState(() => Boolean(isTaskRepeating(repeatingDays)))

    const handleChangeDescription = (evt: React.ChangeEvent<HTMLInputElement>) => {

        if (evt.target.value.length > 32) return

        setTaskDescription(evt.target.value)
        setCharsRemaining(32 - evt.target.value.length)
    }

    const handleDateChange = (newDate: Dayjs | null) => {
        setTaskDate(newDate)
    }

    const handleSetRepeatingDays = (evt: React.MouseEvent<HTMLButtonElement>) => {
        //@ts-ignore
        const arr = evt.target.value.split(",")
        setTaskRepeatingDays({
            ...taskRepeatingDays,
            [arr[0]]: arr[1] === "false" ? true : false,
        })
    }

    const toggleDateStatus = () => {
        setDateShown(!isDateShown)
        setTaskDate(null)
    }

    const toggleRepeatStatus = () => {
        setRepeatShown(!isRepeatShown)
        setTaskRepeatingDays(IS_REPEATING_DAYS)

    }

    const { mutate: updateTaskHandle, isLoading } = useMutation((data: any) => updateTask(data), {
        onSuccess: () => {
            queryClient.invalidateQueries('tasks')
            toast.success('Task updated')
            setOpen(false)
        },
        onError: () => {
            toast.error('Something went wrong')
        }
    })

    const onSubmit = (evt: React.FormEvent) => {
        evt.preventDefault()
        updateTaskHandle({
            taskId: id,
            data: {
                color: taskColor,
                description: taskDescription,
                dueDate: taskDate,
                updatedAt: dayjs().format('YYYY-MM-DD'),
                repeatingDays: taskRepeatingDays
            }
        })
    }

    const isRepeatAndIsDate = taskDate || isTaskRepeating(taskRepeatingDays)
    const isSubmitButtonDisabled = !Boolean(isRepeatAndIsDate && taskDescription.trim().length)

    return (
        <Modal onClick={() => setOpen(false)}>
            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={MODAL_VARIANTS}
                onClick={evt => evt.stopPropagation()}
            >
                <Box
                    width='300px'
                    p='30px'
                    borderRadius='10px'
                    bgcolor='white'
                >
                    <Box borderBottom={`10px ${isRepeatShown ? 'dashed' : 'solid'} ${taskColor}`} />
                    <form onSubmit={onSubmit}>
                        <TextField
                            fullWidth
                            error={charsRemaining === 0}
                            helperText={`${charsRemaining} characters remaining`}
                            variant='standard'
                            placeholder="Start typing your text here..."
                            value={taskDescription}
                            onChange={handleChangeDescription}
                            sx={{ mt: '40px', mb: '20px', alignItems: 'flex-start', whiteSpace: 'normal', fontWeight: 700 }}
                        />
                        <Box position='relative'>
                            <Box
                                component='button'
                                type='button'
                                mb="45px"
                                p='0px'
                                bgcolor='transparent'
                                border='none'
                                borderBottom='1px solid black'
                                disabled={isRepeatShown}
                                onClick={toggleDateStatus}
                                sx={{ cursor: 'pointer', ':disabled': { cursor: 'not-allowed' } }}
                            >
                                DATE: {isDateShown ? 'YES' : 'NO'}
                            </Box>
                            {isDateShown && (
                                <DesktopDatePicker
                                    inputFormat="DD.MM.YYYY"
                                    value={taskDate}
                                    onChange={handleDateChange}
                                    renderInput={(params) => <TextField {...params} size='small' sx={{ position: 'absolute', bottom: 0, left: 0 }} />}
                                />
                            )}
                        </Box>
                        <Box position='relative'>
                            <Box
                                component='button'
                                type='button'
                                mb="30px"
                                p='0px'
                                bgcolor='transparent'
                                border='none'
                                borderBottom='1px solid black'
                                disabled={isDateShown}
                                onClick={toggleRepeatStatus}
                                sx={{ cursor: 'pointer', ':disabled': { cursor: 'not-allowed' } }}
                            >
                                REPEAT: {isRepeatShown ? 'YES' : 'NO'}
                            </Box>
                            {isRepeatShown && (
                                <Box
                                    width='100%'
                                    display='flex'
                                    justifyContent='space-between'
                                    alignItems='center'
                                    sx={{ position: 'absolute', bottom: 0, left: 0 }}
                                >
                                    {Object.entries(taskRepeatingDays).map(([day, repeat]: any) => (
                                        <Box
                                            key={day}
                                            component='button'
                                            type='button'
                                            width='30px'
                                            height='25px'
                                            display='flex'
                                            justifyContent='center'
                                            alignItems='center'
                                            fontSize='16px'
                                            bgcolor='transparent'
                                            border='1px solid black'
                                            value={[day, repeat]}
                                            onClick={handleSetRepeatingDays}
                                            sx={{ opacity: repeat ? 1 : 0.2, cursor: 'pointer' }}
                                        >
                                            {day}
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                        <Box>
                            <Typography mt='10px' mb='5px' fontSize='12px' fontWeight={600}>
                                COLOR
                            </Typography>
                            <Box display='flex' justifyContent='space-between' alignItems='center'>
                                {COLORS.map(item => (
                                    <Box
                                        key={item}
                                        component='button'
                                        type='button'
                                        p='3px'
                                        borderRadius='50%'
                                        bgcolor='transparent'
                                        border={`2px solid ${item === taskColor ? item : 'transparent'}`}
                                        value={item}
                                        onClick={() => setTaskColor(item)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <Box width='20px' height='20px' borderRadius='50%' bgcolor={item} />
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        <Button
                            fullWidth
                            variant='contained'
                            size='small'
                            type='submit'
                            disabled={isSubmitButtonDisabled || isLoading}
                            sx={{ mt: '20px', bgcolor: 'transparent', color: 'black', ':hover': { bgcolor: '#ebebeb' }, ':active': { bgcolor: 'transparent' } }}
                        >
                            SAVE
                        </Button>
                    </form>
                </Box>
            </motion.div>
        </Modal>
    )
};

export default EditTaskModal;