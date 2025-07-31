// components/KeyValueDataGrid.tsx
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, TextField } from "@mui/material";
import React from "react";

interface Props {
  data: Record<string, any>[];
  editable?: boolean;
  onArrayEdit?: (rowIdx: number, field: string, value: any) => void;
  onPrimitiveEdit?: (key: string, value: any) => void;
}

const KeyValueDataGrid: React.FC<Props> = ({
  data,
  editable = false,
  onArrayEdit,
  onPrimitiveEdit,
}) => {
  if (!data || data.length === 0) return null;

  const allKeys = new Set<string>();
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      allKeys.add(key); // Include all keys including 'id'
    });
  });

  const columns: GridColDef[] = Array.from(allKeys).map((key) => ({
    field: key,
    headerName: key,
    flex: 1,
    minWidth: 120,
    editable,
    renderCell: (params: GridRenderCellParams) =>
      editable ? (
        onArrayEdit ? (
          <TextField
            variant="standard"
            value={params.value ?? ""}
            onChange={(e) =>
              onArrayEdit(params.id as number, key, e.target.value)
            }
            sx={{ minWidth: 120 }}
          />
        ) : onPrimitiveEdit ? (
          <TextField
            variant="standard"
            value={params.value ?? ""}
            onChange={(e) => onPrimitiveEdit(key, e.target.value)}
            sx={{ minWidth: 120 }}
          />
        ) : (
          String(params.value)
        )
      ) : (
        <span>{String(params.value ?? "")}</span>
      ),
  }));

  const rows = data.map((row, index) => ({
    id: row.id ?? index,
    ...row,
  }));

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        disableColumnMenu
        hideFooter
        sx={{
          width: "100%",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgba(0,0,0,0.05)",
          },
        }}
      />
    </Box>
  );
};

export default KeyValueDataGrid;
