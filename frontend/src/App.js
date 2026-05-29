import { Routes, Route } from "react-router-dom"

import Login from "./components/Login"

import Register from "./components/Register"

import OrganizerDashboard from "./components/OrganizerDashboard"

import CoordinatorDashboard from "./components/CoordinatorDashboard"

import AdminDashboard from "./components/AdminDashboard"

import NotFound from "./components/NotFound"

import ProtectedRoute from "./ProtectedRoute"

import CreateProposal from "./components/CreateProposal"

import MyProposals from "./components/MyProposals"

import ProposalDetails from "./components/ProposalDetails"

import "./App.css"

const App = () => {

    return (

        <Routes>






            {/* PUBLIC ROUTES */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />






            {/* ORGANIZER ROUTES */}

            <Route
                path="/organizer"
                element={
                    <ProtectedRoute
                        allowedRoles={["organizer"]}
                    >
                        <OrganizerDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/create-proposal"
                element={
                    <ProtectedRoute
                        allowedRoles={["organizer"]}
                    >
                        <CreateProposal />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/my-proposals"
                element={
                    <ProtectedRoute
                        allowedRoles={["organizer"]}
                    >
                        <MyProposals />
                    </ProtectedRoute>
                }
            />






            {/* COORDINATOR ROUTES */}

            <Route
                path="/coordinator"
                element={
                    <ProtectedRoute
                        allowedRoles={["coordinator"]}
                    >
                        <CoordinatorDashboard />
                    </ProtectedRoute>
                }
            />






            {/* ADMIN ROUTES */}

            <Route
                path="/admin"
                element={
                    <ProtectedRoute
                        allowedRoles={["admin"]}
                    >
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />


            <Route
    path="/proposal/:id"
    element={
        <ProtectedRoute
            allowedRoles={[
                "organizer",
                "coordinator",
                "admin"
            ]}
        >
            <ProposalDetails />
        </ProtectedRoute>
    }
/>



            {/* NOT FOUND */}

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>
    )
}

export default App