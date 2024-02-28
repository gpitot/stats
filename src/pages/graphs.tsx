import { Autocomplete, Select, Stack, Typography, Option } from "@mui/joy";
import { useGetUserStats } from "api/stats";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { uniq } from "lodash";
import {
  addDays,
  addHours,
  addMinutes,
  addWeeks,
  addYears,
  format,
  intervalToDuration,
} from "date-fns";
import { Logs } from "pages/logs";
import { Link } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const stringToColour = (str: string) => {
  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  return colour;
};

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};
type ScaleTypes = "minute" | "hour" | "day" | "week" | "year";
const getNearest = (d: Date, scale: ScaleTypes) => {
  const date = new Date(d);
  date.setMilliseconds(0);
  if (scale === "minute") {
    date.setSeconds(0);
  }
  if (scale === "hour") {
    date.setMinutes(0);
    date.setSeconds(0);
  }
  if (scale === "day") {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
  }
  if (scale === "week") {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setDate(date.getDate() - date.getDay());
  }
  if (scale === "year") {
    date.setMonth(0);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
  }
  return date;
};

const getIntervalBetween = (start: Date, end: Date, scale: ScaleTypes) => {
  const interval = intervalToDuration({
    start: start,
    end: end,
  });
  if (scale === "minute") {
    return interval.minutes;
  }
  if (scale === "hour") {
    return interval.hours;
  }
  if (scale === "day") {
    return interval.days;
  }
  if (scale === "week") {
    return interval.weeks;
  }
  if (scale === "year") {
    return interval.years;
  }
  throw new Error("Invalid scale");
};

const getRange = (start: Date, end: Date, scale: ScaleTypes) => {
  const interval = getIntervalBetween(start, end, scale);
  if (!interval) {
    return [start];
  }
  const range = [];
  for (let i = -1; i <= interval + 1; i++) {
    if (scale === "minute") {
      range.push(addMinutes(start, i));
    }
    if (scale === "hour") {
      range.push(addHours(start, i));
    }
    if (scale === "day") {
      range.push(addDays(start, i));
    }
    if (scale === "week") {
      range.push(addWeeks(start, i));
    }
    if (scale === "year") {
      range.push(addYears(start, i));
    }
  }
  return range;
};

const Graph: React.FC<{
  data: {
    created_at: string;
    units: number;
    notes: string | null;
    stats: {
      name: string;
    } | null;
  }[];
  dataSetNames: string[] | null;
  scale: ScaleTypes;
}> = ({ data, dataSetNames, scale }) => {
  if (!dataSetNames || dataSetNames.length === 0) return null;
  const selectedData = data.filter((d) => dataSetNames.includes(d.stats!.name));
  const dateScale = uniq(selectedData.map((d) => d.created_at))
    .map((d) => getNearest(new Date(d), scale))
    .reverse();

  const range = getRange(dateScale[0], dateScale[dateScale.length - 1], scale);

  const graphData = {
    labels: range.map((d) => `${format(d, "MM/dd/yyyy k m")}`),
    datasets: dataSetNames.map((name) => {
      const filteredData = data.filter((d) => d.stats!.name === name);

      const dataPoints = range.map((date) => {
        const currentDate = date.getTime();
        const total = filteredData.reduce((acc, d) => {
          const currentTime = getNearest(
            new Date(d.created_at),
            scale
          ).getTime();

          if (currentTime === currentDate) {
            return acc + d.units;
          }
          return acc;
        }, 0);
        return total;
      });

      const color = stringToColour(name);

      return {
        label: name,
        data: dataPoints,
        backgroundColor: color,
        borderColor: color,
      };
    }),
  };
  return <Line data={graphData} options={options} />;
};

export const Graphs: React.FC = () => {
  const { data, isLoading } = useGetUserStats();

  const [selected, setSelected] = useState<string[] | null>(null);
  const handleSelectStat = (_: unknown, value: string[] | null) => {
    if (value) {
      setSelected(value);
    }
  };

  const [scale, setScale] = useState<ScaleTypes>("day");
  const handleSelectScale = (_: unknown, value: string | null) => {
    if (value) {
      setScale(value as ScaleTypes);
    }
  };

  if (!data && isLoading) {
    return <Typography>Loading...</Typography>;
  }
  if (!data) {
    return <Typography>No stats yet</Typography>;
  }

  const autoCompleteOptions = uniq(data.map((d) => d.stats!.name));

  return (
    <Stack spacing={2}>
      <Typography level="h1">Graph</Typography>
      <Autocomplete
        type="search"
        multiple
        options={autoCompleteOptions}
        onChange={handleSelectStat}
      />
      <Select defaultValue="day" onChange={handleSelectScale}>
        <Option value="hour">Hour</Option>
        <Option value="day">Day</Option>
        <Option value="week">Week</Option>
      </Select>
      <Graph data={data} dataSetNames={selected} scale={scale} />

      <Logs data={data.filter((d) => selected?.includes(d.stats!.name))} />
      <footer
        className={`
        fixed bottom-0 
        left-0 w-full py-4 bg-blue-500 text-white 
        flex justify-around`}
      >
        <Link to="add">Add a stat</Link>
      </footer>
    </Stack>
  );
};
