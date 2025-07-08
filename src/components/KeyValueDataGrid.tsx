import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { Box } from "@mui/material";

interface Props {
  data: Record<string, any>[];
}

const KeyValueDataGrid: React.FC<Props> = ({ data }) => {
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
  }));

  // Assign a unique id but DO NOT include original `id` field in visible data
  const rows = data.map((row, index) => {
    const { id, ...rest } = row;
    return {
      id: id ?? row.orderId ?? row.productId ?? index, // required by DataGrid
      ...rest, // everything except the original "id"
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
      />
    </Box>
  );
};

export default KeyValueDataGrid;
