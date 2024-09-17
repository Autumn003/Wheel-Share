import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "./time-picker-input";

export function TimePickerDemo({ date, setDate }) {
  // Provide a fallback date if `date` is undefined
  const currentDate = date || new Date(new Date().setHours(0, 0, 0, 0));

  const minuteRef = React.useRef(null);
  const hourRef = React.useRef(null);
  const secondRef = React.useRef(null);

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-center">
          Hours
        </Label>
        <TimePickerInput
          ref={hourRef}
          value={String(currentDate.getHours()).padStart(2, "0")}
          onRightFocus={() => minuteRef.current?.focus()}
          date={currentDate}
          setDate={setDate}
          picker="hours"
        />
      </div>
      <span className="pb-2 text-muted-foreground">:</span>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-center">
          Minutes
        </Label>
        <TimePickerInput
          ref={minuteRef}
          value={String(currentDate.getMinutes()).padStart(2, "0")}
          onRightFocus={() => secondRef.current?.focus()}
          onLeftFocus={() => hourRef.current?.focus()}
          date={currentDate}
          setDate={setDate}
          picker="minutes"
        />
      </div>
      <span className="pb-2 text-muted-foreground">:</span>
      <div className="grid gap-1 text-center">
        <Label htmlFor="seconds" className="text-center">
          Seconds
        </Label>
        <TimePickerInput
          ref={secondRef}
          value={String(currentDate.getSeconds()).padStart(2, "0")}
          onLeftFocus={() => minuteRef.current?.focus()}
          date={currentDate}
          setDate={setDate}
          picker="seconds"
        />
      </div>
      <Clock className="mb-2 h-4 w-4 text-muted-foreground" />
    </div>
  );
}
