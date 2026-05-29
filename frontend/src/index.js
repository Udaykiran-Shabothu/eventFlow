import React from "react"

import ReactDOM from "react-dom/client"

import { BrowserRouter } from "react-router-dom"

import { ToastContainer } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"

import App from "./App"

import AuthProvider from "./context/AuthContext"

import "./index.css"

const root = ReactDOM.createRoot(
    document.getElementById("root")
)

root.render(

    <BrowserRouter>

        <AuthProvider>

            <App />

            <ToastContainer />

        </AuthProvider>

    </BrowserRouter>
)