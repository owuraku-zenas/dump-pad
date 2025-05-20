import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Lightbulb, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={24} className="text-blue-600" />
            <h1 className="text-2xl font-bold">Dump Pad</h1>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center">Page Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-xl" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-xl" />
          
          <div className="pt-6 space-y-4 relative">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* New Notebook and Pen illustration */}
              <div className="relative w-48 h-48">
                {/* Notebook base */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg transform rotate-3 shadow-lg" />
                
                {/* Notebook pages */}
                <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform -rotate-1">
                  {/* Spiral binding */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-blue-200 dark:bg-blue-700 rounded-l-lg">
                    <div className="absolute left-0.5 top-2 w-1 h-1 bg-blue-300 dark:bg-blue-600 rounded-full" />
                    <div className="absolute left-0.5 top-6 w-1 h-1 bg-blue-300 dark:bg-blue-600 rounded-full" />
                    <div className="absolute left-0.5 top-10 w-1 h-1 bg-blue-300 dark:bg-blue-600 rounded-full" />
                    <div className="absolute left-0.5 top-14 w-1 h-1 bg-blue-300 dark:bg-blue-600 rounded-full" />
                    <div className="absolute left-0.5 top-18 w-1 h-1 bg-blue-300 dark:bg-blue-600 rounded-full" />
                  </div>
                  
                  {/* Page lines */}
                  <div className="absolute left-4 right-2 top-4 bottom-4">
                    <div className="absolute top-2 left-0 right-0 h-0.5 bg-blue-100 dark:bg-blue-900/50" />
                    <div className="absolute top-6 left-0 right-0 h-0.5 bg-blue-100 dark:bg-blue-900/50" />
                    <div className="absolute top-10 left-0 right-0 h-0.5 bg-blue-100 dark:bg-blue-900/50" />
                    <div className="absolute top-14 left-0 right-0 h-0.5 bg-blue-100 dark:bg-blue-900/50" />
                    <div className="absolute top-18 left-0 right-0 h-0.5 bg-blue-100 dark:bg-blue-900/50" />
                  </div>
                </div>

                {/* Pen */}
                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 rotate-45">
                  {/* Pen body */}
                  <div className="relative">
                    <div className="w-28 h-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full shadow-md" />
                    {/* Pen tip */}
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-800 rounded-full" />
                    {/* Pen clip */}
                    <div className="absolute -top-1 left-4 w-1 h-4 bg-blue-700 rounded-full transform -rotate-45" />
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full opacity-50 blur-sm" />
                <div className="absolute -top-2 -left-2 w-3 h-3 bg-blue-400 rounded-full opacity-50 blur-sm" />
              </div>

              <div className="relative">
                <div className="text-6xl font-bold text-blue-600 mb-2">404</div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse" />
              </div>
              
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                Looks like this page got lost in your notes. Don't worry! You can always go back to the home page and start fresh.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center mt-8">
            <Link href="/" className="w-full max-w-xs">
              <Button className="w-full mb-4 bg-blue-600 hover:bg-blue-700 transition-colors">
                <ArrowLeft size={16} className="mr-2" />
                Back to Home
              </Button>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Need help?{" "}
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 