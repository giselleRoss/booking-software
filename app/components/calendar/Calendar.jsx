'use client'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { format, formatISO, isBefore, parse } from 'date-fns';
import { now, OPENING_HOURS_INTERVAL } from '../../constants/config';
import { getOpeningTimes, roundToNearestMinutes } from '@/utils/helpers';
import { useRouter } from 'next/router';
// import { listEvents } from '@/utils/googleApi';
// import GoogleAuth from '@/components/GoogleAuth';

const DynamicCalendar = dynamic(() => import('react-calendar'), { ssr: false });

const Calendar = ({days, closedDays}) => {
  const router = useRouter()
  const today = days.find((d) => d.dayOfWeek === now.getDay())
  const rounded = roundToNearestMinutes(now, OPENING_HOURS_INTERVAL)
  const closing = parse(today.closeTime, 'kk:mm', now);
  const tooLate = !isBefore(rounded, closing);
  if (tooLate) closedDays.push(formatISO(new Date().setHours(0, 0, 0, 0)));
  const [date, setDate] = useState({
    justDate: null,
    dateTime: null,
  })

  useEffect(() => {
    if(date.dateTime) {
      localStorage.setItem('selectedTime', date.dateTime.toISOString())
      router.push('/menu')
    }
  }, [date.dateTime])

  const times = date.justDate && getOpeningTimes(date.justDate, days)
 
  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      {date.justDate ? (
        <div className='flex max-w-lg flex-wrap gap-4'>
          {times?.map((time, i) => (
            <div className='rounded-sm bg-gray-100 p-2' key={`time-${i}`}>
              <button onClick={() => setDate((prev) => ({ ...prev, dateTime: time }))} type='button'>
                {format(time, 'kk:mm')}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <DynamicCalendar
          minDate={now}
          className='REACT-CALENDAR p-2'
          view='month'
          tileDisabled={({ date }) => closedDays.includes(formatISO(date))}
          onClickDay={(date) => setDate((prev) => ({ ...prev, justDate: date }))}
        />
      )}
    </div>
  );
};

export default Calendar;
