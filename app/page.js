'use client'
import { useState } from "react";
import Calendar from "./components/calendar/Calendar";
import Spinner from "./components/Spinner";

export default function Home() {
  const [date, setDate] = useState({
    justDate: null, 
    dateTime: null
  })
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {!date.dateTime && <Calendar setDate={setDate} date={date}/>}
      {date.dateTime && false ? (
        <Menu/>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <Spinner/>
        </div>
      )}
    </main>
  );
}
