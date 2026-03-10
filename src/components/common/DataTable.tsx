import { useMemo, useState, type ReactNode } from 'react'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  IconButton,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export type InstructionRow = {
  id: string
  content: string
  secondaryValue?: string | number
  href?: string
}

export type InstructionTableColumn<Row extends InstructionRow = InstructionRow> = {
  key: string
  header: ReactNode
  align?: 'left' | 'center' | 'right'
  width?: number | string
  sortAccessor?: (row: Row) => string | number | boolean | null | undefined
  render: (row: Row) => ReactNode
}

export type InstructionTableBatchAction<Row extends InstructionRow = InstructionRow> = {
  key: string
  label: string
  icon?: ReactNode
  onClick: (selectedRows: Row[]) => void
}

type DataTableProps<Row extends InstructionRow = InstructionRow> = {
  rows: Row[]
  nameHeader?: string
  secondaryHeader?: string
  columns?: InstructionTableColumn<Row>[]
  onEdit?: (row: Row) => void
  onDelete?: (row: Row) => void
  showDelete?: boolean
  showOperations?: boolean
  selectable?: boolean
  batchActions?: InstructionTableBatchAction<Row>[]
  footer?: ReactNode
  emptyStateMessage?: ReactNode
  emptyStateIcon?: ReactNode
  emptyStateMinHeight?: number
}

function DataTable<Row extends InstructionRow = InstructionRow>({
  rows,
  nameHeader = 'Instruction',
  secondaryHeader,
  columns,
  onEdit,
  onDelete,
  showDelete = true,
  showOperations = true,
  selectable = false,
  batchActions = [],
  footer,
  emptyStateMessage = 'No records found.',
  emptyStateIcon,
  emptyStateMinHeight = 320,
}: DataTableProps<Row>) {
  type SortDirection = 'asc' | 'desc'

  const headerCellSx = {
    height: 56,
    py: 0,
    boxSizing: 'border-box',
    verticalAlign: 'middle',
  } as const

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
  const [sortState, setSortState] = useState<{
    key: string
    direction: SortDirection
  } | null>(null)

  const currentSelectedRowIds = selectedRowIds.filter((id) =>
    rows.some((row) => row.id === id),
  )
  const selectedRows = rows.filter((row) => currentSelectedRowIds.includes(row.id))
  const allRowsSelected = rows.length > 0 && currentSelectedRowIds.length === rows.length
  const someRowsSelected =
    currentSelectedRowIds.length > 0 && currentSelectedRowIds.length < rows.length

  const resolvedColumns: InstructionTableColumn<Row>[] = useMemo(
    () =>
      columns ??
      [
        {
          key: 'content',
          header: nameHeader,
          render: (row: Row) =>
            row.href ? (
              <Link
                component={RouterLink}
                to={row.href}
                underline="hover"
                color="primary.main"
                sx={{ fontSize: 14 }}
              >
                {row.content}
              </Link>
            ) : (
              <Typography variant="body2" color="text.primary">
                {row.content}
              </Typography>
            ),
        },
        ...(secondaryHeader
          ? [
              {
                key: 'secondaryValue',
                header: secondaryHeader,
                render: (row: Row) => (
                  <Typography variant="body2" color="text.primary">
                    {row.secondaryValue ?? ''}
                  </Typography>
                ),
              } satisfies InstructionTableColumn<Row>,
            ]
          : []),
      ],
    [columns, nameHeader, secondaryHeader],
  )

  const shouldShowOperations = showOperations

  const sortedRows = useMemo(() => {
    if (!sortState) {
      return rows
    }

    const sortedColumn = resolvedColumns.find((column) => column.key === sortState.key)
    if (!sortedColumn?.sortAccessor) {
      return rows
    }

    const sortAccessor = sortedColumn.sortAccessor

    return [...rows].sort((leftRow, rightRow) => {
      const leftValue = sortAccessor(leftRow)
      const rightValue = sortAccessor(rightRow)

      if (leftValue == null && rightValue == null) {
        return 0
      }
      if (leftValue == null) {
        return 1
      }
      if (rightValue == null) {
        return -1
      }

      const normalizedLeft = typeof leftValue === 'boolean' ? Number(leftValue) : leftValue
      const normalizedRight = typeof rightValue === 'boolean' ? Number(rightValue) : rightValue

      const comparison =
        typeof normalizedLeft === 'string' && typeof normalizedRight === 'string'
          ? normalizedLeft.localeCompare(normalizedRight, undefined, {
              numeric: true,
              sensitivity: 'base',
            })
          : normalizedLeft < normalizedRight
            ? -1
            : normalizedLeft > normalizedRight
              ? 1
              : 0

      return sortState.direction === 'asc' ? comparison : comparison * -1
    })
  }, [resolvedColumns, rows, sortState])

  const handleToggleAllRows = () => {
    if (allRowsSelected) {
      setSelectedRowIds([])
      return
    }

    setSelectedRowIds(rows.map((row) => row.id))
  }

  const handleToggleRow = (rowId: string) => {
    setSelectedRowIds((current) =>
      current.includes(rowId)
        ? current.filter((id) => id !== rowId)
        : [...currentSelectedRowIds, rowId],
    )
  }

  const handleBatchAction = (action: InstructionTableBatchAction<Row>) => {
    action.onClick(selectedRows)
    setSelectedRowIds([])
  }

  const handleSortColumn = (columnKey: string) => {
    setSortState((current) => {
      if (current?.key === columnKey) {
        return {
          key: columnKey,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        }
      }

      return {
        key: columnKey,
        direction: 'asc',
      }
    })
  }

  const totalColumnCount =
    resolvedColumns.length + (selectable ? 1 : 0) + (shouldShowOperations ? 1 : 0)

  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <Table>
          <colgroup>
            {selectable ? <col style={{ width: 56 }} /> : null}
            {resolvedColumns.map((column) => (
              <col
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
              />
            ))}
            {shouldShowOperations ? <col style={{ width: 104 }} /> : null}
          </colgroup>
          <TableHead>
            {selectable && currentSelectedRowIds.length > 0 ? (
              <TableRow sx={{ height: 56 }}>
                <TableCell padding="checkbox" sx={headerCellSx}>
                  <Checkbox
                    checked={allRowsSelected}
                    indeterminate={someRowsSelected}
                    onChange={handleToggleAllRows}
                  />
                </TableCell>
                <TableCell colSpan={totalColumnCount - 1} sx={headerCellSx}>
                  <Stack
                    sx={{
                      minHeight: 56,
                      overflowX: 'auto',
                      overflowY: 'hidden',
                      justifyContent: 'center',
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ minHeight: 36, flexWrap: 'nowrap', width: 'max-content' }}
                    >
                      {batchActions.map((action) => (
                        <Button
                          key={action.key}
                          variant="text"
                          color="inherit"
                          size="small"
                          startIcon={action.icon}
                          onClick={() => handleBatchAction(action)}
                          sx={{
                            color: 'text.secondary',
                            textTransform: 'none',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </Stack>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow sx={{ height: 56 }}>
                {selectable ? (
                  <TableCell padding="checkbox" sx={headerCellSx}>
                    <Checkbox
                      checked={allRowsSelected}
                      indeterminate={someRowsSelected}
                      onChange={handleToggleAllRows}
                    />
                  </TableCell>
                ) : null}
                {resolvedColumns.map((column) => (
                  <TableCell
                    key={column.key}
                    align={column.align}
                    sx={{ ...headerCellSx, fontWeight: 700 }}
                  >
                    {column.sortAccessor ? (
                      <Stack
                        component="button"
                        type="button"
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        onClick={() => handleSortColumn(column.key)}
                        sx={{
                          width: '100%',
                          p: 0,
                          m: 0,
                          border: 0,
                          background: 'transparent',
                          color: 'inherit',
                          font: 'inherit',
                          fontFamily: 'inherit',
                          fontSize: 'inherit',
                          fontWeight: 'inherit',
                          lineHeight: 'inherit',
                          cursor: 'pointer',
                          justifyContent:
                            column.align === 'center'
                              ? 'center'
                              : column.align === 'right'
                                ? 'flex-end'
                                : 'flex-start',
                        }}
                      >
                        <Box component="span">{column.header}</Box>
                        <ArrowUpwardIcon
                          sx={{
                            fontSize: 18,
                            color: 'text.secondary',
                            opacity: sortState?.key === column.key ? 1 : 0,
                            transform:
                              sortState?.key === column.key &&
                              sortState.direction === 'desc'
                                ? 'rotate(180deg)'
                                : 'rotate(0deg)',
                            transition: 'transform 0.2s ease, opacity 0.2s ease',
                          }}
                        />
                      </Stack>
                    ) : (
                      column.header
                    )}
                  </TableCell>
                ))}
                {shouldShowOperations ? (
                  <TableCell align="right" sx={{ ...headerCellSx, fontWeight: 700 }}>
                    Operations
                  </TableCell>
                ) : null}
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {sortedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={totalColumnCount} sx={{ py: 0, height: emptyStateMinHeight }}>
                  <Stack spacing={1.5} alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                    {emptyStateIcon ?? (
                      <Inventory2OutlinedIcon sx={{ fontSize: 56, color: 'rgba(15, 23, 42, 0.22)' }} />
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {emptyStateMessage}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              sortedRows.map((row) => (
                <TableRow key={row.id} hover>
                  {selectable ? (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={currentSelectedRowIds.includes(row.id)}
                        onChange={() => handleToggleRow(row.id)}
                      />
                    </TableCell>
                  ) : null}
                  {resolvedColumns.map((column) => (
                    <TableCell key={column.key} align={column.align}>
                      {column.render(row)}
                    </TableCell>
                  ))}
                  {shouldShowOperations ? (
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit?.(row)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        {showDelete ? (
                          <IconButton
                            size="small"
                            color="default"
                            onClick={() => onDelete?.(row)}
                          >
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                          </IconButton>
                        ) : null}
                      </Stack>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {footer ? (
          <>
            <Divider />
            {footer}
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default DataTable
