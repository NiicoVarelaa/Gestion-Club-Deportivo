import { Card, CardContent } from '@/components/ui/card'
import { TableSkeleton } from '@/components/Skeleton'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/Pagination'

export default function DataTable({ loading, skeleton = {}, isEmpty, emptyState, pagination, onPageChange, children }) {
  const { rows = 5, cols = 4 } = skeleton

  return (
    <Card>
      <CardContent className="p-0">
        {loading ? (
          <TableSkeleton rows={rows} cols={cols} />
        ) : isEmpty ? (
          <EmptyState
            icon={emptyState?.icon}
            title={emptyState?.title}
            description={emptyState?.description}
            action={emptyState?.action}
          />
        ) : (
          <>
            <div className="overflow-x-auto">{children}</div>
            {pagination && (
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                total={pagination.total}
                onPageChange={onPageChange}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}