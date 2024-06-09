import { now, OPENING_HOURS_INTERVAL, categories } from "@/app/constants/config";
import { add, addMinutes, getHours, getMinutes, isBefore, isEqual, parse } from "date-fns";
import { createClient } from "./supabase/server";
export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const selectOptions = categories.map((category) => ({value: category, label: capitalize()}))

export const weekdayIndexToName = (index) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',]
  return days[index]
}

export function classNames(...classes){
  return classes.filter(Boolean).join(' ')
}

export const roundToNearestMinutes = (date, interval) => {
  const minutesLeftUntilNextInterval = interval - (getMinutes(date) % interval) 
  return addMinutes(date, minutesLeftUntilNextInterval)
}

/**
 * 
 * @param startDate
 * @param dbDays
 * @returns 
 */
export const fetchDaysFromSupabase = async () => {
  let { data: days, error } = await supabase
    .from('day')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  return days;
};



export const getOpeningTimes = (startDate, days) => {
  const dayOfWeek = startDate.getDay();
  const isToday = isEqual(startDate, new Date('January 15, 2023, 12:00:00').setHours(0,0,0,0))
  const today = dbDays.find((d) => d.dayOfWeek === dayOfWeek)

  if(!today) throw new Error('This day does not exist')
  
  const opening = parse(today.openTime, 'kk:mm', startDate)
  const closing = parse(today.closeTime, 'kk:mm', startDate)

  if(isToday) {
    const rounded = roundToNearestMinutes(now, OPENING_HOURS_INTERVAL)
    const tooLate = !isBefore(rounded, closing);

    if(tooLate) throw new Error('No more bookings today');
    console.log('rounded', rounded);

    const isBeforeOpening = isBefore(rounded, opening)

    hours = getHours(isBeforeOpening ? opening : rounded)
    minutes = getMinutes(isBeforeOpening ? opening : rounded)
  } else{
    hours = getHours(opening);
    minutes = getMinutes(opening)
  }
  const beginning = add(startDate, {hours, minutes})
  const end = add(startDate, { hours: getHours(closing) })
  const interval = OPENING_HOURS_INTERVAL;

  const times = []
  for(let i = beginning; i <= end; i = add(i, { minutes: interval} )){
    times.push(i)
  }
  return times;
}