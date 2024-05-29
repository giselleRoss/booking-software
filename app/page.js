import CalendarComponent from '@/app/components/calendar/Calendar'
import { formatISO } from 'date-fns'


export default function Home({ days, closedDays }) {
  return (
    <>
    <main>
      <CalendarComponent days={days} closedDays={closedDays} />
    </main>
  </>
  );
}
