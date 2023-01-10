import { useState } from 'react';
import { useQuery } from 'react-query';
import { Box, Typography } from '@mui/material';
import { PropagateLoader } from 'react-spinners';
import Header from './Header';
import Sortbar from './Sortbar';
import TasksList from './TasksList';
import useFilteredAndSortedTasks from '../hooks/useFilteredAndSortedTasks';
import { getTasks } from '../utils/helpers';

const Board: React.FC = () => {

    const [activeTab, setActiveTab] = useState('all')
    const [sortType, setSortType] = useState('up')

    const {
        data: tasks = [],
        isLoading,
        isSuccess,
        error
    } = useQuery('tasks', getTasks)

    const sortedTasks = useFilteredAndSortedTasks(tasks, activeTab, sortType)

    let content

    if (isLoading) {
        content =
            <Box display='flex' justifyContent='center' mt='200px'>
                <PropagateLoader color='gray' />
            </Box>
    } else if (error) {
        content =
            <Box display='flex' justifyContent='center' mt='100px'>
                <Typography variant='h2' fontSize='26px' fontWeight='bold'>
                    Error: Something went wrong
                </Typography>
            </Box>
    } else if (isSuccess) {
        content =
            <Box component='section' height='100%'>
                <TasksList tasks={sortedTasks} />
            </Box>
    }

    return (
        <>
            <Header tasks={tasks} activeTab={activeTab} setActiveTab={setActiveTab} />
            <Sortbar sortType={sortType} setSortType={setSortType} />
            {content}
        </>
    );
};

export default Board;