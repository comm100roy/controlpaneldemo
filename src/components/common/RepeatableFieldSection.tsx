import { useState, type DragEvent, type ReactNode } from 'react'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { Box, IconButton, Stack } from '@mui/material'

type RepeatableFieldSectionProps<T> = {
  rows: T[]
  emptyLabel: string
  onAdd: () => void
  onRemove: (index: number) => void
  onReorder?: (fromIndex: number, toIndex: number) => void
  renderRow: (
    row: T,
    index: number,
    controls: {
      deleteButton: ReactNode
      addButton: ReactNode
    },
  ) => ReactNode
}

function RepeatableFieldSection<T>({
  rows,
  emptyLabel,
  onAdd,
  onRemove,
  onReorder,
  renderRow,
}: RepeatableFieldSectionProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (event: DragEvent<HTMLButtonElement>, index: number) => {
    if (!onReorder) {
      return
    }

    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
    setDraggedIndex(index)
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!onReorder || draggedIndex === null) {
      return
    }

    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (index: number) => {
    if (!onReorder || draggedIndex === null) {
      return
    }

    if (draggedIndex !== index) {
      onReorder(draggedIndex, index)
    }

    setDraggedIndex(null)
  }

  if (rows.length === 0) {
    return (
      <Box
        onClick={onAdd}
        sx={{
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 1,
          minHeight: 40,
          px: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          fontSize: 14,
          lineHeight: 1.2,
          cursor: 'pointer',
        }}
      >
        {emptyLabel}
      </Box>
    )
  }

  return (
    <Stack spacing={1.5}>
      {rows.map((row, index) => {
        const controls = {
          deleteButton: (
            <IconButton
              size="small"
              onClick={() => onRemove(index)}
              sx={{ color: 'text.secondary' }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          ),
          addButton:
            index === rows.length - 1 ? (
              <IconButton
                size="small"
                onClick={onAdd}
                sx={{ color: 'text.secondary' }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            ) : null,
        }

        return (
          <Box
            key={index}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            onDragEnd={() => setDraggedIndex(null)}
            sx={{
              position: 'relative',
              pl: 2.75,
              '&:hover .repeatable-drag-handle, &:focus-within .repeatable-drag-handle': {
                opacity: onReorder ? 1 : 0,
              },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 20,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <IconButton
                className="repeatable-drag-handle"
                size="small"
                draggable={Boolean(onReorder)}
                onDragStart={(event) => handleDragStart(event, index)}
                onDragEnd={() => setDraggedIndex(null)}
                sx={{
                  cursor: onReorder ? 'grab' : 'default',
                  color: 'text.secondary',
                  opacity: draggedIndex === index && onReorder ? 1 : 0,
                  transition: 'opacity 0.15s ease',
                }}
              >
                <DragIndicatorIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box
              sx={{
                borderRadius: 1,
                outline: draggedIndex === index ? '1px dashed' : 'none',
                outlineColor: 'divider',
              }}
            >
              {renderRow(row, index, controls)}
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}

export default RepeatableFieldSection
