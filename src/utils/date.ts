export const showDate = (date: Date | undefined) : string => {
    if(!date) return "";
    return `${new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours() % 12 < 10 ? "0":""}${date.getHours() % 12}:${date.getMinutes() < 10 ? "0":""}${date.getMinutes()}:${date.getSeconds() < 10 ? "0":""}${date.getSeconds()} ${date.getHours() > 12? 'PM':'AM'}`
}


// utils/arabicDate.ts

const arabicDays = {
    'Sun': 'الأحد',
    'Mon': 'الإثنين',
    'Tue': 'الثلاثاء',
    'Wed': 'الأربعاء',
    'Thu': 'الخميس',
    'Fri': 'الجمعة',
    'Sat': 'السبت'
};

const translatePeriod = (period: string): string => {
    return period.toLowerCase() === 'am' ? 'صباحا' : 'مساء';
};

export const formatArabicDate = (date: Date): string => {
    const englishDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    // Extract components
    const [weekday, datePart, timePart] = englishDate.split(',');
    const [time, period] = timePart.trim().split(' ');
    const [hour, minute] = time.split(':');

    // Format the date parts
    const formattedDate = datePart.trim().split('/').join('/');
    
    // Translate to Arabic
    const arabicWeekday = arabicDays[weekday as keyof typeof arabicDays];
    const arabicPeriod = translatePeriod(period);

    return `${arabicWeekday} ${formattedDate} ${hour}:${minute} ${arabicPeriod}`;
};