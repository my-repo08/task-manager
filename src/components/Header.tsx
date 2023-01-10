import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import AddTaskModal from './Modals/AddTaskModal';
import { getAllTasksNum, getArchivedTasksNum, getExpiredTasksNum, getFavoriteTasksNum, getRepeatingTasksNum, getTodayTasksNum } from '../utils/utils';
import { Task } from '../types';

const ButtonStyle = {
    color: 'black',
    fontSize: '16px',
    bgcolor: 'transparent',
    border: 'none',
    textTransform: 'uppercase',
    cursor: 'pointer',
    ':hover': {
        opacity: 0.8
    },
    ':active': {
        opacity: 1
    },
    ':disabled': {
        opacity: 0.5,
        cursor: 'not-allowed'
    }
}

interface HeaderProps {
    tasks: Task[]
    activeTab: string
    setActiveTab: (tab: string) => void
}

const Header: React.FC<HeaderProps> = ({ tasks, activeTab, setActiveTab }) => {

    const [isModalOpen, setModalOpen] = useState(false)

    const allTasksNum = getAllTasksNum(tasks)
    const expiredTasksNum = getExpiredTasksNum(tasks)
    const todayTasksNum = getTodayTasksNum(tasks)
    const favoriteTasksNum = getFavoriteTasksNum(tasks)
    const repeatingTasksNum = getRepeatingTasksNum(tasks)
    const archivedTasksNum = getArchivedTasksNum(tasks)

    return (
        <Box component='header' mt='40px'>
            <Box display='flex' alignItems='center'>
                <Typography variant='h1' mr='100px' fontSize='16px' fontWeight={700}>
                    TASKMANAGER
                </Typography>
                <Box
                    component='button'
                    onClick={() => setModalOpen(true)}
                    sx={ButtonStyle}
                >
                    + ADD NEW TASK
                </Box>
            </Box>
            <Box display='flex' justifyContent='space-between' alignItems='center' mt='30px'>
                <Box
                    component='button'
                    fontWeight={activeTab === 'all' ? 700 : 500}
                    disabled={!allTasksNum}
                    onClick={() => setActiveTab('all')}
                    sx={ButtonStyle}
                >
                    All {allTasksNum}
                </Box>
                <Box
                    component='button'
                    fontWeight={activeTab === 'overdue' ? 700 : 500}
                    disabled={!expiredTasksNum}
                    onClick={() => setActiveTab('overdue')}
                    sx={ButtonStyle}
                >
                    Overdue {expiredTasksNum}
                </Box>
                <Box
                    component='button'
                    fontWeight={activeTab === 'today' ? 700 : 500}
                    disabled={!todayTasksNum}
                    onClick={() => setActiveTab('today')}
                    sx={ButtonStyle}
                >
                    Today {todayTasksNum}
                </Box>
                <Box
                    component='button'
                    fontWeight={activeTab === 'favorites' ? 700 : 500}
                    disabled={!favoriteTasksNum}
                    onClick={() => setActiveTab('favorites')}
                    sx={ButtonStyle}
                >
                    Favorites {favoriteTasksNum}
                </Box>
                <Box
                    component='button'
                    fontWeight={activeTab === 'repeating' ? 700 : 500}
                    disabled={!repeatingTasksNum}
                    onClick={() => setActiveTab('repeating')}
                    sx={ButtonStyle}
                >
                    Repeating {repeatingTasksNum}
                </Box>
                <Box
                    component='button'
                    fontWeight={activeTab === 'archive' ? 700 : 500}
                    disabled={!archivedTasksNum}
                    onClick={() => setActiveTab('archive')}
                    sx={ButtonStyle}
                >
                    Archive {archivedTasksNum}
                </Box>
            </Box>
            <AnimatePresence
                initial={false}
                onExitComplete={() => null}
                mode='wait'
            >
                {isModalOpen && <AddTaskModal setOpen={setModalOpen} />}
            </AnimatePresence>
        </Box>
    )
};

export default Header;