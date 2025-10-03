import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { WorkflowProvider } from "./contexts/WorkflowContext";
import { LandingPage } from "./pages";
import Credentials from "./pages/Credentials";
import Dashboard from "./pages/Dashboard";
import Executions from "./pages/Executions";
import Login from "./pages/Login";
import WorkflowEditor from "./pages/WorkflowEditor";

function App() {
	return (
		<LandingPage />
		// <AuthProvider>
		// 	<WorkflowProvider>
		// 		<Router>
		// 			<div className="min-h-screen bg-gray-50">
		// 				<Routes>
		// 					<Route path="/login" element={<Login />} />
		// 					<Route path="/" element={<Layout />}>
		// 						<Route index element={<Navigate to="/dashboard" replace />} />
    //             <Route path="dashboard" element={<Dashboard />} />
    //             <Route path="workflow/:id?" element={<WorkflowEditor />} />
    //             <Route path="credentials" element={<Credentials />} />
    //             <Route path="executions" element={<Executions />} />
		// 					</Route>
		// 				</Routes>
		// 			</div>
		// 		</Router>
		// 	</WorkflowProvider>
		// </AuthProvider>
	)
}

export default App;