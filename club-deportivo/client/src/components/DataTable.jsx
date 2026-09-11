import { Card, CardContent } from './ui/card'
import { TableSkeleton } from './Skeleton'
import EmptyState from './EmptyState'
import Pagination from './Pagination'

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