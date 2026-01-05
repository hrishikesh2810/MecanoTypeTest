import { globalStatsTableBody } from './ui.js';
import { t, formatTime} from './utils.js';

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

export function saveUserStats() {
    localStorage.setItem('mecano_user_stats', JSON.stringify(userStats));
}

export function renderUserStats() {
    document.getElementById('profile-started').textContent = userStats.started;
    document.getElementById('profile-completed').textContent = userStats.completed;
    document.getElementById('profile-time').textContent = formatTime(userStats.time);

    const counts = [10, 25, 50, 100];
    
    counts.forEach(count => {
        const wpmEl = document.getElementById(`rec-${count}-wpm`);
        const accEl = document.getElementById(`rec-${count}-acc`);
        
        if (wpmEl && accEl) {
            const record = userStats.records[count];
            
            if (record && typeof record === 'object' && 'wpm' in record) {
                wpmEl.textContent = record.wpm;
                accEl.textContent = record.acc + '%';
            } else {
                wpmEl.textContent = '-';
                accEl.textContent = '-';
            }
        }
    });
}

export function renderGlobalStatsTable() {
    globalStatsTableBody.innerHTML = '';
    
    document.querySelectorAll('#global-stats-table th.sortable').forEach(th => {
        th.classList.remove('asc', 'desc');
        if (th.dataset.sort === currentSort.column) {
            th.classList.add(currentSort.direction);
        }
    });

    const entries = Object.entries(stats.charStats).filter(([char]) => {
        switch (stats.currentFilter) {
            case 'lowercase': return /[a-zñ]/.test(char);
            case 'uppercase': return /[A-ZÑ]/.test(char);
            case 'accents': return /[áéíóúüÁÉÍÓÚÜ]/.test(char);
            case 'numbers': return /[0-9]/.test(char);
            case 'symbols': return !/[a-zñA-ZÑ0-9áéíóúüÁÉÍÓÚÜ]/.test(char);
            default: return true;
        }
    }).sort((a, b) => {
        const charA = a[0];
        const charB = b[0];
        const statsA = a[1];
        const statsB = b[1];
        
        const rateA = statsA.total > 0 ? (statsA.errors / statsA.total) : 0;
        const rateB = statsB.total > 0 ? (statsB.errors / statsB.total) : 0;

        let valA, valB;

        switch (currentSort.column) {
            case 'char':
                valA = charA;
                valB = charB;
                break;
            case 'total':
                valA = statsA.total;
                valB = statsB.total;
                break;
            case 'errors':
                valA = statsA.errors;
                valB = statsB.errors;
                break;
            case 'rate':
            default:
                valA = rateA;
                valB = rateB;
                break;
        }

        if (valA < valB) return currentSort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    if (entries.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 4;
        cell.textContent = t("stats.noData");
        row.appendChild(cell);
        globalStatsTableBody.appendChild(row);
        return;
    }

    entries.forEach(([char, stats]) => {
        if (stats.total === 0) return; 
        
        const row = document.createElement('tr');
        const errorRate = ((stats.errors / stats.total) * 100).toFixed(1);
        
        row.innerHTML = `
            <td>${char}</td>
            <td>${stats.total}</td>
            <td>${stats.errors}</td>
            <td style="color: ${errorRate > 0 ? 'var(--error-color)' : 'var(--text-color)'}">${errorRate}%</td>
        `;
        globalStatsTableBody.appendChild(row);
    });
}