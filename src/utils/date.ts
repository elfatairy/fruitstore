export const showDate = (date: Date | undefined) : string => {
    if(!date) return "";
    return `${new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours() % 12 < 10 ? "0":""}${date.getHours() % 12}:${date.getMinutes() < 10 ? "0":""}${date.getMinutes()}:${date.getSeconds() < 10 ? "0":""}${date.getSeconds()} ${date.getHours() > 12? 'PM':'AM'}`
}