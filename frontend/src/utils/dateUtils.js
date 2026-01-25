export const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date)) return "—";

    return date.toLocaleDateString("en-SG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export const formatTime = (timeString) => {
    if (!timeString) return "";
    
    // Handle both HH:MM:SS and HH:MM formats
    const timeParts = timeString.split(':');
    if (timeParts.length < 2) return timeString;
    
    let hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    
    return `${hours}:${minutes} ${period}`;
}

export const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return "";
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}