import { Autocomplete, Stack, Typography } from "@mui/joy";
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
}> = ({ data, dataSetNames }) => {
  if (!dataSetNames) return null;
  const selectedData = data.filter((d) => dataSetNames.includes(d.stats!.name));
  const labels = uniq(selectedData.map((d) => d.created_at));
  const graphData = {
    labels: uniq(labels.map((d) => new Date(d).toISOString())),
    datasets: dataSetNames.map((name) => {
      const filteredData = data.filter((d) => d.stats!.name === name);
      const dataPoints = labels.map((label) => {
        if (filteredData.some((d) => d.created_at === label)) {
          return filteredData.find((d) => d.created_at === label)!.units;
        }
        return 0;
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
    console.log("value ", value);
    if (value) {
      setSelected(value);
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
    <Stack>
      <Typography level="h1">Graph</Typography>
      <Autocomplete
        type="search"
        multiple
        options={autoCompleteOptions}
        onChange={handleSelectStat}
      />
      <Graph data={data} dataSetNames={selected} />
    </Stack>
  );
};
