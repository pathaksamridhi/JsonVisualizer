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
  data.forEach((item) => Object.keys(item).forEach((k) => allKeys.add(k)));

  const isArrayMode = !!onArrayEdit;

  const columns: GridColDef[] = Array.from(allKeys).map((key) => ({
    field: key,
    headerName: key,
    flex: 1,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams) =>
      editable ? (
        <TextField
          variant="standard"
          value={params.value ?? ""}
          onChange={(e) => {
            const newValue = e.target.value;
            if (isArrayMode) {
              onArrayEdit?.(params.row.rowId as number, key, newValue);
            } else {
              onPrimitiveEdit?.(key, newValue);
            }
          }}
          sx={{ minWidth: 120 }}
        />
      ) : (
        <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {String(params.value ?? "")}
        </span>
      ),
  }));

  const rows = data.map((row, idx) => ({ rowId: idx, ...row }));

  return (
    <Box
      sx={{
        width: "100%",
        "& .MuiDataGrid-root": {
          borderRadius: 2,
          overflow: "hidden",
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "rgba(0,0,0,0.08)",
          fontWeight: 600,
        },
        "& .MuiDataGrid-cell": {
          whiteSpace: "normal !important",
          wordBreak: "break-word !important",
          lineHeight: "1.5em",
          alignItems: "flex-start",
        },
        "& .MuiDataGrid-row": {
          maxHeight: "none !important",
        },
      }}
    >
      <DataGrid
        autoHeight
        rows={rows}
        getRowId={(row) => row.rowId}
        columns={columns}
        disableColumnMenu
        hideFooter
        rowHeight={60}       // spacious rows
        disableVirtualization // render all rows fully, no scrollbars
      />
    </Box>
  );
};

export default KeyValueDataGrid;
