import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Modal from './Modal';
import { formatTaskDateInfo, formatTaskDueDate, isTaskExpired, isTaskRepeating, taskRepeatingDays } from '../../utils/utils';
import { MODAL_VARIANTS } from '../../const';
import { Task } from '../../types';

interface ModalProps {
    task: Task
    setOpen: (arg: boolean) => void
}

const TaskInfoModal: React.FC<ModalProps> = ({ task, setOpen }) => {

    const {
        color,
        description,
        dueDate,
        createdAt,
        updatedAt,
        repeatingDays
    } = task

    const isExpired = isTaskExpired(dueDate)
    const repeatsOn = taskRepeatingDays(repeatingDays)
    const isRepeating = isTaskRepeating(repeatingDays)

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
                    <Typography
                        variant='h2'
                        mb='15px'
                        fontSize='18px'
                        fontWeight={600}
                    >
                        {description}
                    </Typography>
                    <Box mb="15px">
                        {dueDate ? (
                            <>
                                <Typography fontSize='14px'>
                                    {isExpired ? 'Expired' : 'Exipres'}
                                </Typography>
                                <Typography
                                    fontSize='12px'
                                    fontWeight={700}
                                    textTransform='uppercase'
                                    color={isExpired ? 'red' : 'black'}
                                >
                                    {formatTaskDueDate(dueDate)}
                                </Typography>
                            </>
                        ) : (
                            <Box>
                                <Typography lineHeight={1} fontSize='14px'>
                                    Repeats on
                                </Typography>
                                {repeatsOn.map(day => (
                                    <Typography
                                        key={day[0]}
                                        component='span'
                                        mr='3px'
                                        fontSize='12px'
                                        fontWeight={700}
                                        lineHeight={1}
                                        textTransform='uppercase'
                                    >
                                        {day[0]}
                                    </Typography>
                                ))}
                            </Box>
                        )}
                    </Box>
                    <Box display='flex' justifyContent='space-between' alignItems='center' mb="15px">
                        <Box>
                            <Typography fontSize='14px'>
                                Created
                            </Typography>
                            <Typography
                                fontSize='12px'
                                fontWeight={700}
                                textTransform='uppercase'
                            >
                                {formatTaskDateInfo(createdAt)}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography fontSize='14px'>
                                Updated
                            </Typography>
                            <Typography
                                fontSize='12px'
                                fontWeight={700}
                                textTransform='uppercase'
                            >
                                {formatTaskDateInfo(updatedAt)}
                            </Typography>
                        </Box>
                    </Box>
                    <Box borderBottom={`10px ${isRepeating ? 'dashed' : 'solid'} ${isExpired ? 'red' : color}`} />
                </Box>
            </motion.div>
        </Modal>
    )
};

export default TaskInfoModal;