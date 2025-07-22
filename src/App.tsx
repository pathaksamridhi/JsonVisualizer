import { Container, Typography, Box, Paper, TextField } from "@mui/material";
import JsonAccordion from "./components/JsonAccordion";
import { data as defaultData } from "./data/nestedData";
import { useState } from "react";

// Helper for immutable deep set by path (dot notation with array, e.g. "orders.1.items.0.price")
function setValueAtPath(obj: any, path: string, value: any): any {
  if (!path) return value;
  const parts = path.split(".");
  const newObj = Array.isArray(obj) ? [...obj] : { ...obj };
  let curr = newObj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (Array.isArray(curr)) {
      // numeric
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

  // Handler for deep editing
  const setUserJsonByPath = (path: string, value: any) => {
    setUserJson((prev: any) => setValueAtPath(prev, path, value));
    setJsonInput((_) => JSON.stringify(setValueAtPath(userJson, path, value), null, 2));
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ borderRadius: 3, p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            JSON Visualizer
          </Typography>
          {/* JSON Input Field */}
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Paste or edit JSON here..."
            value={jsonInput}
            onChange={onInputChange}
            error={!!jsonError}
            helperText={jsonError || "Enter valid JSON root object/array"}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Search keys or values..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
          />
        </Box>
        <JsonAccordion
          title="Test"
          data={userJson}
          search={search}
          editable={true}
          setUserJsonByPath={setUserJsonByPath}
          jsonPath=""
        />
      </Paper>
    </Container>
  );
}

export default App;
