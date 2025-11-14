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
    required?: boolean;
}

export function DatePickerComponent({ onDateChange, defaultDate, required }: DatePickerComponentProps = {}) {
    const [date, setDate] = React.useState<Date | undefined>(defaultDate);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        setDate(defaultDate);
    }, [defaultDate]);

    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate);
        onDateChange?.(newDate);
        if (newDate) {
            setOpen(false);
        }
    };

    const handleTodayClick = () => {
        const today = new Date();
        handleDateChange(today);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!date}
                    aria-required={required}
                    className="w-full justify-between data-[empty=true]:text-muted-foreground"
                >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="min-w-[300px] p-0"
                style={{ width: "var(--radix-popover-trigger-width)", minWidth: "300px" }}
            >
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    className="w-full p-3"
                />
                <div className="border-t p-3">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleTodayClick}
                        type="button"
                    >
                        Today
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
