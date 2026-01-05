export const stats = {
    charStats: JSON.parse(localStorage.getItem('mecano_char_stats')) || {},
    currentFilter: 'lowercase',
};

export const userStats = JSON.parse(localStorage.getItem('mecano_user_stats')) || {
    started: 0,
    completed: 0,
    time: 0,
    records: {}
};

export const currentSort = { column: 'rate', direction: 'desc' };