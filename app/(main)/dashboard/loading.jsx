// app/(main)/dashboard/loading.jsx
import React from "react";

export default function DashboardLoading() {
    return (
        <div className="container mx-auto mt-10">
            <div className="flex flex-col space-y-6">
                {/* Title Skeleton */}
                <div className="h-8 bg-muted rounded-md w-64 animate-pulse"></div>

                {/* Stats Row Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-muted rounded-xl animate-pulse border border-border"></div>
                    ))}
                </div>

                {/* Main Chart/Content Skeleton */}
                <div className="h-[400px] bg-muted rounded-xl animate-pulse border border-border mt-8"></div>
            </div>
        </div>
    );
}