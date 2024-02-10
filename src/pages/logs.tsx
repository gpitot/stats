import { Card, Stack, Typography } from "@mui/joy";
import { useGetUserStats } from "api/stats";
import React from "react";

const Log: React.FC<{
  name: string;
  units: number;
  notes: string | null;
  createdAt: Date;
}> = ({ name, units, notes, createdAt }) => (
  <Card variant="outlined" sx={{ maxWidth: 400 }}>
    <Typography level="h1">{name}</Typography>
    <Typography level="h2" fontSize={"xl"}>
      {units} reps
    </Typography>
    {notes && <Typography>{notes}</Typography>}
    <Typography level="h3" fontSize="sm">
      {createdAt.toDateString()}
    </Typography>
  </Card>
);

export const Logs: React.FC = () => {
  const { data, isLoading } = useGetUserStats();
  if (!data && isLoading) {
    return <Typography>Loading...</Typography>;
  }
  if (!data) {
    return <Typography>No logs yet</Typography>;
  }
  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Typography level="h1">Logbook</Typography>
      {data
        .filter((d) => d.stats?.name)
        .map((log) => (
          <Log
            key={log.created_at.toString()}
            name={log.stats!.name}
            units={log.units}
            notes={log.notes}
            createdAt={new Date(log.created_at)}
          />
        ))}
    </Stack>
  );
};
