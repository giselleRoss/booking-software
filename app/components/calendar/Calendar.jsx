import ReactCalendar from 'react-calendar'
import {add, format} from 'date-fns'
import { OPENING_HOURS_BEGINNING, OPENING_HOURS_END, OPENING_HOURS_INTERVAL } from '@/app/constants/config'

const Calendar = ({date, setDate}) => {
    const getTimes = () => {
        if(!date.justDate) return;

        const {justDate} = date;
        const beginning = add(justDate, {hours: OPENING_HOURS_BEGINNING}) ;
        const end = add(justDate, {hours: OPENING_HOURS_END});
        const interval = OPENING_HOURS_INTERVAL //in minutes

        const times = [];

        for(let i = beginning; i <= end; i = add(i, {minutes: interval})){
            times.push(i);
        }
        return times;
    }

    const times = getTimes();
  return (
    <div className='flex h-screen flex-col items-center justify-center'>
        {date.justDate ? (
            <div className='flex gap-4'>
                {times?.map((time, i) => (
                    <div key={`time-${i}`} className='rounded-sm bg-gray-100 p-2'><button type='button' onClick={() => setDate((prev) => ({...prev, dateTime: time}))}>{format(time, 'kk:mm')}</button>
                    </div>
                ))}
            </div>
        ) : (<ReactCalendar minDate={new Date()}
    className="REACT-CALENDAR p-2" view='month' onClickDay={(date) => setDate((prev) => ({...prev, justDate: date}))}/>)}
        
    </div>
    
  )
}
export default Calendar;