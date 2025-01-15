import Link from "next/link"
import { Button } from "shared/components/ui/button"

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      <p className="mb-4">Welcome to your dashboard. Select a section to view more details.</p>
      <div className="flex space-x-4">
        <Link href="/dashboard/analytics">
          <Button asChild>Analytics</Button>
        </Link>
        <Link href="/dashboard/database-management">
          <Button asChild>Database Management</Button>
        </Link>
      </div>
    </div>
  )
}
