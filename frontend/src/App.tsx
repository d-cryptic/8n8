import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout";

function App() {
	return (
		<Router>
			<div className="min-h-screen bg-gray-50">
				<Layout />
				{/* <Routes>
					<Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
								<Route path="dashboard" element={<Dashboard />} />
              </Route>
				</Routes> */}
			</div>
		</Router>
	)
}

export default App;