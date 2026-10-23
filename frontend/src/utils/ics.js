const two = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}${two(d.getMonth() + 1)}${two(d.getDate())}`;

// Descarga el evento como archivo iCalendar (.ics) de "todo el día" (RFC 5545)
export function downloadIcs(event) {
  const start = new Date(event.date);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `UID:${event._id}@eventos-udec`,
    `DTSTAMP:${ymd(start)}T000000Z`,
    `DTSTART;VALUE=DATE:${ymd(start)}`,
    `DTEND;VALUE=DATE:${ymd(end)}`,
    `SUMMARY:${event.name}`,
    `LOCATION:${event.location}`,
    `DESCRIPTION:${(event.description || '').replaceAll('\n', ' ')}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.name}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}
