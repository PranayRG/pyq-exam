'use client'

import React from 'react'
import katex from 'katex'

interface QuestionRendererProps {
  questionText: string
  image?: string
}

// Helper to render text with inline/block math equations: $...$ or $$...$$
export function renderMathAndText(text: string): React.ReactNode {
  if (!text) return null

  // If text contains $...$, parse math segments
  const parts: React.ReactNode[] = []
  const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = mathRegex.exec(text)) !== null) {
    // Plain text before math
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    const rawMatch = match[0]
    const isDisplay = rawMatch.startsWith('$$')
    const mathContent = isDisplay ? rawMatch.slice(2, -2) : rawMatch.slice(1, -1)

    try {
      const html = katex.renderToString(mathContent, {
        displayMode: isDisplay,
        throwOnError: false,
      })
      parts.push(
        <span
          key={`math-${match.index}`}
          dangerouslySetInnerHTML={{ __html: html }}
          className={isDisplay ? 'my-2 block overflow-x-auto text-center' : 'inline-block mx-0.5'}
        />
      )
    } catch {
      parts.push(rawMatch)
    }

    lastIndex = match.index + rawMatch.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

const labelRegex = /^([A-Z]\.?|\([A-Z]\)|[IVXLCDM]+\.?|\([IVXLCDM]+\)|\d+\.?)\s*(.*)$/i

export default function QuestionRenderer({ questionText, image }: QuestionRendererProps) {
  const renderContent = () => {
    const lines = questionText.split('\n')
    const elements: React.ReactNode[] = []
    let currentTextLines: string[] = []
    let inTable = false
    let tableRawLines: string[] = []

    const flushText = () => {
      if (currentTextLines.length > 0) {
        const textBlock = currentTextLines.join('\n').trim()
        if (textBlock) {
          elements.push(
            <div key={`text-${elements.length}`} className="whitespace-pre-line text-gray-900 leading-relaxed text-base">
              {renderMathAndText(textBlock)}
            </div>
          )
        }
        currentTextLines = []
      }
    }

    const flushTable = () => {
      if (tableRawLines.length > 0) {
        // Parse rows, stripping leading and trailing pipes
        const parsedRows: string[][] = []

        tableRawLines.forEach(line => {
          let trimmed = line.trim()
          if (trimmed.startsWith('|')) trimmed = trimmed.slice(1)
          if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1)

          const cells = trimmed.split('|').map(c => c.trim())
          const isSeparator = cells.every(c => /^[-:\s]+$/.test(c))

          // Ignore separator rows (like |---|---|)
          if (!isSeparator && cells.length > 0) {
            parsedRows.push(cells)
          }
        })

        if (parsedRows.length > 0) {
          const headerRow = parsedRows[0]
          const dataRows = parsedRows.slice(1)
          const columnCount = headerRow.length

          // Check if this is a Match-the-Following table with 2 columns that have A/B/C/D and I/II/III/IV labels
          const isMatchingListTable =
            columnCount === 2 &&
            dataRows.length > 0 &&
            dataRows.every(r => {
              const match0 = r[0] ? labelRegex.exec(r[0]) : null
              const match1 = r[1] ? labelRegex.exec(r[1]) : null
              return match0 !== null && match1 !== null
            })

          if (isMatchingListTable) {
            // Render official NTA 4-column layout (Label A | Item A | Label I | Item I)
            elements.push(
              <div key={`match-table-${elements.length}`} className="my-4 overflow-x-auto rounded-xl border border-gray-400 shadow-sm bg-white">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-blue-50/80 text-blue-950 font-bold border-b border-gray-400">
                    <tr>
                      <th colSpan={2} className="py-2.5 px-4 text-center font-bold tracking-wide border-r-2 border-gray-400">
                        {renderMathAndText(headerRow[0])}
                      </th>
                      <th colSpan={2} className="py-2.5 px-4 text-center font-bold tracking-wide">
                        {renderMathAndText(headerRow[1])}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300 bg-white">
                    {dataRows.map((row, rowIdx) => {
                      const match0 = labelRegex.exec(row[0] || '') || ['', row[0] || '', '']
                      const match1 = labelRegex.exec(row[1] || '') || ['', row[1] || '', '']

                      return (
                        <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white hover:bg-blue-50/30' : 'bg-gray-50/50 hover:bg-blue-50/30'}>
                          {/* Col 1: Label A, B, C, D */}
                          <td className="w-12 py-2 px-3 text-center font-bold text-gray-900 border-r border-gray-300 bg-gray-50/70">
                            {match0[1]}
                          </td>
                          {/* Col 2: Content for List I */}
                          <td className="py-2 px-4 text-left font-medium text-gray-800 border-r-2 border-gray-400">
                            {renderMathAndText(match0[2])}
                          </td>
                          {/* Col 3: Label I, II, III, IV */}
                          <td className="w-14 py-2 px-3 text-center font-bold text-gray-900 border-r border-gray-300 bg-gray-50/70">
                            {match1[1]}
                          </td>
                          {/* Col 4: Content for List II */}
                          <td className="py-2 px-4 text-left font-medium text-gray-800">
                            {renderMathAndText(match1[2])}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          } else {
            // Standard multi-column Data Interpretation table (like Q1-Q5)
            elements.push(
              <div key={`table-${elements.length}`} className="my-4 overflow-x-auto rounded-xl border border-gray-300 shadow-sm bg-white">
                <table className="min-w-full divide-y divide-gray-300 text-sm">
                  <thead className="bg-blue-50/90 text-blue-950 font-bold">
                    <tr>
                      {headerRow.map((col, colIdx) => (
                        <th
                          key={colIdx}
                          className="py-3 px-4 text-center font-bold tracking-wide border-r last:border-r-0 border-gray-300"
                        >
                          {renderMathAndText(col)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {dataRows.map((row, rowIdx) => {
                      const normalizedCells = row.slice(0, columnCount)
                      while (normalizedCells.length < columnCount) {
                        normalizedCells.push('')
                      }

                      return (
                        <tr
                          key={rowIdx}
                          className={rowIdx % 2 === 0 ? 'bg-white hover:bg-blue-50/40' : 'bg-gray-50/70 hover:bg-blue-50/40'}
                        >
                          {normalizedCells.map((cell, cellIdx) => (
                            <td
                              key={cellIdx}
                              className="py-2.5 px-4 text-center text-gray-800 font-medium border-r last:border-r-0 border-gray-200"
                            >
                              {renderMathAndText(cell)}
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          }
        }
        tableRawLines = []
      }
    }

    lines.forEach(line => {
      const trimmed = line.trim()
      const isTableLine = (trimmed.startsWith('|') && trimmed.endsWith('|')) || (trimmed.includes('|') && trimmed.split('|').length >= 3)

      if (isTableLine) {
        if (!inTable) {
          flushText()
          inTable = true
        }
        tableRawLines.push(line)
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
      {/* Optional Diagram / Image */}
      {image && (
        <div className="my-4 max-w-xl mx-auto rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white p-2">
          <img
            src={image}
            alt="Question Diagram"
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>
      )}

      {/* Formatted Content with Tables & Math */}
      {renderContent()}
    </div>
  )
}
