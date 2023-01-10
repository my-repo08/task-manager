import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { nanoid } from 'nanoid';
import { Box, Button, Typography, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { motion } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';
import toast from 'react-hot-toast';
import Modal from './Modal';
import { addTask } from '../../utils/helpers';
import { isTaskRepeating } from '../../utils/utils';
import { COLORS, IS_REPEATING_DAYS, MODAL_VARIANTS } from '../../const';
import { Task } from '../../types';

interface ModalProps {
    setOpen: (arg: boolean) => void
}

const AddTaskModal: React.FC<ModalProps> = ({ setOpen }) => {

    const formatType = 'YYYY-MM-DD';

    const queryClient = useQueryClient()

    const [charsRemaining, setCharsRemaining] = useState(32)
    const [description, setDescription] = useState("")
    const [date, setDate] = useState<Dayjs | null>(null)
    const [repeatingDays, setRepeatingDays] = useState(IS_REPEATING_DAYS)
    const [color, setColor] = useState("black")

    const [isDateShown, setDateShown] = useState(false)
    const [isRepeatShown, setRepeatShown] = useState(false)

    const toggleDateStatus = () => {
        setDateShown(prev => !prev)
        setDate(null)
    };
    const toggleRepeatStatus = () => {
        setRepeatShown(prev => !prev)
        setRepeatingDays(IS_REPEATING_DAYS)
    };

    const handleChangeDescription = (evt: React.ChangeEvent<HTMLInputElement>) => {

        if (evt.target.value.length > 32) return

        setDescription(evt.target.value)
        setCharsRemaining(32 - evt.target.value.length)
    }

    const handleDateChange = (newDate: Dayjs | null) => {
        setDate(newDate)
    };

    const handleSetRepeatingDays = (evt: React.MouseEvent<HTMLButtonElement>) => {
        //@ts-ignore
        const arr = evt.target.value.split(",");
        setRepeatingDays({
            ...repeatingDays,
            [arr[0]]: arr[1] === "false" ? true : false,
        })
    }

    const { mutate: addTaskHandle, isLoading } = useMutation((data: Task) => addTask(data), {
        onSuccess: () => {
            queryClient.invalidateQueries('tasks')
            toast.success('Task added')
            setOpen(false)
        },
        onError: () => {
            toast.error('Something went wrong')
        }
    })

    const onSubmit = (evt: React.FormEvent) => {
        evt.preventDefault()
        addTaskHandle({
            id: nanoid(),
            color,
            description,
            dueDate: date ? dayjs(date).format(formatType) : null,
            createdAt: dayjs().format(formatType),
            updatedAt: dayjs().format(formatType),
            isArchived: false,
            isFavorite: false,
            repeatingDays
        })
    }

    const isRepeatAndIsDate = date || isTaskRepeating(repeatingDays);
    const isSubmitButtonDisabled = !Boolean(isRepeatAndIsDate && description.trim().length)

    return (
        <Modal
            onClick={() => setOpen(false)}
        >
            <motion.div
                onClick={evt => evt.stopPropagation()}
                variants={MODAL_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <Box
                    width='300px'
                    p='30px'
                    borderRadius='10px'
                    bgcolor='white'
                >
                    <Box borderBottom={`10px ${isRepeatShown ? 'dashed' : 'solid'} ${color}`} />
                    <form onSubmit={onSubmit}>
                        <TextField
                            fullWidth
                            error={charsRemaining === 0}
                            helperText={`${charsRemaining} characters remaining`}
                            variant='standard'
                            placeholder="Start typing your text here..."
                            value={description}
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
                                    value={date}
                                    onChange={handleDateChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size='small'
                                            sx={{ position: 'absolute', bottom: 0, left: 0 }}
                                        />
                                    )}
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
                                    {Object.entries(repeatingDays).map(([day, repeat]: any) => (
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
                                        border={`2px solid ${item === color ? item : 'transparent'}`}
                                        value={item}
                                        onClick={() => setColor(item)}
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

export default AddTaskModal;