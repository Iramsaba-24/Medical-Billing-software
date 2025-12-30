import { IconButton, Tooltip, Box, type IconButtonProps } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PrintIcon from '@mui/icons-material/Print';
import { IconFileTypeCsv, IconFileTypeDocx, IconFileTypePdf, IconFileTypeXls } from '@tabler/icons-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, Table as WordTable, TableRow, TableCell, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { useMemo, type JSX } from 'react';

type Column = { key: string; label?: string; emptyValue?: string };

interface ExportIconsProps extends Omit<IconButtonProps, 'onClick'> {
  data: Array<Record<string, unknown>>;
  columns?: Column[];
  filename?: string;
  iconSize?: number;
  showCopy?: boolean;
  showExcel?: boolean;
  showCSV?: boolean;
  showPDF?: boolean;
  showWord?: boolean;
  showPrint?: boolean;
  pdfTitle?: string;
  pdfOptions?: Record<string, unknown>;
}

const ExportIcons = ({
  data = [],
  columns = [],
  filename = 'Export',
  iconSize = 25,
  sx,
  showCopy = true,
  showExcel = true,
  showCSV = true,
  showPDF = true,
  showPrint = true,
  showWord = true,
  pdfTitle = 'Export Report',
  pdfOptions = {},
  ...iconProps
}: ExportIconsProps): JSX.Element => {
  const getNestedValue = (obj: Record<string, unknown>, path: string): unknown =>
    path.split('.').reduce<unknown>((acc, part) => {
      if (acc && typeof acc === 'object' && part in acc) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj);

  const exportColumns = useMemo<Column[]>(() => {
    if (columns.length > 0) return columns.filter((c) => c.key !== 'actionsbuttons');
    if (!data.length) return [];
    return Object.keys(data[0])
      .filter((k) => k !== 'actionsButtons')
      .map((k) => ({ key: k, label: k, emptyValue: '' }));
  }, [columns, data]);

  const footerRow = useMemo(() => {
    if (!data.length) return undefined;
    const last = data[data.length - 1];
    const isFooter = Object.keys(last).some((k) => String(k).toLowerCase().startsWith('footer_col_'));
    return isFooter ? last : undefined;
  }, [data]);

  const mainData = useMemo(() => {
    if (!data.length) return [];
    return footerRow ? data.slice(0, -1) : data;
  }, [data, footerRow]);

  const exportData = useMemo(() => {
    const getValue = (item: Record<string, unknown>, col: Column) => {
      const val = col.key.includes('.') ? getNestedValue(item, col.key) : item[col.key];
      return val != null ? String(val) : (col.emptyValue ?? '');
    };

    const rows = mainData.map((item) => {
      const row: Record<string, string> = {};
      exportColumns.forEach((col) => {
        row[col.label || col.key] = getValue(item, col);
      });
      return row;
    });

    if (footerRow) {
      const footer: Record<string, string> = {};
      exportColumns.forEach((col, idx) => {
        const key = `footer_col_${idx}`;
        footer[col.label || col.key] = String(footerRow[key] ?? '');
      });
      rows.push(footer);
    }

    return rows;
  }, [mainData, footerRow, exportColumns]);

  const isDataEmpty = exportData.length === 0;

  const notifyIfEmpty = (): boolean => {
    if (isDataEmpty) {
      alert('Data not available to export');
      return true;
    }
    return false;
  };

  const handleCopy = async (): Promise<void> => {
    if (notifyIfEmpty()) return;
    const text = [Object.keys(exportData[0]).join('\t'), ...exportData.map((r) => Object.values(r).join('\t'))].join('\n');
    await navigator.clipboard.writeText(text);
    alert('Data copied to clipboard!');
  };

  const handleExcelExport = async (): Promise<void> => {
    if (notifyIfEmpty()) return;
    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, sheet, 'Sheet1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const handleCSVExport = async (): Promise<void> => {
    if (notifyIfEmpty()) return;
    const XLSX = await import('xlsx');
    const sheet = XLSX.utils.json_to_sheet(exportData);
    const blob = new Blob([XLSX.utils.sheet_to_csv(sheet)], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  const handlePDFExport = (): void => {
    if (notifyIfEmpty()) return;
    const doc = new jsPDF();
    autoTable(doc, {
      head: [Object.keys(exportData[0])],
      body: exportData.map((r) => Object.values(r)),
      margin: { top: 20 },
      ...pdfOptions
    });
    doc.text(pdfTitle, 14, 15);
    doc.save(`${filename}.pdf`);
  };

  const handleWordExport = async (): Promise<void> => {
    if (notifyIfEmpty()) return;
    const headers = Object.keys(exportData[0]);
    const rows = [
      new TableRow({
        children: headers.map(
          (h) =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })]
            })
        )
      }),
      ...exportData.map(
        (row) =>
          new TableRow({
            children: headers.map((h) => new TableCell({ children: [new Paragraph(row[h])] }))
          })
      )
    ];

    const doc = new Document({
      sections: [
        {
          children: [new Paragraph({ text: pdfTitle, heading: 'Heading1' }), new WordTable({ rows })]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${filename}.docx`);
  };

  const handlePrint = (): void => {
    if (notifyIfEmpty()) return;
    const html = `
      <table border="1" style="width:100%; border-collapse:collapse;">
        <thead><tr>${Object.keys(exportData[0])
          .map((h) => `<th>${h}</th>`)
          .join('')}</tr></thead>
        <tbody>
          ${exportData
            .map(
              (r) =>
                `<tr>${Object.values(r)
                  .map((v) => `<td>${v}</td>`)
                  .join('')}</tr>`
            )
            .join('')}
        </tbody>
      </table>`;
    const win = window.open('', 'PrintWindow', 'width=900,height=700');
    win?.document.write(`<html><head><title>${pdfTitle}</title></head><body>${html}</body></html>`);
    win?.document.close();
    win?.print();
  };

  const iconStyle = { fontSize: iconSize };

  return (
    <Box display="flex" gap={1}>
      {showCopy && (
        <Tooltip title="Copy to Clipboard">
          <IconButton onClick={handleCopy} sx={sx} {...iconProps}>
            <ContentCopyIcon sx={iconStyle} />
          </IconButton>
        </Tooltip>
      )}
      {showExcel && (
        <Tooltip title="Export to Excel">
          <IconButton onClick={handleExcelExport} sx={sx} color="success" {...iconProps}>
            <IconFileTypeXls size={iconSize} />
          </IconButton>
        </Tooltip>
      )}
      {showCSV && (
        <Tooltip title="Export to CSV">
          <IconButton onClick={handleCSVExport} sx={sx} color="warning" {...iconProps}>
            <IconFileTypeCsv size={iconSize} />
          </IconButton>
        </Tooltip>
      )}
      {showWord && (
        <Tooltip title="Export to Word">
          <IconButton onClick={handleWordExport} sx={sx} color="primary" {...iconProps}>
            <IconFileTypeDocx size={iconSize} />
          </IconButton>
        </Tooltip>
      )}
      {showPDF && (
        <Tooltip title="Export to PDF">
          <IconButton onClick={handlePDFExport} sx={sx} color="error" {...iconProps}>
            <IconFileTypePdf size={iconSize} />
          </IconButton>
        </Tooltip>
      )}
      {showPrint && (
        <Tooltip title="Print">
          <IconButton onClick={handlePrint} sx={sx} {...iconProps}>
            <PrintIcon sx={iconStyle} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default ExportIcons;
