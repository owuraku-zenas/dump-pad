"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes"
import { FolderOpen, Loader2, FileEdit, Lightbulb, Calendar, CheckCircle, BarChart3, ArrowRight, BookOpen, Tag } from "lucide-react"
import Link from "next/link"
import RecentNotes from "@/components/recent-notes"
import WeeklySummary from "@/components/weekly-summary"
import { useNotification } from "@/components/notification-provider"
import { useCategories } from "@/hooks/useCategories"
import { formatDistanceToNow } from "date-fns"

export default function Dashboard() {
  // All hooks must be called at the top level
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme } = useTheme()
  const { addNotification } = useNotification()
  const [activeTab, setActiveTab] = useState("overview")
  const { categories: apiCategories, isLoading, error } = useCategories()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Mock data for dashboard stats
  const stats = {
    totalNotes: 42,
    dumpNotes: 28,
    documents: 14,
    categories: 6,
    completedTasks: 18,
    totalTasks: 25,
    studyTime: "12h 30m",
    weeklyGoal: "15h",
    upcomingDeadlines: [
      { id: 1, title: "Complete Calculus Assignment", date: "Tomorrow, 11:59 PM", category: "Math Notes" },
      { id: 2, title: "Prepare ML Project Proposal", date: "May 15, 2023", category: "AI Research" },
      { id: 3, title: "Group Project Meeting", date: "May 16, 2023", category: "Group Project" },
    ],
  }

  // Mock data for activity
  const recentActivity = [
    {
      id: 1,
      action: "Created document",
      title: "Machine Learning Final Project Proposal",
      time: "2 hours ago",
      category: "AI Research",
    },
    { id: 2, action: "Added note", title: "Calculus Formulas Review", time: "Yesterday", category: "Math Notes" },
    {
      id: 3,
      action: "Completed task",
      title: "Research quantum computing basics",
      time: "2 days ago",
      category: "Physics Notes",
    },
    { id: 4, action: "Uploaded file", title: "Biology Lab Report.pdf", time: "3 days ago", category: "Biology" },
  ]

  // Mock categories with counts
  const categories = [
    { name: "AI Research", count: 12, color: "bg-blue-500" },
    { name: "Math Notes", count: 9, color: "bg-green-500" },
    { name: "Group Project", count: 7, color: "bg-purple-500" },
    { name: "Physics Notes", count: 6, color: "bg-amber-500" },
    { name: "Biology", count: 5, color: "bg-red-500" },
    { name: "Computer Science", count: 3, color: "bg-indigo-500" },
  ]

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back to Dump Pad</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link href="/notes/new?mode=dump">
            <Button variant="outline" className="flex items-center gap-2">
              <Lightbulb size={16} />
              New Idea
            </Button>
          </Link>
          <Link href="/notes/new?mode=doc">
            <Button className="flex items-center gap-2">
              <FileEdit size={16} />
              New Document
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Notes</CardDescription>
                <CardTitle className="text-2xl">{stats.totalNotes}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Lightbulb size={14} className="text-amber-500" />
                    <span>Ideas: {stats.dumpNotes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileEdit size={14} className="text-blue-500" />
                    <span>Docs: {stats.documents}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Task Completion</CardDescription>
                <CardTitle className="text-2xl">
                  {stats.completedTasks}/{stats.totalTasks}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <Progress value={(stats.completedTasks / stats.totalTasks) * 100} className="h-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {Math.round((stats.completedTasks / stats.totalTasks) * 100)}% complete
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Study Time</CardDescription>
                <CardTitle className="text-2xl">{stats.studyTime}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Weekly Goal: {stats.weeklyGoal}</span>
                  <Badge variant="outline">
                    {Math.round((Number.parseInt(stats.studyTime) / Number.parseInt(stats.weeklyGoal)) * 100)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Categories</CardDescription>
                <CardTitle className="text-2xl">{stats.categories}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-1">
                  {categories.slice(0, 5).map((category, index) => (
                    <div key={index} className={`w-2 h-2 rounded-full ${category.color}`}></div>
                  ))}
                  {categories.length > 5 && <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Most active: {categories[0].name}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Notes</CardTitle>
                    <Link href="/notes">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        View All <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <RecentNotes />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.upcomingDeadlines.map((deadline) => (
                      <div key={deadline.id} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{deadline.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {deadline.category}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{deadline.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/tasks">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Tasks
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="mt-6">
            <WeeklySummary />
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 pb-4 border-b dark:border-gray-700 last:border-0 last:pb-0"
                  >
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                      {activity.action.includes("Created") && <FileEdit size={18} className="text-blue-500" />}
                      {activity.action.includes("Added") && <Lightbulb size={18} className="text-amber-500" />}
                      {activity.action.includes("Completed") && <CheckCircle size={18} className="text-green-500" />}
                      {activity.action.includes("Uploaded") && <BookOpen size={18} className="text-purple-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{activity.action}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{activity.category}</Badge>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View More Activity
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Detailed analytics of your study patterns</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        addNotification({
                          title: "Analytics Feature Coming Soon",
                          message: "Detailed study analytics will be available in the next update!",
                          type: "info",
                        })
                      }}
                    >
                      View Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-4 text-red-500">
              Error loading categories: {(error as Error).message}
            </div>
          ) : apiCategories && apiCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apiCategories.map((category) => (
                <Card key={category.id} className="overflow-hidden">
                  <div className={`h-1`} style={{ backgroundColor: category.color || "#000000" }}></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <FolderOpen size={18} className={category.color?.replace("bg-", "text-")} />
                      <span>{category.name}</span>
                    </CardTitle>
                    <Badge variant="secondary">0</Badge>
                  </CardHeader>
                  <CardContent className="pb-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 mb-1">
                      <Lightbulb size={14} />
                      <span>Ideas: 0</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileEdit size={14} />
                      <span>Docs: 0</span>
                    </div>
                    {category.updatedAt && (
                      <p className="text-xs">Last updated: {formatDistanceToNow(new Date(category.updatedAt), { addSuffix: true })}</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end pt-2">
                    <Link href={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        View <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No categories found. Create your first category on the Categories page.
            </div>
          )}

          <div className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Popular Tags</CardTitle>
                  <Link href="/tags">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Tag size={12} /> project ideas{" "}
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(12)</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Tag size={12} /> exam prep{" "}
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(9)</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Tag size={12} /> research{" "}
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(8)</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Tag size={12} /> meeting notes{" "}
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(7)</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Tag size={12} /> important{" "}
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(6)</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Tag size={12} /> to-review{" "}
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(5)</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Tag size={12} /> formulas{" "}
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(4)</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Tag size={12} /> resources{" "}
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(4)</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Tag size={12} /> deadline{" "}
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(3)</span>
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
