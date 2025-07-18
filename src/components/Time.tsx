import { useCallback, useMemo, useState } from "react";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  addDays,
  format,
  getDay,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns";
import { useEventStore } from "@/hooks/use-event";
import { cn } from "@/lib/utils";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Daily",
];

export function Calendar24() {
  const {
    day,
    filterEndDate,
    filterStartDate,
    noOfOccurances,
    setDay,
    setFilterEndDate,
    setFilterStartDate,
    setNoOfOccurances,
    setStartDate,
    startDate,
  } = useEventStore();

  const [eventList, setEventList] = useState<
    { date: Date; isWithinRange: boolean }[]
  >([]);
  const [time, setTime] = useState("10:30:00");

  const getEventList = useCallback(() => {
    if (!startDate || noOfOccurances === 0) return [];
    const currentDay = getDay(startDate!);
    let startEventDate = startDate;
    if (day !== 7) {
      const diff = (day - currentDay + 7) % 7;
      startEventDate = addDays(startDate!, diff);
    }

    const events: { date: Date; isWithinRange: boolean }[] = [];

    for (let i = 0; i < noOfOccurances; i++) {
      const eventDate = addDays(startEventDate, day !== 7 ? 7 * i : i);
      events.push({
        date: addTimeToDate(eventDate, time),
        isWithinRange:
          (!filterStartDate || eventDate >= filterStartDate) &&
          (!filterEndDate || eventDate <= filterEndDate),
      });
    }

    setEventList(events);
  }, [startDate, day, noOfOccurances, filterStartDate, filterEndDate, time]);

  function addTimeToDate(date: Date, timeString: string): Date {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    let withHours = setHours(date, hours);
    let withMinutes = setMinutes(withHours, minutes);
    let withSeconds = setSeconds(withMinutes, seconds || 0);
    return withSeconds;
  }

  return (
    <div className="flex justify-center items-center gap-16">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex justify-center items-center gap-4">
          <PopUpCalendar date={startDate} setDate={setStartDate} />
          <div className="flex flex-col gap-3">
            <Label htmlFor="time-picker" className="px-1">
              Time
            </Label>
            <Input
              type="time"
              id="time-picker"
              step="1"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              defaultValue="10:30:00"
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label className="px-1">Days</Label>
            <Select value={String(day)} onValueChange={(val) => setDay(+val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day, idx) => (
                  <SelectItem value={String(idx)}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="px-1">No. of Occurances</Label>
            <Input
              value={noOfOccurances}
              onChange={(e) => setNoOfOccurances(+e.target.value)}
              placeholder="No. of Occurances"
              type="number"
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-4">
          <PopUpCalendar date={filterStartDate} setDate={setFilterStartDate} />
          <PopUpCalendar date={filterEndDate} setDate={setFilterEndDate} />
        </div>
        <div>
          <button
            className="px-6 py-1.5 cursor-pointer bg-black text-white rounded-3xl"
            onClick={getEventList}
          >
            Generate
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-3">
        {eventList.map((event) => (
          <div
            className={cn("text-left px-3 pt-2 rounded-md gap-1 grid grid-cols-3 bg-[#eee] text-black", !event.isWithinRange && "opacity-45")}
            key={event.date.toISOString()}
          >
            <p>{format(event.date, "EEEE")}</p>
            <p>{format(event.date, "MMMM d")}</p>
            <p>{format(event.date, "yyyy: hh:mm a")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const PopUpCalendar = ({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date-picker" className="px-1">
        Date
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker"
            className="w-32 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
