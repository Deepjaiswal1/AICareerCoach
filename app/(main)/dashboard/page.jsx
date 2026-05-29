// app/(main)/dashboard/page.jsx
import { Suspense } from "react";
import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_component/dashboard-view";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

// 1. Create a separate asynchronous component for the heavy data fetching
async function IndustryInsightsWrapper() {
  // This query is slow, so we isolate it here
  const insights = await getIndustryInsights();

  return <DashboardView insights={insights} />;
}

// 2. The main page component
export default async function DashboardPage() {
  // We only await the fast, critical check here so the page doesn't get blocked
  const { isOnboarded } = await getUserOnboardingStatus();

  // If not onboarded, redirect immediately
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  return (
      <div className="container mx-auto">
        {/* 3. Wrap the heavy component in Suspense */}
        {/* While IndustryInsightsWrapper is fetching data, it shows the fallback */}
        <Suspense
            fallback={
              <div className="flex flex-col space-y-4 mt-8 animate-pulse">
                <div className="h-64 bg-muted rounded-xl w-full"></div>
                <p className="text-muted-foreground text-center animate-pulse">
                  Analyzing industry data...
                </p>
              </div>
            }
        >
          <IndustryInsightsWrapper />
        </Suspense>
      </div>
  );
}