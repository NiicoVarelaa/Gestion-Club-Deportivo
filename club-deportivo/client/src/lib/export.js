import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { formatCurrency, formatDate, MESES } from '../lib/utils'

export function exportToPDF({ title, columns, rows, filename = 'reporte' }) {
  const doc = new jsPDF()
  doc.setFontSize(14)
  doc.text(title, 14, 16)
  doc.setFontSize(10)
  doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')}`, 14, 24)

  const tableColumns = columns.map((col) => col.header)
  const tableRows = rows.map((row) => columns.map((col) => row[col.accessor] ?? ''))

  doc.autoTable({
    startY: 28,
    head: [tableColumns],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 8 },
  })

  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`)
}

export function exportToExcel({ columns, rows, filename = 'reporte' }) {
  const data = rows.map((row) => {
    const obj = {}
    columns.forEach((col) => {
      obj[col.header] = row[col.accessor] ?? ''
    })
    return obj
  })

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Datos')
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export function pagosExportColumns() {
  return [
    { header: 'Socio', accessor: 'socio' },
    { header: 'Deporte', accessor: 'deporte' },
    { header: 'Periodo', accessor: 'periodo' },
    { header: 'Monto', accessor: 'monto' },
    { header: 'Estado', accessor: 'estado' },
    { header: 'Fecha Pago', accessor: 'fechaPago' },
  ]
}

export function formatPagoForExport(pago) {
  return {
    socio: `${pago.socio?.nombre || ''} ${pago.socio?.apellido || ''}`,
    deporte: pago.deporte?.nombre || '',
    periodo: `${MESES[pago.mes - 1] || ''} ${pago.anio}`,
    monto: formatCurrency(pago.monto),
    estado: pago.estado,
    fechaPago: pago.fechaPago ? formatDate(pago.fechaPago) : '-',
  }
}

export function inscripcionesExportColumns() {
  return [
    { header: 'Socio', accessor: 'socio' },
    { header: 'Deporte', accessor: 'deporte' },
    { header: 'Fecha Inscripcion', accessor: 'fecha' },
    { header: 'Estado', accessor: 'estado' },
  ]
}

export function formatInscripcionForExport(insc) {
  return {
    socio: `${insc.socio?.nombre || ''} ${insc.socio?.apellido || ''}`,
    deporte: insc.deporte?.nombre || '',
    fecha: formatDate(insc.fechaInscripcion),
    estado: insc.activo ? 'Activo' : 'Inactivo',
  }
}

export function sociosExportColumns() {
  return [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Apellido', accessor: 'apellido' },
    { header: 'DNI', accessor: 'dni' },
    { header: 'Email', accessor: 'email' },
    { header: 'Telefono', accessor: 'telefono' },
    { header: 'Estado', accessor: 'estado' },
  ]
}

export function formatSocioForExport(socio) {
  return {
    nombre: socio.nombre || '',
    apellido: socio.apellido || '',
    dni: socio.dni || '',
    email: socio.email || '',
    telefono: socio.telefono || '',
    estado: socio.activo ? 'Activo' : 'Inactivo',
  }
}
