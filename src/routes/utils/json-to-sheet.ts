import * as XLSX from 'xlsx'
import moment from 'moment'

function s2ab (s: string): ArrayBuffer {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff
  }
  return buf
}

export async function generateExcel (data: any[]): Promise<void> {
  // Create a new workbook and add a worksheet
  try {
    const excelName = `checklist-${moment().format('DD.MM.YYYY.h.mm.ss') as string}.xlsx`

    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(data)

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    const file = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' })

    const blob = new Blob([s2ab(file)], { type: 'application/octet-stream' })

    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = excelName
    setTimeout(() => {
      downloadLink.click()
      void Promise.resolve()
    }, 1000)
  } catch (error) {
    await Promise.reject(error)
  }
}
