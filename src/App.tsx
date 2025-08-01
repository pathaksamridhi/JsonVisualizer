import { Container, Typography, Box, Paper, TextField } from "@mui/material";
import JsonAccordion, { matchesSearch } from "./components/JsonAccordion";
import { data as defaultData } from "./data/nestedData";
import { useState } from "react";

// Deeply sets a value at a given JSON path
function setValueAtPath(obj: any, path: string, value: any): any {
  if (!path) return value;
  const parts = path.split(".");
  const newObj = Array.isArray(obj) ? [...obj] : { ...obj };
  let curr = newObj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (Array.isArray(curr)) {
      curr[p as any as number] = Array.isArray(curr[p as any as number])
        ? [...curr[p as any as number]]
        : { ...curr[p as any as number] };
      curr = curr[p as any as number];
    } else {
      curr[p] = Array.isArray(curr[p]) ? [...curr[p]] : { ...curr[p] };
      curr = curr[p];
    }
  }
  const key = parts[parts.length - 1];
  if (Array.isArray(curr)) {
    curr[key as any as number] = value;
  } else {
    curr[key] = value;
  }
  return newObj;
}

function App() {
  const [search, setSearch] = useState("");
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(defaultData.Test, null, 2)
  );
  const [userJson, setUserJson] = useState<any>(defaultData.Test);
  const [jsonError, setJsonError] = useState("");

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setJsonInput(value);
    try {
      const parsed = JSON.parse(value);
      setUserJson(parsed);
      setJsonError("");
    } catch (err) {
      setJsonError("Invalid JSON");
    }
  };

  const setUserJsonByPath = (path: string, value: any) => {
    setUserJson((prev: any) => {
      const updated = setValueAtPath(prev, path, value);
      setJsonInput(JSON.stringify(updated, null, 2));
      return updated;
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ borderRadius: 3, p: 4 }}>
        <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
          JSON Visualizer
        </Typography>

        <TextField
          fullWidth
          label="Search keys or values..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          sx={{ mb: 4 }}
        />

        <Box sx={{ display: "flex", gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              multiline
              minRows={20}
              label="Raw JSON"
              value={jsonInput}
              onChange={onInputChange}
              error={!!jsonError}
              helperText={jsonError || "Edit JSON to auto-update viewer"}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            {matchesSearch({ Test: userJson }, search) ? (
              <JsonAccordion
                title="Test"
                data={userJson}
                search={search}
                editable
                setUserJsonByPath={setUserJsonByPath}
              />
            ) : (
              <Typography variant="body1" color="text.secondary">
                No results match your search.
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default App;
