"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertCircle,
  ArrowLeft,
  User,
  Moon,
  Sun,
  Monitor,
  Bell,
  Lock,
  Download,
  HardDrive,
  Cpu,
  Sparkles,
  Check,
  RefreshCw,
  Trash,
  Laptop,
  Zap,
  Star,
  StarHalf,
  Clock,
  FileText,
  Search,
  Cloud,
  Key,
  Eye,
  EyeOff,
  Plus,
  ExternalLink,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useNotification } from "@/components/notification-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for installed and available LLMs
const installedModels = [
  {
    id: "gpt4-mini",
    name: "GPT-4 Mini",
    provider: "OpenAI",
    size: "2.7 GB",
    version: "1.0.0",
    date: "2023-12-15",
    description: "Lightweight version of GPT-4 optimized for local execution",
    capabilities: ["Text generation", "Summarization", "Q&A"],
    requirements: {
      ram: "8 GB",
      disk: "4 GB",
      cpu: "4 cores",
      gpu: "Optional",
    },
    status: "active",
  },
  {
    id: "llama-7b",
    name: "Llama 2 (7B)",
    provider: "Meta",
    size: "4.2 GB",
    version: "2.1.0",
    date: "2023-10-20",
    description: "Open source large language model from Meta",
    capabilities: ["Text generation", "Code completion", "Translation"],
    requirements: {
      ram: "16 GB",
      disk: "8 GB",
      cpu: "4 cores",
      gpu: "Recommended",
    },
    status: "active",
  },
]

const availableModels = [
  {
    id: "gpt4-full",
    name: "GPT-4 Full",
    provider: "OpenAI",
    size: "8.3 GB",
    version: "1.2.0",
    date: "2024-01-10",
    description: "Complete GPT-4 model with enhanced capabilities",
    capabilities: ["Advanced reasoning", "Complex task solving", "Creative writing", "Code generation"],
    requirements: {
      ram: "16 GB",
      disk: "12 GB",
      cpu: "8 cores",
      gpu: "Required (4GB VRAM)",
    },
    rating: 4.9,
    downloads: "125K+",
  },
  {
    id: "claude-instant-local",
    name: "Claude Instant Local",
    provider: "Anthropic",
    size: "3.1 GB",
    version: "1.0.2",
    date: "2023-11-05",
    description: "Fast and efficient assistant model from Anthropic",
    capabilities: ["Text generation", "Summarization", "Q&A", "Content moderation"],
    requirements: {
      ram: "8 GB",
      disk: "6 GB",
      cpu: "4 cores",
      gpu: "Optional",
    },
    rating: 4.7,
    downloads: "98K+",
  },
  {
    id: "llama-13b",
    name: "Llama 2 (13B)",
    provider: "Meta",
    size: "7.8 GB",
    version: "2.1.0",
    date: "2023-10-20",
    description: "Larger version of Llama 2 with improved capabilities",
    capabilities: ["Advanced text generation", "Complex reasoning", "Code generation", "Translation"],
    requirements: {
      ram: "24 GB",
      disk: "16 GB",
      cpu: "8 cores",
      gpu: "Required (8GB VRAM)",
    },
    rating: 4.8,
    downloads: "75K+",
  },
  {
    id: "mistral-7b",
    name: "Mistral 7B",
    provider: "Mistral AI",
    size: "4.1 GB",
    version: "1.0.0",
    date: "2023-12-01",
    description: "High-performance open-source 7B parameter model",
    capabilities: ["Text generation", "Instruction following", "Reasoning"],
    requirements: {
      ram: "16 GB",
      disk: "8 GB",
      cpu: "4 cores",
      gpu: "Recommended",
    },
    rating: 4.6,
    downloads: "62K+",
  },
  {
    id: "phi-2",
    name: "Phi-2",
    provider: "Microsoft",
    size: "2.5 GB",
    version: "1.0.0",
    date: "2023-12-12",
    description: "Small but powerful model with strong reasoning capabilities",
    capabilities: ["Text generation", "Code completion", "Common sense reasoning"],
    requirements: {
      ram: "8 GB",
      disk: "4 GB",
      cpu: "4 cores",
      gpu: "Optional",
    },
    rating: 4.5,
    downloads: "45K+",
  },
]

// Mock data for API-based models
const apiModels = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "OpenAI's most advanced model with vision capabilities",
    capabilities: ["Advanced reasoning", "Image understanding", "Creative writing", "Code generation"],
    pricing: "$0.01/1K tokens",
    apiKeyConfigured: true,
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    description: "Anthropic's most capable model for complex tasks",
    capabilities: ["Advanced reasoning", "Long context", "Nuanced instructions", "Factual responses"],
    pricing: "$15/million tokens",
    apiKeyConfigured: false,
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    description: "Google's multimodal AI system",
    capabilities: ["Text generation", "Image understanding", "Code generation"],
    pricing: "$0.0025/1K tokens",
    apiKeyConfigured: false,
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral AI",
    description: "Mistral AI's flagship model for enterprise use",
    capabilities: ["Advanced reasoning", "Instruction following", "Code generation"],
    pricing: "$8/million tokens",
    apiKeyConfigured: false,
  },
]

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { addNotification } = useNotification()
  const [activeTab, setActiveTab] = useState("appearance")
  const [downloadingModel, setDownloadingModel] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [installingModel, setInstallingModel] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [modelFilter, setModelFilter] = useState("all")
  const [apiKeysVisible, setApiKeysVisible] = useState<Record<string, boolean>>({})
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    "gpt-4o": "sk-••••••••••••••••••••••••••••••••",
  })
  const [modelsTab, setModelsTab] = useState("local")

  // Toggle API key visibility
  const toggleApiKeyVisibility = (modelId: string) => {
    setApiKeysVisible((prev) => ({
      ...prev,
      [modelId]: !prev[modelId],
    }))
  }

  // Update API key
  const updateApiKey = (modelId: string, value: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [modelId]: value,
    }))
  }

  // Save API key
  const saveApiKey = (modelId: string) => {
    addNotification({
      title: "API Key Saved",
      message: `API key for ${apiModels.find((m) => m.id === modelId)?.name} has been securely saved.`,
      type: "success",
    })
  }

  // Filter available models based on search query and filter
  const filteredModels = availableModels.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase())

    const sizeNumber = Number.parseFloat(model.size.split(" ")[0])
    if (modelFilter === "all") return matchesSearch
    if (modelFilter === "small" && sizeNumber < 5) return matchesSearch
    if (modelFilter === "large" && sizeNumber >= 5) return matchesSearch
    return matchesSearch
  })

  // Mock download function
  const downloadModel = (modelId: string) => {
    setDownloadingModel(modelId)
    setDownloadProgress(0)

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setDownloadingModel(null)
          setInstallingModel(modelId)

          // Simulate installation
          setTimeout(() => {
            setInstallingModel(null)
            addNotification({
              title: "Model Installed",
              message: `${availableModels.find((m) => m.id === modelId)?.name} has been installed successfully.`,
              type: "success",
            })
          }, 2000)

          return 0
        }
        return prev + 5
      })
    }, 200)
  }

  // Mock uninstall function
  const uninstallModel = (modelId: string) => {
    addNotification({
      title: "Model Uninstalled",
      message: `${installedModels.find((m) => m.id === modelId)?.name} has been uninstalled.`,
      type: "info",
    })
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="ai-models">AI Models</TabsTrigger>
        </TabsList>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>Customize the appearance of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      theme === "light" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                    onClick={() => setTheme("light")}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="bg-white border shadow-sm rounded-md p-2">
                        <Sun size={24} className="text-amber-500" />
                      </div>
                      {theme === "light" && <Check size={20} className="text-blue-500" />}
                    </div>
                    <h3 className="font-medium">Light</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Light mode for daytime use</p>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      theme === "dark" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                    onClick={() => setTheme("dark")}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="bg-gray-900 border border-gray-700 shadow-sm rounded-md p-2">
                        <Moon size={24} className="text-gray-100" />
                      </div>
                      {theme === "dark" && <Check size={20} className="text-blue-500" />}
                    </div>
                    <h3 className="font-medium">Dark</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Dark mode for reduced eye strain</p>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      theme === "system" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                    onClick={() => setTheme("system")}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="bg-gradient-to-r from-white to-gray-900 border shadow-sm rounded-md p-2">
                        <Monitor size={24} className="text-blue-500" />
                      </div>
                      {theme === "system" && <Check size={20} className="text-blue-500" />}
                    </div>
                    <h3 className="font-medium">System</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Follow your system preferences</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Editor Preferences</CardTitle>
                <CardDescription>Customize your editing experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="font-size">Font Size</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Adjust the font size in the editor</p>
                  </div>
                  <Select defaultValue="medium">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-save">Auto Save</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Automatically save your notes while typing
                    </p>
                  </div>
                  <Switch id="auto-save" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="spell-check">Spell Check</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enable spell checking in the editor</p>
                  </div>
                  <Switch id="spell-check" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="line-numbers">Line Numbers</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Show line numbers in document mode</p>
                  </div>
                  <Switch id="line-numbers" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications about your account via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Desktop Notifications</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications on your desktop</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Reminders</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get reminders about upcoming tasks and deadlines
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Summary</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive a weekly summary of your activity</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Updates</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive updates about new features and promotions
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage your privacy and data preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Collection</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow anonymous usage data collection to improve the app
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cloud Sync</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sync your notes and settings across devices
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>End-to-End Encryption</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enable end-to-end encryption for your notes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your data and export options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Export Your Data</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Download all your notes and documents</p>
                  </div>
                  <Button variant="outline">Export Data</Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Clear Local Data</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Clear all locally stored data and cache</p>
                  </div>
                  <Button variant="outline">Clear Data</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Models Settings */}
        <TabsContent value="ai-models">
          <div className="grid gap-6">
            <Tabs value={modelsTab} onValueChange={setModelsTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="local" className="flex items-center gap-2">
                  <HardDrive size={16} />
                  <span>Local Models</span>
                </TabsTrigger>
                <TabsTrigger value="api" className="flex items-center gap-2">
                  <Cloud size={16} />
                  <span>API Models</span>
                </TabsTrigger>
              </TabsList>

              {/* Local Models Tab */}
              <TabsContent value="local" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Local AI Model Marketplace</CardTitle>
                    <CardDescription>Browse and download AI language models for local use</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <Input
                          type="text"
                          placeholder="Search models..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Select value={modelFilter} onValueChange={setModelFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter models" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Models</SelectItem>
                          <SelectItem value="small">Small Models (&lt;5GB)</SelectItem>
                          <SelectItem value="large">Large Models (≥5GB)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredModels.map((model) => (
                        <Card key={model.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  <Sparkles size={16} className="text-blue-500" />
                                  {model.name}
                                </CardTitle>
                                <CardDescription>
                                  {model.provider} • {model.size} • v{model.version}
                                </CardDescription>
                              </div>
                              <div className="flex items-center">
                                <div className="flex items-center mr-2">
                                  {model.rating >= 4.5 ? (
                                    <Star size={14} className="text-amber-500 fill-amber-500" />
                                  ) : (
                                    <StarHalf size={14} className="text-amber-500 fill-amber-500" />
                                  )}
                                  <span className="text-sm ml-1">{model.rating}</span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {model.downloads}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{model.description}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {model.capabilities.map((capability, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {capability}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <HardDrive size={12} />
                                <span>Disk: {model.requirements.disk}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Cpu size={12} />
                                <span>CPU: {model.requirements.cpu}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap size={12} />
                                <span>RAM: {model.requirements.ram}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-2">
                            {downloadingModel === model.id ? (
                              <div className="w-full space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span>Downloading...</span>
                                  <span>{downloadProgress}%</span>
                                </div>
                                <Progress value={downloadProgress} className="h-2" />
                              </div>
                            ) : installingModel === model.id ? (
                              <Button disabled className="w-full">
                                <RefreshCw size={16} className="mr-2 animate-spin" />
                                Installing...
                              </Button>
                            ) : (
                              <Button variant="outline" className="w-full" onClick={() => downloadModel(model.id)}>
                                <Download size={16} className="mr-2" />
                                Download
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Installed Models</CardTitle>
                    <CardDescription>Manage your installed AI language models</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {installedModels.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                          <Sparkles size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No models installed</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                          Download models from the marketplace to use them locally
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {installedModels.map((model) => (
                          <div
                            key={model.id}
                            className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-md"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">{model.name}</h3>
                                <Badge
                                  variant={model.status === "active" ? "outline" : "secondary"}
                                  className="text-xs"
                                >
                                  {model.status === "active" ? (
                                    <span className="flex items-center gap-1">
                                      <span className="h-2 w-2 rounded-full bg-green-500"></span> Active
                                    </span>
                                  ) : (
                                    "Inactive"
                                  )}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span>{model.provider}</span>
                                <span>•</span>
                                <span>v{model.version}</span>
                                <span>•</span>
                                <span>{model.size}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  Installed on {model.date}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 self-end sm:self-auto">
                              {model.status === "active" ? (
                                <Button variant="outline" size="sm">
                                  <FileText size={14} className="mr-1" /> View Logs
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm">
                                  <Zap size={14} className="mr-1" /> Activate
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500"
                                onClick={() => uninstallModel(model.id)}
                              >
                                <Trash size={14} className="mr-1" /> Uninstall
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Requirements</CardTitle>
                    <CardDescription>Check if your system meets the requirements for running AI models</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-md">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">System Check</h3>
                            <Badge variant="outline" className="text-xs">
                              <span className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span> Compatible
                              </span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Your system is compatible with most AI models
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <RefreshCw size={14} className="mr-1" /> Run Check
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <Cpu size={18} className="text-blue-500" />
                            <h3 className="font-medium">CPU</h3>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Intel Core i7-10700K</span>
                            <Badge variant="outline" className="text-xs">
                              8 cores
                            </Badge>
                          </div>
                          <Progress value={70} className="h-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Suitable for most models</p>
                        </div>

                        <div className="p-4 border rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap size={18} className="text-blue-500" />
                            <h3 className="font-medium">RAM</h3>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">32 GB DDR4</span>
                            <Badge variant="outline" className="text-xs">
                              16 GB available
                            </Badge>
                          </div>
                          <Progress value={85} className="h-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Suitable for most models</p>
                        </div>

                        <div className="p-4 border rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <HardDrive size={18} className="text-blue-500" />
                            <h3 className="font-medium">Storage</h3>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">1 TB SSD</span>
                            <Badge variant="outline" className="text-xs">
                              450 GB available
                            </Badge>
                          </div>
                          <Progress value={95} className="h-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Suitable for all models</p>
                        </div>

                        <div className="p-4 border rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <Laptop size={18} className="text-blue-500" />
                            <h3 className="font-medium">GPU</h3>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">NVIDIA RTX 3070</span>
                            <Badge variant="outline" className="text-xs">
                              8 GB VRAM
                            </Badge>
                          </div>
                          <Progress value={80} className="h-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Suitable for most models</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* API Models Tab */}
              <TabsContent value="api" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API-Based AI Models</CardTitle>
                    <CardDescription>Configure cloud AI models that require API keys</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert variant="warning" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Security Notice</AlertTitle>
                      <AlertDescription>
                        API keys provide access to paid services and should be kept secure. In a production app, these
                        would be stored in a secure vault and never directly in the application.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-6">
                      {apiModels.map((model) => (
                        <div key={model.id} className="p-4 border rounded-md space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h3 className="text-lg font-medium flex items-center gap-2">
                                <Sparkles size={18} className="text-blue-500" />
                                {model.name}
                                <Badge variant="outline" className="ml-2">
                                  {model.provider}
                                </Badge>
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{model.description}</p>
                            </div>
                            <Badge variant="secondary" className="self-start sm:self-center">
                              {model.pricing}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-2">
                            {model.capabilities.map((capability, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {capability}
                              </Badge>
                            ))}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`api-key-${model.id}`} className="flex items-center gap-2">
                              <Key size={14} />
                              API Key
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 rounded-full"
                                      onClick={() => {
                                        window.open(
                                          model.provider === "OpenAI"
                                            ? "https://platform.openai.com/api-keys"
                                            : model.provider === "Anthropic"
                                              ? "https://console.anthropic.com/keys"
                                              : model.provider === "Google"
                                                ? "https://ai.google.dev/tutorials/setup"
                                                : "https://console.mistral.ai/api-keys/",
                                          "_blank",
                                        )
                                      }}
                                    >
                                      <ExternalLink size={12} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Get API key from {model.provider}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Input
                                  id={`api-key-${model.id}`}
                                  type={apiKeysVisible[model.id] ? "text" : "password"}
                                  placeholder={`Enter your ${model.provider} API key`}
                                  value={apiKeys[model.id] || ""}
                                  onChange={(e) => updateApiKey(model.id, e.target.value)}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                  onClick={() => toggleApiKeyVisibility(model.id)}
                                >
                                  {apiKeysVisible[model.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                </Button>
                              </div>
                              <Button
                                onClick={() => saveApiKey(model.id)}
                                disabled={!apiKeys[model.id] || apiKeys[model.id].length < 10}
                              >
                                Save
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2.5 w-2.5 rounded-full ${
                                  apiKeys[model.id] ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                                }`}
                              ></div>
                              <span className="text-sm">
                                {apiKeys[model.id] ? "API Key Configured" : "API Key Not Configured"}
                              </span>
                            </div>
                            <Switch
                              checked={Boolean(apiKeys[model.id])}
                              disabled={!apiKeys[model.id]}
                              onCheckedChange={() => {
                                if (apiKeys[model.id]) {
                                  updateApiKey(model.id, "")
                                  addNotification({
                                    title: "API Key Removed",
                                    message: `API key for ${model.name} has been removed.`,
                                    type: "info",
                                  })
                                }
                              }}
                            />
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-center">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Plus size={16} />
                          Add Custom API Model
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>API Settings</CardTitle>
                    <CardDescription>Configure how API models are used in the application</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Default API Model</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Select the default API model to use when available
                        </p>
                      </div>
                      <Select defaultValue="gpt-4o">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                          <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Fallback to Local Models</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Use local models when API models are unavailable
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>API Usage Limits</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Set monthly budget limits for API usage
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">$</span>
                        <Input
                          type="number"
                          className="w-24"
                          placeholder="10.00"
                          defaultValue="10.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>API Request Timeout</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Maximum time to wait for API responses
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input type="number" className="w-24" placeholder="30" defaultValue="30" min="5" max="120" />
                        <span className="text-sm">seconds</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>AI Settings</CardTitle>
                <CardDescription>Configure how AI models are used in the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Preferred Model Type</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose which type of model to prioritize</p>
                  </div>
                  <Select defaultValue="api">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api">API Models (Cloud)</SelectItem>
                      <SelectItem value="local">Local Models</SelectItem>
                      <SelectItem value="auto">Auto (Best Available)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Offline Mode</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Use only locally installed models when offline
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Update Models</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Automatically update installed models when new versions are available
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Model Performance</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Optimize for performance or accuracy</p>
                  </div>
                  <Select defaultValue="balanced">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="speed">Speed</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="accuracy">Accuracy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
