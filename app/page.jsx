import CalendarComponent from '@/app/components/calendar/Calendar';
import { createClient } from '@/utils/supabase/server';
import { formatISO } from 'date-fns';

async function fetchData() {
  const supabase = createClient();

  // Fetch data from 'day' table
  let { data: days, error: dayError } = await supabase
    .from('day')
    .select('*');

  if (dayError) {
    console.error('Error fetching days:', dayError);
    return { days: [], closedDays: [] };
  }

  // Fetch data from 'closedday' table
  let { data: closedDaysData, error: closedDayError } = await supabase
    .from('closedday')
    .select('*');

  if (closedDayError) {
    console.error('Error fetching closed days:', closedDayError);
    return { days, closedDays: [] };
  }

  // Format closedDays to ISO strings
  const closedDays = closedDaysData.map(d => formatISO(new Date(d.date)));

  return { days, closedDays };
}

export default async function Home() {
  const { days, closedDays } = await fetchData();

  return (
    <>
      <main>
        <CalendarComponent days={days} closedDays={closedDays} />
      </main>
    </>
  );
}
