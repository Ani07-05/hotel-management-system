import React from 'react'

interface TableProps {
  children: React.ReactNode
}

interface TableHeaderProps {
  children: React.ReactNode
}

interface TableBodyProps {
  children: React.ReactNode
}

interface TableRowProps {
  children: React.ReactNode
}

interface TableCellProps {
  children: React.ReactNode
  header?: boolean
}

export function Table({ children }: TableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse bg-gray-900 text-sm">{children}</table>
    </div>
  )
}

export function TableHeader({ children }: TableHeaderProps) {
  return <thead className="bg-gray-800">{children}</thead>
}

export function TableHead({ children }: TableCellProps) {
    return (
      <th className="px-4 py-3 text-left font-medium text-gray-300 [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </th>
    )
  }

export function TableBody({ children }: TableBodyProps) {
  return <tbody>{children}</tbody>
}

export function TableRow({ children }: TableRowProps) {
  return <tr className="border-b border-gray-700 last:border-0">{children}</tr>
}

export function TableCell({ children, header = false }: TableCellProps) {
  if (header) {
    return (
      <th className="px-4 py-3 text-left font-medium text-gray-300 [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </th>
    )
  }




  return (
    <td className="px-4 py-3 text-gray-300 [&[align=center]]:text-center [&[align=right]]:text-right">
      {children}
    </td>
  )
}

