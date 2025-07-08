// App.tsx
import { Container, Typography, Box, Paper, TextField } from "@mui/material";
import JsonAccordion from "./components/JsonAccordion";
import { data } from "./data/nestedData";
import { useState } from "react";

function App() {
  const [search, setSearch] = useState("");

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ borderRadius: 3, p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            JSON Visualizer
          </Typography>
          <TextField
            fullWidth
            label="Search keys or values..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
          />
        </Box>

        <JsonAccordion title="Test" data={data.Test} search={search} />
      </Paper>
    </Container>
  );
}

export default App;