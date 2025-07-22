import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  CircularProgress,
  Paper,
  useTheme,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyValueDataGrid from "./KeyValueDataGrid";

interface JsonAccordionProps {
  title: string;
  data: any;
  search?: string;
  depth?: number;
  editable?: boolean;
  setUserJsonByPath?: (path: string, value: any) => void;
  jsonPath?: string;
}

const isPrimitive = (val: any): boolean =>
  typeof val !== "object" || val === null;

const matchesSearch = (value: any, search: string): boolean => {
  if (!search) return true;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value).toLowerCase().includes(search.toLowerCase());
  }
  if (Array.isArray(value)) return value.some((v) => matchesSearch(v, search));
  if (typeof value === "object" && value !== null) {
    return Object.entries(value).some(
      ([k, v]) =>
        k.toLowerCase().includes(search.toLowerCase()) || matchesSearch(v, search)
    );
  }
  return false;
};

const JsonAccordion: React.FC<JsonAccordionProps> = ({
  title,
  data,
  search = "",
  depth = 0,
  editable = false,
  setUserJsonByPath,
  jsonPath = ""
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (search && !matchesSearch({ [title]: data }, search)) return null;

  // For primitive fields in object, allow inline editing
  const handlePrimitiveEdit = (key: string, value: any) => {
    if (setUserJsonByPath) {
      const path = jsonPath ? `${jsonPath}.${key}` : key;
      setUserJsonByPath(path, value);
    }
  };

  // For primitive fields in array rows
  const handleGridEdit = (rowIdx: number, field: string, value: any) => {
    if (!setUserJsonByPath) return;
    // Path in array
    const path = jsonPath ? `${jsonPath}.${rowIdx}.${field}` : `${rowIdx}.${field}`;
    setUserJsonByPath(path, value);
  };

  const renderObject = (obj: any, keyPrefix = "") => {
    const primitives: Record<string, any> = {};
    const nested: React.ReactNode[] = [];

    Object.entries(obj).forEach(([key, value]) => {
      if (isPrimitive(value) || (Array.isArray(value) && value.every(isPrimitive))) {
        primitives[key] = value;
      } else {
        if (!search || matchesSearch(value, search)) {
          nested.push(
            <JsonAccordion
              key={keyPrefix + key}
              title={key}
              data={value}
              search={search}
              depth={depth + 1}
              editable={editable}
              setUserJsonByPath={setUserJsonByPath}
              jsonPath={jsonPath ? `${jsonPath}.${key}` : key}
            />
          );
        }
      }
    });

    return (
      <>
        {Object.keys(primitives).length > 0 && (
          <Box sx={{ width: "100%", mb: 2 }}>
            <KeyValueDataGrid
              data={[primitives]}
              editable={editable}
              onPrimitiveEdit={handlePrimitiveEdit}
            />
          </Box>
        )}
        {nested}
      </>
    );
  };

  let content: React.ReactNode = null;

  if (Array.isArray(data)) {
    const allPrimitiveKeys = new Set<string>();
    data.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        if (isPrimitive(value) || (Array.isArray(value) && value.every(isPrimitive))) {
          allPrimitiveKeys.add(key);
        }
      });
    });

    const primitiveRows = data.map((item, idx) => {
      const row: Record<string, any> = {};
      allPrimitiveKeys.forEach((key) => {
        row[key] = item[key];
      });
      row.id = idx;
      return row;
    });

    const filteredRows = primitiveRows.filter((row) =>
      Object.values(row).some((v) => matchesSearch(v, search))
    );

    content = (
      <>
        {filteredRows.length > 0 && (
          <Box sx={{ width: "100%", mb: 2 }}>
            <KeyValueDataGrid
              data={filteredRows}
              editable={editable}
              onArrayEdit={handleGridEdit}
            />
          </Box>
        )}
        {data.map((item, idx) => {
          const nestedFields = Object.entries(item).filter(
            ([_, value]) =>
              (typeof value === "object" && value !== null && !Array.isArray(value)) ||
              (Array.isArray(value) && value.some((v) => typeof v === "object"))
          );
          return nestedFields.length > 0 ? (
            <Box key={idx} sx={{ ml: 2 }}>
              {nestedFields.map(([key, value]) => (
                <JsonAccordion
                  key={key + idx}
                  title={key}
                  data={value}
                  search={search}
                  depth={depth + 1}
                  editable={editable}
                  setUserJsonByPath={setUserJsonByPath}
                  jsonPath={jsonPath ? `${jsonPath}.${idx}.${key}` : `${idx}.${key}`}
                />
              ))}
            </Box>
          ) : null;
        })}
      </>
    );
  } else if (typeof data === "object" && data !== null) {
    content = renderObject(data);
  } else {
    content = editable && setUserJsonByPath ? (
      <TextField
        variant="standard"
        value={String(data)}
        onChange={(e) => setUserJsonByPath(jsonPath, e.target.value)}
        sx={{ minWidth: 120 }}
      />
    ) : (
      <Typography variant="body2" color="text.secondary">{String(data)}</Typography>
    );
  }

  return (
    <Box sx={{ my: 2, pl: depth * 2 }}>
      <Paper
        elevation={depth === 0 ? 3 : 1}
        sx={{ borderRadius: 2, backgroundColor: theme.palette.background.paper }}
      >
        <Accordion defaultExpanded disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: depth === 0 ? theme.palette.grey[100] : theme.palette.grey[200],
              px: 3,
              py: 1.5,
            }}
          >
            <Typography
              variant={depth === 0 ? "h6" : "subtitle1"}
              fontWeight={depth === 0 ? 600 : 500}
              sx={{ textTransform: "capitalize" }}
            >
              {title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 3, py: 2 }}>
            {loading ? <CircularProgress /> : content}
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Box>
  );
};

export default JsonAccordion;
