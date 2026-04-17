import { Switch, Route } from 'wouter'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import MapPage from './pages/Map'
import Models from './pages/Models'
import Resources from './pages/Resources'
import Allocation from './pages/Allocation'
import Chatbot from './pages/Chatbot'
import Pipeline from './pages/Pipeline'

function NotFound() {
  return (
    <div className="page flex items-center justify-center">
      <div style={{ textAlign: 'center' }}>
        <p className="text-4xl font-bold mb-2" style={{ color: 'var(--muted)' }}>404</p>
        <p style={{ color: 'var(--muted)' }}>Page not found</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/map" component={MapPage} />
        <Route path="/models" component={Models} />
        <Route path="/resources" component={Resources} />
        <Route path="/allocation" component={Allocation} />
        <Route path="/chatbot" component={Chatbot} />
        <Route path="/pipeline" component={Pipeline} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  )
}
