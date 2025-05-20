"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Sparkles, BarChart3, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function WeeklySummary() {
  // Mock weekly summary data
  const summary = {
    week: "May 3 - May 9, 2023",
    categories: [
      { name: "AI Research", count: 12, color: "bg-blue-500" },
      { name: "Math Notes", count: 9, color: "bg-green-500" },
      { name: "Group Project", count: 7, color: "bg-purple-500" },
      { name: "Physics Notes", count: 6, color: "bg-amber-500" },
      { name: "Biology", count: 5, color: "bg-red-500" },
    ],
    topTopics: ["machine learning", "calculus", "project planning", "research"],
    summary:
      "This week, you focused primarily on preparing for your Machine Learning project and studying for your Calculus midterm. You've also made progress on your Group Project planning. Consider organizing your AI Research notes into a structured document for your final project proposal.",
    studyTime: "12 hours",
    mostProductiveDay: "Tuesday",
    upcomingDeadlines: [
      { task: "Practice derivatives problems", deadline: "May 8, 2023" },
      { task: "Collect dataset", deadline: "May 10, 2023" },
    ],
    stats: {
      notesCreated: 14,
      tasksCompleted: 8,
      documentsCreated: 3,
      studyGoalProgress: 80,
    },
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            <CardTitle>Weekly Summary</CardTitle>
          </div>
          <CardDescription>{summary.week}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Summary</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{summary.summary}</p>

            <h3 className="text-sm font-medium mb-2">Top Categories</h3>
            <div className="space-y-2 mb-4">
              {summary.categories.slice(0, 3).map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">{category.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{category.count} notes</span>
                    </div>
                    <Progress value={(category.count / summary.categories[0].count) * 100} className="h-1" />
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-medium mb-2">Top Topics</h3>
            <div className="flex flex-wrap gap-2">
              {summary.topTopics.map((topic, index) => (
                <Badge key={index} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Weekly Stats</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Card className="bg-gray-50 dark:bg-gray-800 border-none">
                <CardContent className="p-3">
                  <div className="text-2xl font-bold">{summary.stats.notesCreated}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Notes Created</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-50 dark:bg-gray-800 border-none">
                <CardContent className="p-3">
                  <div className="text-2xl font-bold">{summary.stats.tasksCompleted}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Tasks Completed</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-50 dark:bg-gray-800 border-none">
                <CardContent className="p-3">
                  <div className="text-2xl font-bold">{summary.stats.documentsCreated}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Documents Created</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-50 dark:bg-gray-800 border-none">
                <CardContent className="p-3">
                  <div className="text-2xl font-bold">{summary.studyTime}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Study Time</div>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-sm font-medium mb-2">Study Goal Progress</h3>
            <div className="mb-1 flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">Weekly Goal: 15 hours</span>
              <span className="text-xs font-medium">{summary.stats.studyGoalProgress}%</span>
            </div>
            <Progress value={summary.stats.studyGoalProgress} className="h-2 mb-4" />

            <h3 className="text-sm font-medium mb-2">Upcoming Deadlines</h3>
            <div className="space-y-2">
              {summary.upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-500" />
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm">{deadline.task}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{deadline.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Link href="/analytics">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <BarChart3 size={14} />
              View Detailed Analytics
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
