'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React from 'react'
import { useScreen } from 'usehooks-ts'

import { Button } from '@/components/ui/button'
import { CaretRight, Filter, Sort } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const { width } = useScreen()
  const visiblePageCount = width <= 640 ? 3 : 5

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  })

  return (
    <div className="mb-10 h-full w-full">
      <div className="rounded-xl bg-white px-5 py-2 md:p-8 lg:py-6">
        <div className="flex items-center py-6">
          <Input
            placeholder="Search bills"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          <div className="ml-auto hidden gap-2 md:flex lg:gap-5">
            {/* Desktop Sorting*/}
            <div className="flex items-center gap-2">
              <label
                htmlFor="primary-sort-select"
                className="text-preset-5 font-normal text-grey-500"
              >
                Sort by
              </label>
              <Select
                name="primary-sort-select"
                onValueChange={(value) => {
                  let desc = false
                  if (value === 'latest') {
                    setSorting([{ id: 'date', desc: true }])
                  } else if (value === 'oldest') {
                    setSorting([{ id: 'date', desc: false }])
                  } else if (value === 'atoz') {
                    setSorting([{ id: 'name', desc: false }])
                  } else if (value === 'ztoa') {
                    setSorting([{ id: 'name', desc: true }])
                  } else if (value === 'highest') {
                    setSorting([{ id: 'amount', desc: true }])
                  } else if (value === 'lowers') {
                    setSorting([{ id: 'amount', desc: false }])
                  }
                }}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Latest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="atoz">A to Z</SelectItem>
                  <SelectItem value="ztoa">Z to A</SelectItem>
                  <SelectItem value="highest">Highest</SelectItem>
                  <SelectItem value="lowers">Lowers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Mobile Sorting */}
          <div className="ml-auto flex items-center gap-6 md:hidden">
            <Popover>
              <PopoverTrigger>
                <Sort />
              </PopoverTrigger>
              <PopoverContent align="end" className="w-32 p-2">
                <Button
                  onClick={() => setSorting([{ id: 'date', desc: true }])}
                  variant="tertiary"
                  className="w-full"
                  size="sm"
                >
                  Latest
                </Button>
                <hr />
                <Button
                  variant="tertiary"
                  className="w-full"
                  size="sm"
                  onClick={() => setSorting([{ id: 'date', desc: false }])}
                >
                  Oldest
                </Button>
                <hr />
                <Button
                  variant="tertiary"
                  className="w-full"
                  size="sm"
                  onClick={() => setSorting([{ id: 'name', desc: false }])}
                >
                  A to Z
                </Button>
                <hr />
                <Button
                  variant="tertiary"
                  className="w-full"
                  size="sm"
                  onClick={() => setSorting([{ id: 'name', desc: true }])}
                >
                  Z to A
                </Button>
                <hr />
                <Button
                  variant="tertiary"
                  className="w-full"
                  size="sm"
                  onClick={() => setSorting([{ id: 'amount', desc: true }])}
                >
                  Highest
                </Button>
                <hr />
                <Button
                  variant="tertiary"
                  className="w-full"
                  size="sm"
                  onClick={() => setSorting([{ id: 'amount', desc: false }])}
                >
                  Lowers
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <Button
            variant="secondary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="rotate-180">
              <CaretRight />
            </span>
            <p className="hidden md:block">Prew</p>
          </Button>
          <div>
            <Pagination>
              <PaginationContent>
                {Array.from(
                  { length: Math.min(table.getPageCount(), visiblePageCount) },
                  (_, index) => (
                    <PaginationItem key={index}>
                      <Button
                        variant={
                          table.getState().pagination.pageIndex === index
                            ? 'default'
                            : 'secondary'
                        }
                        size="sm"
                        onClick={() => table.setPageIndex(index)}
                      >
                        {index + 1}
                      </Button>
                    </PaginationItem>
                  )
                )}
                {table.getPageCount() > visiblePageCount && (
                  <PaginationEllipsis />
                )}
              </PaginationContent>
            </Pagination>
          </div>
          <Button
            variant="secondary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <p className="hidden md:block">Next</p>
            <span>
              <CaretRight />
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
