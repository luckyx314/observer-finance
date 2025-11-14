"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerComponentProps {
    onDateChange?: (date: Date | undefined) => void;
    defaultDate?: Date;
}

export function DatePickerComponent({ onDateChange, defaultDate }: DatePickerComponentProps = {}) {
    const [date, setDate] = React.useState<Date | undefined>(defaultDate);

    // Update date when defaultDate changes
    React.useEffect(() => {
        if (defaultDate) {
            setDate(defaultDate);
        }
    }, [defaultDate]);

    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate);
        if (onDateChange) {
            onDateChange(newDate);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!date}
                    className="data-[empty=true]:text-muted-foreground"
                >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={handleDateChange} />
            </PopoverContent>
        </Popover>
    );
}
