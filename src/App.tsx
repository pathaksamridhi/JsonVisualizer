// App.tsx
import { Container, Typography, Paper, TextField } from "@mui/material";
import Grid from "@mui/material/Grid"; // <-- Add this line explicitly
import JsonAccordion from "./components/JsonAccordion";
import { data as defaultData } from "./data/nestedData";
import { useState } from "react";


function setValueAtPath(obj: any, path: string, value: any): any {
  if (!path) return value;
  const parts = path.split(".");
  const newObj = Array.isArray(obj) ? [...obj] : { ...obj };
  let curr = newObj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (Array.isArray(curr)) {
      curr[p as any as number] = Array.isArray(curr[p as any as number]) ? [...curr[p as any as number]] : { ...curr[p as any as number] };
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
  const [jsonInput, setJsonInput] = useState(JSON.stringify(defaultData.Test, null, 2));
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
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        JSON Visualizer
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <TextField
              fullWidth
              multiline
              minRows={20}
              label="Edit Raw JSON"
              value={jsonInput}
              onChange={onInputChange}
              error={!!jsonError}
              helperText={jsonError || "Valid JSON required"}
            />
            <TextField
              fullWidth
              label="Search Keys or Values"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <JsonAccordion
              title="Test"
              data={userJson}
              search={search}
              editable={true}
              setUserJsonByPath={setUserJsonByPath}
              jsonPath=""
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
