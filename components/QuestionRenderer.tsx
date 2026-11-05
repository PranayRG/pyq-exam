'use client'

import React from 'react'

interface QuestionRendererProps {
  questionText: string
  image?: string
}

export default function QuestionRenderer({ questionText, image }: QuestionRendererProps) {
  // Check if text has a pipe table
  const renderContent = () => {
    const lines = questionText.split('\n')
    const elements: React.ReactNode[] = []
    let currentTextLines: string[] = []
    let inTable = false
    let tableLines: string[] = []

    const flushText = () => {
      if (currentTextLines.length > 0) {
        const textBlock = currentTextLines.join('\n').trim()
        if (textBlock) {
          elements.push(
            <div key={`text-${elements.length}`} className="whitespace-pre-line text-gray-900 leading-relaxed">
              {textBlock}
            </div>
          )
        }
        currentTextLines = []
      }
    }

    const flushTable = () => {
      if (tableLines.length > 0) {
        const rows = tableLines.map(line =>
          line.split('|').map(cell => cell.trim()).filter((_, idx, arr) => {
            // keep cells between first and last if leading/trailing pipe
            return idx !== 0 || arr[0] !== ''
          })
        )

        if (rows.length > 0) {
          const headerRow = rows[0]
          const dataRows = rows.slice(1).filter(r => !r.every(c => /^[-:]+$/.test(c))) // filter out markdown separator row |---|---|

          elements.push(
            <div key={`table-${elements.length}`} className="my-4 overflow-x-auto rounded-xl border border-gray-300 shadow-sm bg-white">
              <table className="min-w-full divide-y divide-gray-300 text-sm">
                <thead className="bg-blue-50/80 text-blue-950 font-bold">
                  <tr>
                    {headerRow.map((col, colIdx) => (
                      <th
                        key={colIdx}
                        className="py-3 px-4 text-center font-bold tracking-wide border-r last:border-r-0 border-gray-300"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {dataRows.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className={rowIdx % 2 === 0 ? 'bg-white hover:bg-blue-50/30' : 'bg-gray-50/60 hover:bg-blue-50/30'}
                    >
                      {row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className="py-2.5 px-4 text-center text-gray-800 font-medium border-r last:border-r-0 border-gray-200"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        tableLines = []
      }
    }

    lines.forEach((line) => {
      const isTableLine = line.includes('|') && line.trim().startsWith('|') || (line.includes('|') && line.split('|').length >= 3)
      
      if (isTableLine) {
        if (!inTable) {
          flushText()
          inTable = true
        }
        tableLines.push(line)
      } else {
        if (inTable) {
          flushTable()
          inTable = false
        }
        currentTextLines.push(line)
      }
    })

    if (inTable) {
      flushTable()
    } else {
      flushText()
    }

    return elements
  }

  return (
    <div className="space-y-3">
      {/* Optional Question Image */}
      {image && (
        <div className="my-4 max-w-xl mx-auto rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white p-2">
          <img
            src={image}
            alt="Question Diagram"
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>
      )}

      {/* Formatted Text & Tables */}
      {renderContent()}
    </div>
  )
}
