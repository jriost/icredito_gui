
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, Cloud } from "lucide-react";
import { getWeather } from "@/ai/flows/get-weather-flow";
import { Skeleton } from "@/components/ui/skeleton";

export function HeaderInfo() {
  const [time, setTime] = React.useState<Date | null>(null);

  React.useEffect(() => {
    // Set initial time on client mount
    setTime(new Date());

    // Update time every second
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const { data: weather, isLoading: isLoadingWeather } = useQuery({
    queryKey: ["simulatedWeatherMedellin"],
    queryFn: () => getWeather({ location: "Medellín, Antioquia" }),
    // This is now simulated, so we don't need to refetch often, but we keep it for demonstration.
    refetchInterval: 1000 * 60 * 15,
    staleTime: 1000 * 60 * 15,
  });

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Clock className="h-4 w-4" />
        {time ? (
          <span className="tabular-nums">
            {format(time, "HH:mm:ss")}
          </span>
        ) : (
          <Skeleton className="h-4 w-16" />
        )}
      </div>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Cloud className="h-4 w-4" />
        {isLoadingWeather ? (
          <Skeleton className="h-4 w-24" />
        ) : weather ? (
          <span className="tabular-nums">
            {weather.temperature}°C, {weather.condition}
          </span>
        ) : (
          <span className="text-xs">Clima no disponible</span>
        )}
      </div>
    </div>
  );
}
