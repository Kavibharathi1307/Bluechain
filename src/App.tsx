import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import PlaceholderPage from './components/PlaceholderPage'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import MapPage from './pages/MapPage'
import AlertDashboard from './pages/AlertDashboard'
import BlockchainAudit from './pages/BlockchainAudit'
import Impact from './pages/Impact'
import Reports from './pages/Reports'
import {
  Bell,
  BarChart3,
  ShieldCheck,
  FileText,
  Settings,
  LifeBuoy,
} from 'lucide-react'

const modules = {
  alerts: {
    title: 'Active Alerts',
    description:
      'Priority-ranked alert center combining AI detections, sensor telemetry and scheduled patrols.',
    icon: Bell,
    features: [
      'Severity-filtered triage queue',
      'AI-detection confidence scores',
      'Assign-and-respond workflows',
      'Alert history & audit trail',
    ],
  },
  analytics: {
    title: 'Impact Analytics',
    description:
      'Deep-dive analytics across vegetation, biodiversity, water quality and blue carbon metrics.',
    icon: BarChart3,
    features: [
      'Multi-year trend explorer',
      'Blue carbon accounting',
      'Biodiversity indices',
      'Exportable report packs',
    ],
  },
  verification: {
    title: 'Verification',
    description:
      'Transparent verification ledger where every accepted event is anchored immutably.',
    icon: ShieldCheck,
    features: [
      'Verification event timeline',
      'Chain anchor status per record',
      'Evidence attachments',
      'Independent auditor view',
    ],
  },
  reports: {
    title: 'Reports',
    description:
      'Scheduled and on-demand reports for regulators, funders and public stakeholders.',
    icon: FileText,
    features: [
      'Quarterly impact summaries',
      'Carbon credit statements',
      'Compliance reports',
      'Shareable public links',
    ],
  },
  settings: {
    title: 'Settings',
    description:
      'Workspace configuration, team roles and platform preferences.',
    icon: Settings,
    features: [
      'Organization profile',
      'Role-based access control',
      'API & webhook keys',
      'Notification preferences',
    ],
  },
  support: {
    title: 'Support',
    description:
      'Help centre, documentation and contact channels for the operations team.',
    icon: LifeBuoy,
    features: [
      'Platform documentation',
      'Field guide library',
      'Submit a ticket',
      'Status page',
    ],
  },
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="map" element={<MapPage />} />
          <Route path="alerts" element={<AlertDashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetails />} />
          <Route
            path="analytics"
            element={<Impact />}
          />
          <Route
            path="verification"
            element={<BlockchainAudit />}
          />
          <Route path="reports" element={<Reports />} />
          <Route
            path="settings"
            element={<PlaceholderPage {...modules.settings} />}
          />
          <Route
            path="support"
            element={<PlaceholderPage {...modules.support} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
