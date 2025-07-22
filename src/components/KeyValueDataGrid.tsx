import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, TextField } from "@mui/material";
import React from "react";

interface Props {
  data: Record<string, any>[];
  editable?: boolean;
  // For arrays: called with (rowIdx, field, value)
  onArrayEdit?: (rowIdx: number, field: string, value: any) => void;
  // For objects: called with (key, value)
  onPrimitiveEdit?: (key: string, value: any) => void;
}

const KeyValueDataGrid: React.FC<Props> = ({
  data,
  editable = false,
  onArrayEdit,
  onPrimitiveEdit
}) => {
  if (!data || data.length === 0) return null;

  const allKeys = new Set<string>();
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key !== "id") {
        allKeys.add(key);
      }
    });
  });

  const columns: GridColDef[] = Array.from(allKeys).map(key => ({
    field: key,
    headerName: key,
    flex: 1,
    minWidth: 120,
    maxWidth: 250,
    editable,
    renderCell: (params: GridRenderCellParams) =>
      editable
        ? (
          onArrayEdit
            ? <TextField
                variant="standard"
                value={params.value ?? ""}
                onChange={(e) => onArrayEdit(
                  params.id as number,
                  key,
                  e.target.value
                )}
                sx={{ minWidth: 120 }}
              />
            : onPrimitiveEdit
              ? <TextField
                  variant="standard"
                  value={params.value ?? ""}
                  onChange={(e) => onPrimitiveEdit(key, e.target.value)}
                  sx={{ minWidth: 120 }}
                />
              : String(params.value)
        )
        : (
          <span>{String(params.value ?? "")}</span>
        )
  }));

  // Assign a unique id but DO NOT include original `id` field in visible data
  const rows = data.map((row, index) => {
    const { id, ...rest } = row;
    return {
      id: id ?? row.orderId ?? row.productId ?? index,
      ...rest,
    };
  });

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        disableColumnMenu
        hideFooterSelectedRowCount
        hideFooter
        sx={{
          width: "100%",
          overflowX: "auto",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgba(0,0,0,0.05)",
          },
          "& .MuiDataGrid-cell": {
            fontSize: 14,
          },
        }}
        // No need for processRowUpdate with direct TextField
      />
    </Box>
  );
};

export default KeyValueDataGrid;
