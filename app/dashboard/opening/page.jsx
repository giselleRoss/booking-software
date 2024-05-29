'use client'
import { useState, useEffect } from 'react';
// import { Button } from '@chakra-ui/react';
// import { Switch } from '@headlessui/react';
import { formatISO } from 'date-fns';
// import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '@/utils/supabase/client';
import Calendar from 'react-calendar';
import TimeSelector from '../../components/calendar/TimeSelector';
import { capitalize, classNames, weekdayIndexToName } from '@/utils/helpers';

const Opening = ({ days }) => {
  const [enabled, setEnabled] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openingHrs, setOpeningHrs] = useState(
    days.map((day, index) => ({
      name: weekdayIndexToName(index),
      openTime: day.openTime,
      closeTime: day.closeTime,
    }))
  );

  const [closedDays, setClosedDays] = useState([]);

  useEffect(() => {
    const fetchClosedDays = async () => {
      const { data, error } = await supabase.from('closed_days').select('date');
      if (error) {
        console.error(error);
      } else {
        setClosedDays(data.map((d) => d.date));
      }
    };
    fetchClosedDays();
  }, []);

  const handleChangeTime = (dayName, type, time) => {
    setOpeningHrs((prev) =>
      prev.map((day) =>
        day.name === dayName ? { ...day, [type]: time } : day
      )
    );
  };

  const handleSaveOpeningHrs = async () => {
    try {
      const updates = openingHrs.map((day) => ({
        name: day.name,
        openTime: day.openTime,
        closeTime: day.closeTime,
      }));

      const { error } = await supabase.from('days').upsert(updates);

      if (error) {
        throw error;
      }

      toast.success('Opening hours saved');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleToggleDay = async (date) => {
    const isoDate = formatISO(date);
    const isClosed = closedDays.includes(isoDate);

    try {
      if (isClosed) {
        const { error } = await supabase
          .from('closed_days')
          .delete()
          .eq('date', isoDate);

        if (error) {
          throw error;
        }

        setClosedDays((prev) => prev.filter((d) => d !== isoDate));
        toast.success('Day opened');
      } else {
        const { error } = await supabase
          .from('closed_days')
          .insert([{ date: isoDate }]);

        if (error) {
          throw error;
        }

        setClosedDays((prev) => [...prev, isoDate]);
        toast.success('Day closed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const dayIsClosed = selectedDate && closedDays.includes(formatISO(selectedDate));

  return (
    <div className='mx-auto max-w-xl'>
      <Toaster />
      <div className='mt-6 flex justify-center gap-6'>
        <p className={`${!enabled ? 'font-medium' : ''}`}>Opening times</p>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={classNames(
            enabled ? 'bg-indigo-600' : 'bg-gray-200',
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          )}
        >
          <span className='sr-only'>Use setting</span>
          <span
            aria-hidden='true'
            className={classNames(
              enabled ? 'translate-x-5' : 'translate-x-0',
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
            )}
          />
        </Switch>
        <p className={`${enabled ? 'font-medium' : ''}`}>Opening days</p>
      </div>

      {!enabled ? (
        <div className='my-12 flex flex-col gap-8'>
          {openingHrs.map((day) => (
            <div className='grid grid-cols-3 place-items-center' key={day.name}>
              <h3 className='font-semibold'>{capitalize(day.name)}</h3>
              <div className='mx-4'>
                <TimeSelector
                  type='openTime'
                  changeTime={(time) => handleChangeTime(day.name, 'openTime', time)}
                  selected={day.openTime}
                />
              </div>
              <div className='mx-4'>
                <TimeSelector
                  type='closeTime'
                  changeTime={(time) => handleChangeTime(day.name, 'closeTime', time)}
                  selected={day.closeTime}
                />
              </div>
            </div>
          ))}

          <Button
            onClick={handleSaveOpeningHrs}
            isLoading={false}
            colorScheme='green'
            variant='solid'
          >
            Save
          </Button>
        </div>
      ) : (
        <div className='mt-6 flex flex-col items-center gap-6'>
          <Calendar
            minDate={new Date()}
            className='REACT-CALENDAR p-2'
            view='month'
            onClickDay={(date) => setSelectedDate(date)}
            tileClassName={({ date }) => (closedDays.includes(formatISO(date)) ? 'closed-day' : null)}
          />

          <Button
            onClick={() => handleToggleDay(selectedDate)}
            disabled={!selectedDate}
            isLoading={false}
            colorScheme='green'
            variant='solid'
          >
            {dayIsClosed ? 'Open shop this day' : 'Close shop this day'}
          </Button>
        </div>
      )}
    </div>
  );
};


export default Opening;
