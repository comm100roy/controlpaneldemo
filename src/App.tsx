import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import { productSnapshots } from './data/dashboard'
import DashboardPage from './pages/DashboardPage'
import EditFunctionPage from './pages/EditFunctionPage'
import EditTopicPage from './pages/EditTopicPage'
import EventsPage from './pages/EventsPage'
import FunctionsPage from './pages/FunctionsPage'
import InstructionsPage from './pages/InstructionsPage'
import KnowledgePage from './pages/KnowledgePage'
import LearningPage from './pages/LearningPage'
import NewFunctionPage from './pages/NewFunctionPage'
import OverviewPage from './pages/OverviewPage'
import ProductPage from './pages/ProductPage'
import TopicsPage from './pages/TopicsPage'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ai-agent/overview" element={<OverviewPage />} />
        <Route path="/ai-agent/knowledge" element={<KnowledgePage />} />
        <Route path="/ai-agent/topics" element={<TopicsPage />} />
        <Route path="/ai-agent/topics/:topicId/edit" element={<EditTopicPage />} />
        <Route path="/ai-agent/events" element={<EventsPage />} />
        <Route path="/ai-agent/functions" element={<FunctionsPage />} />
        <Route path="/ai-agent/functions/new" element={<NewFunctionPage />} />
        <Route path="/ai-agent/functions/:functionId/edit" element={<EditFunctionPage />} />
        <Route path="/ai-agent/learning" element={<LearningPage />} />
        <Route path="/ai-agent/instructions" element={<InstructionsPage />} />
        <Route
          path="/ai-copilot"
          element={
            <ProductPage
              title={productSnapshots.aiCopilot.title}
              description={productSnapshots.aiCopilot.description}
            />
          }
        />
        <Route
          path="/ai-insights"
          element={
            <ProductPage
              title={productSnapshots.aiInsights.title}
              description={productSnapshots.aiInsights.description}
            />
          }
        />
        <Route
          path="/task-bot"
          element={
            <ProductPage
              title={productSnapshots.taskBot.title}
              description={productSnapshots.taskBot.description}
            />
          }
        />
        <Route
          path="/voice-bot"
          element={
            <ProductPage
              title={productSnapshots.voiceBot.title}
              description={productSnapshots.voiceBot.description}
            />
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default App
