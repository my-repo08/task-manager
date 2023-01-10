import { Box } from '@mui/material';
import { SORT_VALUES } from '../const';

interface SortbarProps {
    sortType: string
    setSortType: (type: string) => void
}

const Sortbar: React.FC<SortbarProps> = ({ sortType, setSortType }) => {

    return (
        <Box display='flex' alignItems='center' mt='30px'>
            {SORT_VALUES.map(item => (
                <Box
                    key={item.value}
                    component='button'
                    fontWeight={sortType === item.value ? 700 : 500}
                    onClick={() => setSortType(item.value)}
                    sx={{ mr: '40px', fontSize: '16px', color: 'black', bgcolor: 'transparent', border: 'none', cursor: 'pointer', ':hover': { opacity: 0.7 }, ':active': { opacity: 1 } }}
                >
                    {item.label}
                </Box>
            ))}
        </Box>
    )
};

export default Sortbar;