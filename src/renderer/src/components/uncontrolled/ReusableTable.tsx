import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Paper,
  IconButton,
  Select,
  MenuItem,
  Box,
  Tooltip,
  type TableContainerProps,
  type SxProps
} from '@mui/material';
import { type Theme } from '@mui/material/styles';
import { useEffect, useState, useMemo, type ReactNode, type JSX } from 'react';
import ExportIcons from '../../utils/ExportIcons';
import { Download, Upload, Print, RestartAlt, ContentCopy } from '@mui/icons-material';
import {
  IconCircleCheck,
  IconCircleX,
  IconEyeSearch,
  IconLibraryPlus,
  IconPencilMinus,
  IconShare3,
  IconTrashX,
  IconSend,
  IconPhone
} from '@tabler/icons-react';

const iconMap = {
  onView: { icon: <IconEyeSearch stroke={2} />, label: 'View', color: 'primary' },
  onEdit: { icon: <IconPencilMinus stroke={2} />, label: 'Edit', color: 'success' },
  onDownload: { icon: <Download />, label: 'Download', color: 'success' },
  onUpload: { icon: <Upload />, label: 'Upload', color: 'warning' },
  onShare: { icon: <IconShare3 stroke={2} />, label: 'Share', color: 'secondary' },
  onPrint: { icon: <Print />, label: 'Print', color: 'inherit' },
  onApprove: { icon: <IconCircleCheck stroke={2} />, label: 'Approve', color: 'success' },
  onReject: { icon: <IconCircleX stroke={2} />, label: 'Reject', color: 'error' },
  onAdd: { icon: <IconLibraryPlus stroke={2} />, label: 'Add', color: 'primary' },
  onReset: { icon: <RestartAlt />, label: 'Reset', color: 'warning' },
  onCopy: { icon: <ContentCopy />, label: 'Copy', color: 'success' },
  onSend: { icon: <IconSend stroke={2} />, label: 'Send', color: 'primary' },
  onCall: { icon: <IconPhone stroke={2} />, label: 'FollowUp', color: 'success' },
  onDelete: { icon: <IconTrashX stroke={2} />, label: 'Delete', color: 'error' }
};

export type TableColumn<T> = {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  headerSx?: SxProps<Theme>;
  rowSx?: SxProps<Theme>;
};

export type DropdownOption = {
  value: string;
  label: string;
  bgColor?: string;
  textColor?: string;
  hoverColor?: string;
};

export type FooterRow = {
  content: Array<{ value: ReactNode; colSpan?: number; sx?: SxProps<Theme> }>;
  sx?: SxProps<Theme>;
};

export interface ReusableTableProps<T> extends Omit<TableContainerProps, 'children'> {
  data: T[];
  columns: TableColumn<T>[];
  rowsPerPage?: number;
  onRowClick?: (row: T, index: number) => void;
  actions?: Partial<Record<keyof typeof iconMap, (row: T, index: number) => void>>;
  dropdown?: {
    options: DropdownOption[];
    defaultLabel?: string;
    onChange?: (row: T, value: string) => void;
    getValue?: (row: T) => string;
    sx?: SxProps<Theme>;
    editable?: boolean;
  };
  footerRows?: FooterRow[];
  showSearch?: boolean;
  showExport?: boolean;
  customExportColumns?: TableColumn<T>[];
  caption?: ReactNode;
  captionSx?: SxProps<Theme>;
  highlightColor?: string;
  textAlignment?: 'left' | 'center' | 'right';
  tableSize?: 'small' | 'medium';
  onFilteredDataChange?: (rows: T[]) => void;
}

const getCellValue = <T,>(row: T, key: string): unknown => (row as Record<string, unknown>)[key];

function ReusableTable<T>({
  data = [],
  columns = [],
  rowsPerPage = 5,
  actions,
  dropdown,
  footerRows = [],
  showSearch = true,
  showExport = true,
  customExportColumns = [],
  caption,
  onRowClick,
  captionSx = {},
  highlightColor = '#F8FF00',
  textAlignment = 'left',
  tableSize = 'medium',
  onFilteredDataChange,
  ...props
}: ReusableTableProps<T>): JSX.Element {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(
    () =>
      data.filter((row) =>
        columns.some((col) =>
          String(getCellValue(row, col.key) ?? '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      ),
    [data, columns, searchTerm]
  );

  useEffect(() => {
    if (onFilteredDataChange) onFilteredDataChange(filteredData);
  }, [filteredData, onFilteredDataChange]);

  const paginated = useMemo(() => filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage), [filteredData, page, rowsPerPage]);

  const highlight = (text: string | number | null | undefined): ReactNode =>
    !searchTerm || text === null || text === undefined
      ? text
      : text
          .toString()
          .split(new RegExp(`(${searchTerm})`, 'gi'))
          .map((part, i) =>
            i % 2 ? (
              <mark key={i} style={{ background: highlightColor }}>
                {part}
              </mark>
            ) : (
              part
            )
          );

  const transformedExportData = useMemo(() => {
    if (!dropdown?.options || !dropdown.getValue) return filteredData;
    return filteredData.map((row) => {
      const val = dropdown.getValue?.(row) ?? '';
      const label = dropdown.options.find((opt) => opt.value === val)?.label ?? val;
      return { ...row, dropdown: label };
    });
  }, [filteredData, dropdown]);

  const renderDropdown = (row: T): JSX.Element => {
    const val = dropdown?.getValue?.(row) ?? '';
    const opt = dropdown?.options.find((o) => o.value === val);
    return (
      <Select
        size="small"
        value={val}
        onChange={(e) => dropdown?.onChange?.(row, e.target.value)}
        displayEmpty
        disabled={!dropdown?.editable}
        sx={{
          bgcolor: opt?.bgColor || '#fff',
          color: opt?.textColor || '#000',
          fontWeight: 'bold',
          borderRadius: 2,
          fontSize: 13,
          ...dropdown?.sx
        }}
      >
        <MenuItem value="" disabled>
          {dropdown?.defaultLabel || 'Select'}
        </MenuItem>
        {dropdown?.options.map((opt) => (
          <MenuItem
            key={opt.value}
            value={opt.value}
            sx={{
              bgcolor: opt.bgColor,
              color: opt.textColor,
              '&:hover': { bgcolor: opt.hoverColor },
              fontWeight: 'bold'
            }}
          >
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    );
  };

  const renderActions = (row: T, idx: number): JSX.Element => (
    <Box
      display="flex"
      justifyContent={textAlignment === 'center' ? 'center' : textAlignment === 'right' ? 'flex-end' : 'flex-start'}
      alignItems="center"
      gap={1}
    >
      {Object.entries(iconMap).map(
        ([key, { icon, label, color }]) =>
          actions?.[key as keyof typeof iconMap] && (
            <Tooltip title={label} key={key}>
              <IconButton
                color={color as React.ComponentProps<typeof IconButton>['color']}
                onClick={(e) => {
                  if (onRowClick) e.stopPropagation();
                  actions[key as keyof typeof iconMap]?.(row, idx);
                }}
              >
                {icon}
              </IconButton>
            </Tooltip>
          )
      )}
    </Box>
  );

  const exportFooterRow =
    footerRows.length > 0
      ? footerRows[0].content.reduce(
          (acc, cell, idx) => {
            acc[`footer_col_${idx}`] = typeof cell.value === 'string' ? cell.value : String(cell.value);
            return acc;
          },
          {} as Record<string, string>
        )
      : undefined;

  return (
    <TableContainer component={Paper} {...props}>
      {caption && (
        <Box
          sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18, py: 1, backgroundColor: '#1C86FF', color: 'white', ...captionSx }}
        >
          {caption}
        </Box>
      )}
      {(showSearch || showExport) && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          {showSearch && (
            <TextField
              variant="standard"
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ maxWidth: 300 }}
            />
          )}
          {showExport && (
            <ExportIcons
              data={
                exportFooterRow
                  ? [...(transformedExportData as Array<Record<string, unknown>>), exportFooterRow]
                  : (transformedExportData as Array<Record<string, unknown>>)
              }
              columns={customExportColumns.length > 0 ? customExportColumns : columns}
              filename={typeof caption === 'string' ? caption.replace(/\s+/g, '') : 'Export'}
              pdfTitle={typeof caption === 'string' ? caption : 'Export Report'}
              iconSize={25}
            />
          )}
        </Box>
      )}
      <Table size={tableSize}>
        <TableHead>
          <TableRow>
            {columns.map((col) =>
              col.key === 'actionsbuttons' && !actions ? null : (
                <TableCell key={col.key} align={textAlignment} sx={{ fontWeight: 'bold', backgroundColor: '#D9D9D9', color: '#000000' }}>
                  {col.label}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                No data found
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((row, idx) => (
              <TableRow
                key={idx}
                hover
                onClick={onRowClick ? () => onRowClick(row, idx) : undefined}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} align={textAlignment}>
                    {col.key === 'actionsbuttons' && actions
                      ? renderActions(row, idx)
                      : col.key === 'dropdown' && dropdown
                        ? renderDropdown(row)
                        : col.render
                          ? col.render(row)
                          : highlight(getCellValue(row, col.key) as string | number)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
        {footerRows.length > 0 && (
          <TableFooter>
            {footerRows.map((footerRow, idx) => (
              <TableRow key={idx} sx={footerRow.sx}>
                {footerRow.content.map((cell, i) => (
                  <TableCell key={i} colSpan={cell.colSpan} sx={cell.sx}>
                    {cell.value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        )}
      </Table>
      {filteredData.length > 0 && (
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
        />
      )}
    </TableContainer>
  );
}

export default ReusableTable;
