export function secToMin(sec: number) {
    return (sec / 60).toFixed(1);
}

export function formatSec(sec: number): string {
    const _min = Math.floor(sec / 60);
    const _sec = sec % 60;
    return [
        _min > 0 ? `${_min} min` : null,
        _min > 0 && _sec > 0 ? 'and' : null,
        _sec > 0 ? `${_sec} sec` : null,
    ]
        .join(' ')
        .trim();
}
