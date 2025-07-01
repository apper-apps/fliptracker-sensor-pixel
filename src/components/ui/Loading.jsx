import React from 'react'

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Project Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="card overflow-hidden animate-pulse">
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300" />
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-5 bg-gray-200 rounded-full w-16" />
              </div>
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="flex items-center justify-between pt-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Update Cards Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="card p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-5 bg-gray-200 rounded-full w-16" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
                <div className="h-6 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded" />
            </div>
            <div className="space-y-3 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading