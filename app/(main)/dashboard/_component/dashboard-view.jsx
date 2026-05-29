"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
  Sparkles,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const DashboardView = ({ insights }) => {
  // Transform salary data for the chart
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]";
      case "medium":
        return "bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]";
      case "low":
        return "bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.3)]";
      default:
        return "bg-slate-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" };
      case "neutral":
        return { icon: LineChart, color: "text-amber-400 bg-amber-400/10 border border-amber-400/20" };
      case "negative":
        return { icon: TrendingDown, color: "text-rose-400 bg-rose-400/10 border border-rose-400/20" };
      default:
        return { icon: LineChart, color: "text-rose-400 bg-rose-400/10 border border-rose-400/20" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  // Format dates using date-fns
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
      new Date(insights.nextUpdate),
      { addSuffix: true }
  );

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-8">
          <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 font-medium px-3 py-1">
            Last updated: {lastUpdatedDate}
          </Badge>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Market Outlook */}
          <Card className="bg-[#111111] border-[#222222] shadow-xl hover:border-blue-500/30 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Market Outlook
              </CardTitle>
              <div className={`p-1.5 rounded-lg ${outlookColor}`}>
                <OutlookIcon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl font-black text-white">{insights.marketOutlook}</div>
              <p className="text-xs text-slate-500 mt-1">
                Next update {nextUpdateDistance}
              </p>
            </CardContent>
          </Card>

          {/* Industry Growth */}
          <Card className="bg-[#111111] border-[#222222] shadow-xl hover:border-blue-500/30 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Industry Growth
              </CardTitle>
              <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl font-black text-white">
                {insights.growthRate.toFixed(1)}%
              </div>
              <Progress value={insights.growthRate} className="mt-3 h-1.5 bg-blue-950 [&>div]:bg-blue-500" />
            </CardContent>
          </Card>

          {/* Demand Level */}
          <Card className="bg-[#111111] border-[#222222] shadow-xl hover:border-blue-500/30 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Demand Level</CardTitle>
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <BriefcaseIcon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl font-black text-white uppercase">{insights.demandLevel}</div>
              <div
                  className={`h-1.5 w-full rounded-full mt-3 ${getDemandLevelColor(
                      insights.demandLevel
                  )}`}
              />
            </CardContent>
          </Card>

          {/* Top Skills */}
          <Card className="bg-[#111111] border-[#222222] shadow-xl hover:border-blue-500/30 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Skills</CardTitle>
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Brain className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex flex-wrap gap-1.5">
                {insights.topSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-[#1A1A1A] text-slate-300 border border-[#333] hover:bg-[#222] font-medium text-[10px] px-2">
                      {skill}
                    </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Salary Ranges Chart */}
        <Card className="col-span-4 bg-[#111111] border-[#222222] shadow-xl relative overflow-hidden mt-6">
          {/* Subtle AI Glow in the background of the chart */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200px] bg-blue-600/5 blur-[80px] pointer-events-none" />

          <CardHeader className="pb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <BarChart className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">Salary Ranges by Role</CardTitle>
                <CardDescription className="text-slate-400 text-xs mt-1">
                  Displaying minimum, median, and maximum salaries (in thousands)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData} barGap={4} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                  <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#888", fontSize: 11, fontWeight: 500 }}
                      dy={10}
                  />
                  <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#888", fontSize: 11, fontWeight: 500 }}
                      dx={-10}
                  />
                  <Tooltip
                      cursor={{ fill: "#1A1A1A" }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                              <div className="bg-[#111] border border-[#333] p-3 rounded-lg shadow-xl">
                                <p className="font-bold text-white mb-2 text-sm">{label}</p>
                                {payload.map((item) => (
                                    <p key={item.name} className="text-xs text-slate-300 mb-1 flex justify-between gap-4">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                                {item.name}
                              </span>
                                      <span className="font-bold text-white">${item.value}K</span>
                                    </p>
                                ))}
                              </div>
                          );
                        }
                        return null;
                      }}
                  />
                  {/* Clean AI Colors for Bars */}
                  <Bar dataKey="min" fill="#0ea5e9" name="Min Salary" radius={[2, 2, 0, 0]} /> {/* Cyan */}
                  <Bar dataKey="median" fill="#3b82f6" name="Median Salary" radius={[2, 2, 0, 0]} /> {/* Blue */}
                  <Bar dataKey="max" fill="#8b5cf6" name="Max Salary" radius={[2, 2, 0, 0]} /> {/* Purple */}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Industry Trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="bg-[#111111] border-[#222222] shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <CardTitle className="text-base font-bold text-white">Key Industry Trends</CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-400 mt-1">
                Current trends shaping the industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {insights.keyTrends.map((trend, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] shrink-0" />
                      <span className="text-sm text-slate-300 font-medium">{trend}</span>
                    </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#222222] shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-indigo-400" />
                <CardTitle className="text-base font-bold text-white">Recommended Skills</CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-400 mt-1">Skills to consider developing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {insights.recommendedSkills.map((skill) => (
                    <Badge key={skill} variant="outline" className="bg-[#1A1A1A] border-[#333] text-slate-300 py-1 px-2.5 hover:border-blue-500/50 hover:text-blue-400 transition-colors cursor-default text-[11px] font-medium">
                      {skill}
                    </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default DashboardView;