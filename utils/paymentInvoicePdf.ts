import { jsPDF } from 'jspdf'
import type { PaymentRow } from '@/stores/payment'

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

/**
 * Reçu PDF aligné sur PaymentHistoryPage.dart (Flutter) : en-tête bleu #1976D2, sections, tableau, pied de page.
 */
export async function downloadPaymentReceiptPdf(payment: PaymentRow, username: string): Promise<void> {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const W = doc.internal.pageSize.getWidth()
    const M = 32
    let y = M

    const dateToken = payment.dateCreated ? new Date(payment.dateCreated) : new Date()
    const issued = new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
    const payDateStr = dateToken.toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    const currency =
        payment.devise === 'CDF' ? 'FC' : payment.devise === 'USD' ? '$' : payment.devise || ''

    // —— Bandeau bleu (comme pw.Container Flutter)
    doc.setFillColor(...BRAND_BLUE)
    doc.roundedRect(M, y, W - 2 * M, 76, 6, 6, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.text('REÇU DE PAIEMENT', M + 20, y + 32)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(230, 240, 255)
    doc.text('Confirmation Officielle de Transaction', M + 20, y + 52)

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://casanayo.com'
    const logoData = await loadImageDataUrl(`${origin}/logoCasa.png`)
    if (logoData) {
        try {
            doc.addImage(logoData, 'PNG', W - M - 52, y + 12, 40, 40)
        } catch {
            /* ignore */
        }
    }

    y += 96
    doc.setTextColor(40, 40, 40)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(`Référence : #${payment.reference ?? payment.id ?? ''}`, M, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(`Date d'émission : ${issued}`, M, y + 14)

    doc.setTextColor(21, 101, 192)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('PAIEMENT VALIDÉ', W - M - 95, y + 4)

    y += 40
    doc.setDrawColor(200, 200, 200)
    doc.line(M, y, W - M, y)
    y += 22

    doc.setTextColor(...BRAND_BLUE)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text('1. INFORMATIONS SUR LA TRANSACTION', M, y)
    y += 18

    doc.setFillColor(245, 245, 245)
    doc.roundedRect(M, y, W - 2 * M, 88, 4, 4, 'F')
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    const row = (label: string, val: string, yy: number) => {
        doc.text(label, M + 12, yy)
        doc.setFont('helvetica', 'normal')
        doc.text(val, W - M - 12, yy, { align: 'right' })
        doc.setFont('helvetica', 'bold')
    }
    let ry = y + 18
    row('Client / Utilisateur', username || 'Client CasaNayo', ry)
    ry += 16
    row('Description', String(payment.description ?? 'Abonnement Annuel'), ry)
    ry += 16
    row('Mode de Paiement', String(payment.typePayment ?? 'MOBILE_MONEY'), ry)
    ry += 16
    row('Date du Paiement', payDateStr, ry)

    y += 104
    doc.setTextColor(...BRAND_BLUE)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text('2. RÉSUMÉ DU RÈGLEMENT', M, y)
    y += 20

    const tableTop = y
    const colW = (W - 2 * M) / 2
    doc.setDrawColor(200, 200, 200)
    doc.rect(M, tableTop, W - 2 * M, 44)
    doc.line(M + colW, tableTop, M + colW, tableTop + 44)
    doc.setFillColor(250, 250, 250)
    doc.rect(M, tableTop, W - 2 * M, 22, 'F')
    doc.line(M, tableTop + 22, W - M, tableTop + 22)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text('DESIGNATION', M + 8, tableTop + 15)
    doc.text('TOTAL', M + colW + 8, tableTop + 15)
    doc.setFont('helvetica', 'normal')
    const desc = String(payment.description ?? 'Abonnement Annuel CasaNayo')
    doc.text(desc.length > 42 ? `${desc.slice(0, 40)}…` : desc, M + 8, tableTop + 36)
    doc.setFont('helvetica', 'bold')
    doc.text(`${payment.amount} ${currency}`, W - M - 8, tableTop + 36, { align: 'right' })

    y = tableTop + 58
    doc.setFillColor(...BRAND_BLUE)
    doc.roundedRect(W - M - 220, y, 220, 28, 3, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`MONTANT TOTAL PAYÉ : ${payment.amount} ${currency}`, W - M - 210, y + 18)

    y = doc.internal.pageSize.getHeight() - M - 70
    doc.setDrawColor(180, 180, 180)
    doc.line(M, y, W - M, y)
    y += 14
    doc.setTextColor(90, 90, 90)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(
        "Merci de faire confiance à CasaNayo pour vos transactions immobilières. Ce reçu est généré automatiquement par le système et ne nécessite pas de signature.",
        M,
        y,
        { maxWidth: W - 2 * M, align: 'justify' }
    )
    y += 36
    doc.setFontSize(8)
    doc.text('CasaNayo Support : +243 836 323 805', M, y)
    doc.text('Email : contact@casanayo.com', M, y + 12)
    doc.text('Adresse : 14 Avenue Pumbu, Gombe, Kinshasa - RDC', W - M, y + 12, { align: 'right' })
    doc.text('Généré par CasaNayo - www.casanayo.com', W - M, y, { align: 'right' })

    const gen = new Date().toLocaleString('fr-FR').replace(/[/:,\s]/g, '_')
    const ref = payment.id ?? payment.reference ?? 'ref'
    doc.save(`Facture_Paiement_Ref_${ref}_du_${gen}.pdf`)
}
