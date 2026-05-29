import React from "react"
import MockDashboardProvider from "./provider"

const MockDashboardLayout = ({ children }) => {
  return (
    <div>
      <MockDashboardProvider>
        <div className="p-10">{children}</div>
      </MockDashboardProvider>
    </div>
  )
}

export default MockDashboardLayout
