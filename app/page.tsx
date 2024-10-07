import { TravelPlannerComponent } from "@/components/travel-planner"
import { ToastContainer } from "@/components/ui/toast"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <TravelPlannerComponent />
      <ToastContainer />
    </main>
  )
}
