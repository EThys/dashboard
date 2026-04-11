import { jsPDF } from 'jspdf'
import type { PaymentRow } from '@/stores/payment'

interface PaymentUser {
  userId: number
  email?: string
  username?: string
  phone?: string
}

interface FlatPaymentRow {
  user: PaymentUser
  payment: PaymentRow & { userId?: number }
}

const BRAND_BLUE: [number, number, number] = [25, 118, 210]

async function loadImageDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { mode: 'cors' })
    if (!res.ok) return null
    const blob = await res.blob()
    return await new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => resolve(r.result as string)
      r.onerror = reject
      r.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export async function downloadPaymentReportPdf(rows: FlatPaymentRow[]): Promise<void> {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const M = 40
  let y = M

  const dateStr = new Date().toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // —— Bandeau bleu
  doc.setFillColor(...BRAND_BLUE)
  doc.roundedRect(M, y, W - 2 * M, 76, 6, 6, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('RAPPORT DES PAIEMENTS', M + 20, y + 32)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(230, 240, 255)
  doc.text('Liste complète des transactions globales CasaNayo', M + 20, y + 52)
  doc.text(`Généré le : ${dateStr}`, W - M - 20, y + 52, { align: 'right' })

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://casanayo.com'
  const logoData = await loadImageDataUrl(`${origin}/logoCasa.png`)
  if (logoData) {
    try {
      doc.addImage(logoData, 'PNG', W - M - 52, y + 12, 40, 40)
    } catch { /* ignore */ }
  }

  y += 96

  // —— Table Header
  const drawTableHeader = (yy: number) => {
    doc.setFillColor(245, 245, 245)
    doc.rect(M, yy, W - 2 * M, 25, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    
    doc.text('ID', M + 10, yy + 16)
    doc.text('Utilisateur', M + 60, yy + 16)
    doc.text('Montant', M + 180, yy + 16)
    doc.text('Référence', M + 280, yy + 16)
    doc.text('Date', M + 400, yy + 16)
    doc.text('Statut', W - M - 10, yy + 16, { align: 'right' })
  }

  drawTableHeader(y)
  y += 25

  // —— Table body
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(0, 0, 0)

  for (const row of rows) {
    if (y > H - 100) {
      doc.addPage()
      y = M
      drawTableHeader(y)
      y += 25
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(0, 0, 0)
    }

    const p = row.payment
    const u = row.user
    
    const amount = `${p.amount} ${p.devise || ''}`
    const user = u.username || u.email || String(u.userId)
    const ref = p.reference ? (p.reference.length > 20 ? p.reference.slice(0, 18) + '...' : p.reference) : '-'
    const date = p.dateCreated ? p.dateCreated.split('T')[0] : '-'
    const status = (p.status || '-').toUpperCase()

    doc.text(String(p.id), M + 10, y + 15)
    doc.text(user.length > 25 ? user.slice(0, 23) + '...' : user, M + 60, y + 15)
    doc.text(amount, M + 180, y + 15)
    doc.text(ref, M + 280, y + 15)
    doc.text(date, M + 400, y + 15)
    
    // Status color
    if (status === 'SUCCESS' || status === 'COMPLETED' || status === 'PAID') {
        doc.setTextColor(16, 185, 129) // Emerald-500
    } else if (status === 'CANCELLED' || status === 'FAILED') {
        doc.setTextColor(239, 68, 68) // Red-500
    } else {
        doc.setTextColor(100, 100, 100)
    }
    doc.text(status, W - M - 10, y + 15, { align: 'right' })
    doc.setTextColor(0, 0, 0)

    y += 20
    doc.setDrawColor(230, 230, 230)
    doc.line(M, y, W - M, y)
  }

  // —— Footer
  const pageCount = (doc.internal as any).getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    
    // Draw top border for footer
    doc.setDrawColor(180, 180, 180)
    doc.setLineWidth(1)
    doc.line(M, H - 60, W - M, H - 60)

    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    
    // Support/Contacts
    doc.text('CasaNayo Support : +243 836 323 805', M, H - 46)
    doc.text('Email : contact@casanayo.com', M, H - 34)
    doc.text('Adresse : 14 Avenue Pumbu, Gombe, Kinshasa - RDC', W - M, H - 46, { align: 'right' })
    
    doc.text('© CasaNayo - Rapport Interne', W - M, H - 34, { align: 'right' })
    doc.text(`Page ${i} sur ${pageCount}`, W / 2, H - 20, { align: 'center' })
  }

  const filename = `Rapport_Paiements_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}
