import {
  Autocomplete,
  FormLabel,
  Input,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import {
  useAddNewStatType,
  useAddUserStat,
  useSearchStatTypes,
} from "api/stats";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Add: React.FC = () => {
  const [query, setQuery] = useState("");
  const [reps, setReps] = useState("0");
  const [note, setNotes] = useState("");
  const { data } = useSearchStatTypes(query);
  const { mutate } = useAddUserStat();
  const { mutateAsync } = useAddNewStatType();

  const navigate = useNavigate();

  const updateReps = (amount: number) => {
    if (parseInt(reps, 10) + amount < 0) return;
    setReps((prevReps) => (parseInt(prevReps, 10) + amount).toString());
  };

  const handleChange = (_: React.SyntheticEvent, value: string) => {
    setQuery(value);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.length < 1) return;
    let statId = data?.find((stat) => stat.name === query)?.id;
    if (!statId) {
      const { id } = await mutateAsync(query);
      statId = id;
    }
    const units = parseInt(reps, 10);
    mutate({ stat_id: statId, units, notes: note });
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography level="h1">Add a stat</Typography>
        <div>
          <FormLabel>Search for a stat</FormLabel>
          <Autocomplete
            freeSolo
            size="lg"
            options={data?.map((d) => d.name) ?? []}
            onInputChange={handleChange}
            open={query === ""}
          />
        </div>
        <div>
          <FormLabel>How many reps?</FormLabel>
          <Input
            size="lg"
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
          <div className="flex pt-4 space-x-4">
            <button
              type="button"
              className="bg-red-500 p-2 rounded-sm text-white shadow-md w-12"
              onClick={() => updateReps(-10)}
            >
              -10
            </button>
            <button
              type="button"
              className="bg-red-500 p-2 rounded-sm text-white shadow-md w-12"
              onClick={() => updateReps(-5)}
            >
              -5
            </button>
            <button
              type="button"
              className="bg-green-700 p-2 rounded-sm text-white shadow-md w-12"
              onClick={() => updateReps(5)}
            >
              +5
            </button>
            <button
              type="button"
              className="bg-green-700 p-2 rounded-sm text-white shadow-md w-12"
              onClick={() => updateReps(10)}
            >
              +10
            </button>
          </div>
        </div>
        <div>
          <FormLabel>Any notes?</FormLabel>
          <Textarea
            minRows={10}
            size="lg"
            value={note}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="fixed left-0 bottom-4 w-full h-20 z-10 space-x-4 flex justify-center">
          <Link to="/">
            <button className="bg-red-500 text-red rounded-full self-center w-20 h-20 text-3xl text-white">
              x
            </button>
          </Link>
          <button
            type="submit"
            className="bg-green-700 text-red rounded-full self-center w-20 h-20 text-3xl text-white"
          >
            +
          </button>
        </div>
      </Stack>
    </form>
  );
};
