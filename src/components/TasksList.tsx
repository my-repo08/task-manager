import { useState } from 'react';
import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import EditTaskModal from './Modals/EditTaskModal';
import TaskInfoModal from './Modals/TaskInfoModal';
import TaskItem from './TaskItem';
import { CONTAINER_VARIANTS, ITEM_VARIANTS } from '../const';
import { Task } from '../types';

interface TasksListProps {
    tasks: Task[]
}

const TasksList: React.FC<TasksListProps> = ({ tasks }) => {

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isInfoModalOpen, setInfoModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

    const editTask = (evt: React.MouseEvent<HTMLButtonElement>, task: Task) => {
        evt.stopPropagation()
        setSelectedTask(task)
        setEditModalOpen(true)
    }

    const handleSetTask = (task: Task) => {
        setSelectedTask(task)
        setInfoModalOpen(true)
    }

    return (
        <>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={CONTAINER_VARIANTS}
            >
                <Box display='flex' flexWrap='wrap' columnGap='60px' rowGap='40px' mt='20px' mb='40px'>
                    {tasks.map(task => (
                        <motion.div
                            key={task.id}
                            variants={ITEM_VARIANTS}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleSetTask(task)}
                        >
                            <TaskItem task={task} onTaskEdit={editTask} />
                        </motion.div>
                    ))}
                </Box>
            </motion.div>
            <AnimatePresence
                initial={false}
                mode='wait'
                onExitComplete={() => null}
            >
                {isEditModalOpen && <EditTaskModal task={selectedTask!} setOpen={setEditModalOpen} />}
                {isInfoModalOpen && <TaskInfoModal task={selectedTask!} setOpen={setInfoModalOpen} />}
            </AnimatePresence>
        </>
    );
};

export default TasksList;