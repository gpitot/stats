import {
  Autocomplete,
  Button,
  FormLabel,
  Input,
  Stack,
  Textarea,
} from "@mui/joy";
import {
  useAddNewStatType,
  useAddUserStat,
  useSearchStatTypes,
} from "api/stats";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Add: React.FC = () => {
  const [query, setQuery] = useState("");
  const [reps, setReps] = useState("0");
  const [note, setNotes] = useState("");
  const { data } = useSearchStatTypes(query);
  const { mutate } = useAddUserStat();
  const { mutateAsync } = useAddNewStatType();

  const navigate = useNavigate();

  const handleChange = (_: React.SyntheticEvent, value: string) => {
    setQuery(value);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <Stack spacing={2}>
      <form onSubmit={handleSubmit}>
        <FormLabel>Search for a stat</FormLabel>
        <Autocomplete
          type="search"
          freeSolo
          options={data?.map((d) => d.name) ?? []}
          onInputChange={handleChange}
        />
        <FormLabel>How many reps?</FormLabel>
        <Input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
        <FormLabel>Any notes?</FormLabel>
        <Textarea
          minRows={10}
          value={note}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button type="submit">Add stat</Button>
      </form>
    </Stack>
  );
};
