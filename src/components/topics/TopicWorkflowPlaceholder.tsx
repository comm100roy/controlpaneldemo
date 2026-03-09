import { useCallback, useMemo } from 'react'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined'
import RedoOutlinedIcon from '@mui/icons-material/RedoOutlined'
import FitScreenOutlinedIcon from '@mui/icons-material/FitScreenOutlined'
import TitleOutlinedIcon from '@mui/icons-material/TitleOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined'
import WebOutlinedIcon from '@mui/icons-material/WebOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import {
  Background,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  Panel,
  Position,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  Handle,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

type StartNodeData = {
  title: string
}

type MessageNodeData = {
  title: string
  message: string
}

type ActionNodeData = {
  badge: string
  title: string
  description: string
  linkLabel: string
}

function StartNode({ data }: NodeProps<Node<StartNodeData>>) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Box
        sx={{
          width: 92,
          px: 1.5,
          py: 1,
          bgcolor: 'common.white',
          borderRadius: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 6px 16px rgba(15, 23, 42, 0.06)',
          textAlign: 'center',
        }}
      >
        <FlagOutlinedIcon sx={{ color: '#7cb342', fontSize: 28 }} />
        <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 700 }}>
          {data.title}
        </Typography>
      </Box>
    </Box>
  )
}

function MessageNode({ data }: NodeProps<Node<MessageNodeData>>) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Box
        sx={{
          width: 230,
          bgcolor: 'common.white',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)',
          overflow: 'hidden',
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ p: 1.5, pb: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: '#00a0e9',
              color: 'common.white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            T
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {data.title}
          </Typography>
        </Stack>
        <Box sx={{ px: 1.5, pb: 1.5 }}>
          <Box
            sx={{
              p: 1.25,
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: '#ffffff',
              minHeight: 106,
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.45 }}>
              {data.message}
            </Typography>
            <Box
              sx={{
                mt: 2,
                borderTop: '1px dashed',
                borderColor: 'divider',
                pt: 1.5,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                + New Link
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function ActionNode({ data }: NodeProps<Node<ActionNodeData>>) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Box
        sx={{
          width: 215,
          bgcolor: 'common.white',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)',
          overflow: 'hidden',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.5, pb: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                px: 0.75,
                py: 0.25,
                borderRadius: 1,
                bgcolor: '#4c6fff',
                color: 'common.white',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {data.badge}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {data.title}
            </Typography>
          </Stack>
          <OpenInNewOutlinedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
        </Stack>
        <Stack spacing={2} alignItems="center" sx={{ px: 2, pb: 2.5, pt: 1 }}>
          <Box
            sx={{
              width: 92,
              height: 78,
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider',
              bgcolor: '#fafbff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4c6fff',
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {data.badge}
          </Box>
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', fontWeight: 700, maxWidth: 150 }}
          >
            {data.description}
          </Typography>
          <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
            {data.linkLabel}
          </Typography>
        </Stack>
      </Box>
    </Box>
  )
}

const nodeTypes: NodeTypes = {
  start: StartNode,
  message: MessageNode,
  action: ActionNode,
}

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'start',
    position: { x: 62, y: 78 },
    data: {
      title: 'Start',
    } satisfies StartNodeData,
    draggable: true,
  },
  {
    id: 'message',
    type: 'message',
    position: { x: 178, y: 60 },
    data: {
      title: 'Send a message',
      message: 'Hello there, let me help with your order checking.',
    } satisfies MessageNodeData,
    draggable: true,
  },
  {
    id: 'action',
    type: 'action',
    position: { x: 480, y: 54 },
    data: {
      badge: 'SSO',
      title: 'Show SSO login button',
      description: 'Visitor SSO feature is disabled',
      linkLabel: 'Enable now',
    } satisfies ActionNodeData,
    draggable: true,
  },
]

const initialEdges: Edge[] = [
  {
    id: 'start-message',
    source: 'start',
    target: 'message',
    type: 'smoothstep',
    animated: false,
    style: {
      stroke: '#c7d2e0',
      strokeWidth: 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 18,
      height: 18,
      color: '#c7d2e0',
    },
  },
  {
    id: 'message-action',
    source: 'message',
    target: 'action',
    type: 'smoothstep',
    animated: false,
    style: {
      stroke: '#c7d2e0',
      strokeWidth: 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 18,
      height: 18,
      color: '#c7d2e0',
    },
  },
]

function WorkflowToolButton({ children }: { children: React.ReactNode }) {
  return (
    <IconButton
      size="small"
      sx={{
        width: 34,
        height: 34,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'common.white',
        color: 'text.secondary',
      }}
    >
      {children}
    </IconButton>
  )
}

function TopicWorkflowPlaceholder() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback<OnConnect>(
    (params: Connection) =>
      setEdges((currentEdges) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            style: { stroke: '#c7d2e0', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 18,
              height: 18,
              color: '#c7d2e0',
            },
          },
          currentEdges,
        ),
      ),
    [setEdges],
  )

  const flowNodes = useMemo(() => nodes, [nodes])
  const flowEdges = useMemo(() => edges, [edges])
  const handleNodesChange = useMemo<OnNodesChange>(() => onNodesChange, [onNodesChange])
  const handleEdgesChange = useMemo<OnEdgesChange>(() => onEdgesChange, [onEdgesChange])

  return (
    <Box
      sx={{
        position: 'relative',
        height: 480,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: '#f8fbfd',
      }}
    >
      <ReactFlow
        style={{ width: '100%', height: '100%' }}
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.16 }}
        minZoom={0.4}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
        nodesDraggable
      >
        <Background gap={24} color="#edf2f7" />

        <Panel position="bottom-left">
          <Stack spacing={1}>
            <Stack spacing={0.75}>
              <WorkflowToolButton>
                <UndoOutlinedIcon fontSize="small" />
              </WorkflowToolButton>
              <WorkflowToolButton>
                <RedoOutlinedIcon fontSize="small" />
              </WorkflowToolButton>
            </Stack>
            <Box
              sx={{
                width: 54,
                px: 1,
                py: 0.75,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'common.white',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                100%
              </Typography>
            </Box>
            <Box
              sx={{
                width: 54,
                px: 1,
                py: 0.75,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'common.white',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                Auto
              </Typography>
            </Box>
            <WorkflowToolButton>
              <FitScreenOutlinedIcon fontSize="small" />
            </WorkflowToolButton>
          </Stack>
        </Panel>

        <Panel position="top-right">
          <Stack spacing={0.75}>
            <WorkflowToolButton>
              <TitleOutlinedIcon fontSize="small" />
            </WorkflowToolButton>
            <WorkflowToolButton>
              <ImageOutlinedIcon fontSize="small" />
            </WorkflowToolButton>
            <WorkflowToolButton>
              <MovieCreationOutlinedIcon fontSize="small" />
            </WorkflowToolButton>
            <WorkflowToolButton>
              <WebOutlinedIcon fontSize="small" />
            </WorkflowToolButton>
            <WorkflowToolButton>
              <PersonOutlineOutlinedIcon fontSize="small" />
            </WorkflowToolButton>
            <WorkflowToolButton>
              <ViewAgendaOutlinedIcon fontSize="small" />
            </WorkflowToolButton>
            <WorkflowToolButton>
              <StarBorderOutlinedIcon fontSize="small" />
            </WorkflowToolButton>
            <WorkflowToolButton>
              <SellOutlinedIcon fontSize="small" />
            </WorkflowToolButton>
            <WorkflowToolButton>
              <PlaceOutlinedIcon fontSize="small" />
            </WorkflowToolButton>
          </Stack>
        </Panel>
      </ReactFlow>
    </Box>
  )
}

export default TopicWorkflowPlaceholder
