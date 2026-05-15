import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'

export default function Pagination({ page, pages, total, onPageChange }) {
  if (pages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t px-4 py-3">
      <p className="text-sm text-muted-foreground">
        {total} resultados
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: Math.min(pages, 5) }).map((_, i) => {
          let pageNum
          if (pages <= 5) {
            pageNum = i + 1
          } else if (page <= 3) {
            pageNum = i + 1
          } else if (page >= pages - 2) {
            pageNum = pages - 4 + i
          } else {
            pageNum = page - 2 + i
          }
          return (
            <Button
              key={pageNum}
              variant={page === pageNum ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </Button>
          )
        })}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
