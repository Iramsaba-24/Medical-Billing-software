import {
  Box,
  Checkbox,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  Tooltip,
  TablePagination,
  TableRow,
  TextField,
  type TableCellProps,
  type SxProps,
} from "@mui/material";
import { useMemo, useState, type ReactNode } from "react";
import { IconTrashX } from "@tabler/icons-react";
import ExportIcons from "@/utils/ExportIcons";
import { iconMap } from "@/utils/Icons";
 
export const ACTION_KEY = "actionbutton" as const;
 
export type Column<T> = {
  key: keyof T | typeof ACTION_KEY | string;
  label: string;
  render?: (row: T) => ReactNode;
  exportable?: boolean;
};
 
export type DropdownOption = {
  value: string;
  label: string;
  bgColor?: string;
  textColor?: string;
};
 
export type FooterRow = {
  content: Array<{ value: ReactNode; colSpan?: number }>;
};
 
interface TableStyles {
  captionSx?: SxProps;
  headerSx?: SxProps;
  rowHoverSx?: SxProps;
  paperSx?: SxProps;
}
 
interface UniversalTableProps<T extends Record<string, unknown>>
  extends TableStyles {
  data: readonly T[];
  columns: readonly Column<T>[];
  caption?: ReactNode;
  rowsPerPage?: number;
  tableSize?: "small" | "medium";
  textAlign?: TableCellProps["align"];
  showSearch?: boolean;
  showExport?: boolean;
  enableCheckbox?: boolean;
  highlightColor?: string;
  getRowId?: (row: T, index: number) => string | number;
  onSelectionChange?: (rows: T[]) => void;
  onDeleteSelected?: (rows: T[]) => void;
 
  dropdown?: {
    key: keyof T;
    options: readonly DropdownOption[];
    onChange?: (row: T, value: T[keyof T]) => void;
    disabled?: boolean | ((row: T) => boolean);
    width?: number;
    sx?: SxProps;
  };
 
  autoUpdateDropdown?: boolean;
  onDataChange?: (rows: T[]) => void;
 
  actions?: Partial<Record<keyof typeof iconMap, (row: T) => void>>;
  footerRows?: readonly FooterRow[];
}
 
function buildExportData<T extends Record<string, unknown>>(
  rows: readonly T[],
  columns: readonly Column<T>[]
) {
  return rows.map((row) =>
    columns.reduce((acc, col) => {
      if (col.key !== ACTION_KEY && col.exportable !== false) {
        acc[col.label] = row[col.key];
      }
      return acc;
    }, {} as Record<string, unknown>)
  );
}
 
export function UniversalTable<T extends Record<string, unknown>>({
  data,
  columns,
  caption,
  rowsPerPage = 5,
  tableSize = "medium",
  textAlign = "left",
  showSearch = false,
  showExport = false,
  enableCheckbox = false,
  getRowId,
  onSelectionChange,
  onDeleteSelected,
  dropdown,
  autoUpdateDropdown,
  onDataChange,
  actions,
  footerRows = [],
  captionSx,
  headerSx,
  rowHoverSx,
  paperSx,
  highlightColor = "#ffff00",
}: UniversalTableProps<T>) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set()
  );
 
  const resolveRowId = (row: T, index: number) =>
    getRowId ? getRowId(row, index) : index;
 
  const highlightText = (text: string | number | null | undefined): ReactNode =>
    !search || text == null
      ? text
      : text
          .toString()
          .split(new RegExp(`(${search})`, "gi"))
          .map((part, i) =>
            i % 2 ? (
              <mark key={i} style={{ background: highlightColor }}>
                {part}
              </mark>
            ) : (
              part
            )
          );
 
  const DEFAULT_DROPDOWN_SX: SxProps = {
    width: { xs:110, md:150 }, //width
    bgcolor: "#1f2937",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: {xs:11, md:13}, //font
    borderRadius: 2,
    "& .MuiSelect-icon": { color: "#a9a2a2ff" },
  };
 
  const filteredData = useMemo(() => {
    if (!search) return data;
 
    return data.filter((row) =>
      columns.some((col) => {
        if (col.key === ACTION_KEY) return false;
 
        const value = row[col.key];
        return String(value ?? "")
          .toLowerCase()
          .includes(search.toLowerCase());
      })
    );
  }, [data, columns, search]);
 
  const paginatedData = useMemo(
    () =>
      filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredData, page, rowsPerPage]
  );
 
  const exportData = useMemo(
    () => buildExportData(filteredData, columns),
    [filteredData, columns]
  );
 
  const exportColumns = useMemo(
    () =>
      columns
        .filter((c) => c.key !== ACTION_KEY && c.exportable !== false)
        .map((c) => ({ key: c.label, label: c.label })),
    [columns]
  );
 
  const selectedRows = data.filter((_, i) =>
    selectedIds.has(resolveRowId(_, i))
  );
 
  const toggleRow = (row: T, index: number) => {
    const id = resolveRowId(row, index);
    const updated = new Set(selectedIds);
 
    updated.has(id) ? updated.delete(id) : updated.add(id);
 
    setSelectedIds(updated);
    onSelectionChange?.(data.filter((r, i) => updated.has(resolveRowId(r, i))));
  };
 
  const toggleAll = (checked: boolean) => {
    const updated = new Set<string | number>();
    if (checked) data.forEach((r, i) => updated.add(resolveRowId(r, i)));
    setSelectedIds(updated);
    onSelectionChange?.(checked ? [...data] : []);
  };
 
  const updateRow = (row: T, patch: Partial<T>) => {
    if (!onDataChange) return;
 
    const targetId = resolveRowId(row, -1);
 
    onDataChange(
      data.map((r, i) =>
        resolveRowId(r, i) === targetId ? { ...r, ...patch } : r
      )
    );
  };
 
  return (
    <Paper sx={{ borderRadius: 3, boxShadow: 4, ...paperSx }}>
      {(showSearch || showExport) && (
        <Box
          sx={{
            px: { xs:1, md:2 }, //padding
            py: 2,
            display: "flex",
            justifyContent: {
              xs: "center",
              md: showSearch ? "space-between" : "flex-end",
            },
            flexDirection: { xs:"column", md:"row" }, //layout
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {showSearch && (
            <TextField
              variant="standard"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              sx={{ 
                minWidth: { xs:"100%", md:220} //width
               }}
            />
          )}
 
          {showExport && (
            <ExportIcons
              data={exportData}
              columns={exportColumns}
              filename="Export"
              iconSize={22}
            />
          )}
        </Box>
      )}
 
      {caption && (
        <Box
          sx={{
            bgcolor: "#0ca678",
            color: "#fff",
            fontWeight: 700,
            fontSize: { xs:14, md:18 }, //text
            borderRadius: showSearch || showExport ? "" : "6px 6px 0 0",
            textAlign: "center",
            py: 1,
            ...captionSx,
          }}
        >
          {caption}
        </Box>
      )}
 
      <TableContainer >
        <Table size={tableSize}
        sx={{overflowY: "auto"}}
        >
          <TableHead>
            <TableRow>
              {enableCheckbox && paginatedData.length > 0 && (
                <TableCell padding="checkbox" sx={{ bgcolor: "#444748ff" }}>
                  <Checkbox
                    indeterminate={
                      selectedIds.size > 0 && selectedIds.size < data.length
                    }
                    checked={
                      data.length > 0 && selectedIds.size === data.length
                    }
                    onChange={(e) => toggleAll(e.target.checked)}
                    sx={{ color: "#fff" }}
                  />
                </TableCell>
              )}
 
              {columns.map((col) => (
                <TableCell
                  key={String(col.key)}
                  align={textAlign}
                  sx={{
                    fontWeight: 700,
                    bgcolor: "#444748ff",
                    color: "#ffffff",
                    ...headerSx,
                    whiteSpace: "nowrap", 
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
 
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => {
                const rowId = resolveRowId(row, index);
 
                return (
                  <TableRow
                    key={rowId}
                    hover
                    sx={{ "&:hover": { bgcolor: "#e6f4ea" }, ...rowHoverSx, 
                  
                  }}
                  >
                    {enableCheckbox && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIds.has(rowId)}
                          onChange={() => toggleRow(row, index)}
                        />
                      </TableCell>
                    )}
 
                    {columns.map((col) => {
                      /* Dropdown */
                      if (
                        dropdown &&
                        col.key === dropdown.key &&
                        col.key !== ACTION_KEY
                      ) {
                        return (
                          <TableCell key={String(col.key)} align={textAlign}>
                            <Select
                              size="small"
                              value={row[col.key] as string}
                              sx={{
                                ...DEFAULT_DROPDOWN_SX,
                                bgcolor: DEFAULT_DROPDOWN_SX.bgcolor as string,
                                color: DEFAULT_DROPDOWN_SX.color as string,
                                width:
                                  dropdown.width ??
                                  (DEFAULT_DROPDOWN_SX.width as number),
                                ...dropdown.sx,
                              }}
                              onChange={(e) => {
                                const value = e.target.value as T[keyof T];
                                dropdown.onChange?.(row, value);
                                if (!dropdown.onChange && autoUpdateDropdown) {
                                  updateRow(row, {
                                    [dropdown.key]: value,
                                  } as Partial<T>);
                                }
                              }}
                            >
                              {dropdown.options.map((o) => (
                                <MenuItem key={o.value} value={o.value}>
                                  {o.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </TableCell>
                        );
                      }
 
                      /* Actions */
                      if (col.key === ACTION_KEY && actions) {
                        return (
                          <TableCell key={ACTION_KEY}>
                            <Box display="flex" gap={1}>
                              {Object.entries(iconMap).map(([k, cfg]) =>
                                actions[k as keyof typeof iconMap] ? (
                                  <Tooltip key={k} title={cfg.label}>
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        actions[k as keyof typeof iconMap]?.(
                                          row
                                        )
                                      }
                                      sx={{ color: cfg.color }}
                                    >
                                      {cfg.icon}
                                    </IconButton>
                                  </Tooltip>
                                ) : null
                              )}
                            </Box>
                          </TableCell>
                        );
                      }
 
                      /* Default */
                      if (col.key === ACTION_KEY) return null;
 
                      return (
                        <TableCell key={String(col.key)} align={textAlign}>
                          {col.render
                            ? col.render(row)
                            : highlightText(String(row[col.key] ?? ""))}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
 
          {footerRows.length > 0 && (
            <TableFooter>
              {footerRows.map((f, i) => (
                <TableRow key={i}>
                  {f.content.map((c, j) => (
                    <TableCell key={j} colSpan={c.colSpan}>
                      {c.value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          )}
        </Table>
      </TableContainer>
 
      <Box
        sx={{
          display: "flex",
          justifyContent:
            enableCheckbox && selectedRows.length > 0
              ? "space-between"
              : "flex-end",
          px: 1,
        }}
      >
        {enableCheckbox && selectedRows.length > 0 && onDeleteSelected && (
          <Tooltip
            title={
              selectedRows.length === data.length
                ? "Delete All Records"
                : `Delete ${selectedRows.length} record${
                    selectedRows.length > 1 ? "s" : ""
                  }`
            }
          >
            <IconButton
              color="error"
              onClick={() => {
                onDeleteSelected(selectedRows);
                setSelectedIds(new Set());
              }}
            >
              <IconTrashX size={20} />
            </IconButton>
          </Tooltip>
        )}
 
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
        />
      </Box>
    </Paper>
  );
}
 
