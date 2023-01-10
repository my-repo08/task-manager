export const BASE_URL = 'https://server-for--task-manager.herokuapp.com/tasks'

export const SORT_VALUES = [
    {
        value: 'up',
        label: 'SORT BY DATE up'
    },
    {
        value: 'down',
        label: 'SORT BY DATE down'
    }
]

export const COLORS = ['black', 'gold', 'blue', 'green', 'fuchsia'];

export const IS_REPEATING_DAYS = {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false
};

export const MODAL_VARIANTS = {
    visible: {
        opacity: 1,
        scale: 1
    },
    hidden: {
        opacity: 0,
        scale: 0.75
    },
    exit: {
        opacity: 0,
        scale: 0
    }
};

export const CONTAINER_VARIANTS = {
    hidden: {
        opacity: 1,
        scale: 0
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.1
        }
    }
};

export const ITEM_VARIANTS = {
    hidden: {
        y: 20,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1
    }
};