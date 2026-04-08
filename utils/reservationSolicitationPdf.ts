import { jsPDF } from 'jspdf'
import type { ReservationListItem } from '@/stores/reservations'
import type { SolicitationListItem } from '@/stores/solicitations'

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

function fmtDate(iso?: string) {
    if (!iso) return '—'
    try {
        return new Date(iso).toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    } catch {
        return iso
    }
}

function fmtDateShort(iso?: string) {
    if (!iso) return '—'
    try {
        return new Date(iso).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    } catch {
        return iso
    }
}

async function drawBlueHeader(doc: jsPDF, title: string, subtitle: string, M: number, W: number, y0: number): Promise<number> {
    let y = y0
    doc.setFillColor(...BRAND_BLUE)
    doc.roundedRect(M, y, W - 2 * M, 76, 6, 6, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text(title, M + 20, y + 30)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(230, 240, 255)
    const subLines = doc.splitTextToSize(subtitle, W - 2 * M - 100)
    doc.text(subLines, M + 20, y + 50)
    const logoData = await loadImageDataUrl('https://casanayo.com/logoCasa.png')
    if (logoData) {
        try {
            doc.addImage(logoData, 'PNG', W - M - 52, y + 12, 40, 40)
        } catch {
            /* ignore */
        }
    }
    return y + 96
}

function drawFooter(
    doc: jsPDF,
    M: number,
    W: number,
    disclaimer: string
) {
    let y = doc.internal.pageSize.getHeight() - M - 70
    doc.setDrawColor(180, 180, 180)
    doc.line(M, y, W - M, y)
    y += 14
    doc.setTextColor(90, 90, 90)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(disclaimer, M, y, { maxWidth: W - 2 * M, align: 'justify' })
    y += 36
    doc.setFontSize(8)
    doc.text('CasaNayo Support : +243 836 323 805', M, y)
    doc.text('Email : contact@casanayo.com', M, y + 12)
    doc.text('Généré par CasaNayo - www.casanayo.com', W - M, y, { align: 'right' })
}

function sectionTitle(doc: jsPDF, M: number, y: number, text: string): number {
    doc.setTextColor(...BRAND_BLUE)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(text, M, y)
    return y + 16
}

function keyValueBlock(
    doc: jsPDF,
    M: number,
    W: number,
    y: number,
    rows: { label: string; value: string }[]
): number {
    const boxH = 18 + rows.length * 16
    doc.setFillColor(245, 245, 245)
    doc.roundedRect(M, y, W - 2 * M, boxH, 4, 4, 'F')
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    let ry = y + 18
    for (const { label, value } of rows) {
        doc.text(label, M + 12, ry)
        doc.setFont('helvetica', 'normal')
        const v = value.length > 55 ? `${value.slice(0, 52)}…` : value
        doc.text(v, W - M - 12, ry, { align: 'right' })
        doc.setFont('helvetica', 'bold')
        ry += 16
    }
    return y + boxH + 14
}

/**
 * PDF réservation — même charte que `downloadPaymentReceiptPdf` (bandeau #1976D2, blocs gris, pied de page).
 */
export async function downloadReservationDocumentPdf(
    item: ReservationListItem,
    username: string,
    perspective: 'mine' | 'host'
): Promise<void> {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const W = doc.internal.pageSize.getWidth()
    const M = 32
    const issued = new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    let y = await drawBlueHeader(
        doc,
        'FICHE DE RÉSERVATION',
        'Document officiel CasaNayo — même présentation que sur l’application mobile',
        M,
        W,
        M
    )

    doc.setTextColor(40, 40, 40)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(`Référence réservation : #${item.reservationId}`, M, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(`Date d'émission : ${issued}`, M, y + 14)
    doc.setTextColor(21, 101, 192)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(String(item.status), W - M - 8, y + 4, { align: 'right' })
    y += 40
    doc.setDrawColor(200, 200, 200)
    doc.line(M, y, W - M, y)
    y += 22

    y = sectionTitle(doc, M, y, '1. BIEN ET CONTEXTE')
    const partyRows: { label: string; value: string }[] = [
        { label: 'Utilisateur (export)', value: username || '—' },
        { label: 'Vue', value: perspective === 'mine' ? 'Mes demandes' : 'Hôte — demande reçue' },
        { label: 'Bien / titre', value: item.propertyTitle || '—' },
        { label: 'Catégorie', value: item.sourceCategory || '—' },
        { label: 'Type', value: item.type || item.sourceCategory || '—' },
    ]
    if (item.hostDisplayName && item.hostDisplayName !== '—')
        partyRows.push({ label: 'Hôte / annonceur', value: item.hostDisplayName })
    if (item.guestDisplayName && item.guestDisplayName !== '—')
        partyRows.push({ label: 'Demandeur', value: item.guestDisplayName })
    y = keyValueBlock(doc, M, W, y, partyRows)

    y = sectionTitle(doc, M, y, '2. PLANNING ET MESSAGE')
    y = keyValueBlock(doc, M, W, y, [
        { label: 'Date début', value: fmtDateShort(item.startDate) },
        { label: 'Date fin', value: fmtDateShort(item.endDate) },
        { label: 'Heure', value: item.reservationHeure || '—' },
        { label: 'Créée le', value: fmtDate(item.createdAt) },
    ])

    if (item.message?.trim()) {
        y = sectionTitle(doc, M, y, '3. MESSAGE')
        doc.setFillColor(250, 250, 250)
        const lines = doc.splitTextToSize(item.message.trim(), W - 2 * M - 24)
        const h = 16 + lines.length * 12
        doc.roundedRect(M, y, W - 2 * M, Math.min(h, 120), 4, 4, 'F')
        doc.setTextColor(60, 60, 60)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.text(lines.slice(0, 8), M + 12, y + 16)
        y += Math.min(h, 120) + 14
    }

    if (item.cancellationReason?.trim()) {
        y = sectionTitle(doc, M, y, 'ANNULATION')
        doc.setTextColor(180, 40, 40)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        const lr = doc.splitTextToSize(item.cancellationReason.trim(), W - 2 * M - 24)
        doc.text(lr.slice(0, 6), M + 12, y)
        y += lr.length * 11 + 20
    }

    drawFooter(
        doc,
        M,
        W,
        'Ce document résume votre réservation telle qu’enregistrée sur CasaNayo. Il est généré automatiquement et ne remplace pas les conditions du bien ou du contrat entre les parties.'
    )

    const gen = new Date().toLocaleString('fr-FR').replace(/[/:,\s]/g, '_')
    doc.save(`CasaNayo_Reservation_${item.reservationId}_${gen}.pdf`)
}

/**
 * PDF sollicitation prestation — même charte que les reçus / fiches mobile.
 */
export async function downloadSolicitationDocumentPdf(
    item: SolicitationListItem,
    username: string,
    perspective: 'mine' | 'host'
): Promise<void> {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const W = doc.internal.pageSize.getWidth()
    const M = 32
    const issued = new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    const counterparty =
        perspective === 'mine'
            ? item.providerUsername || 'Prestataire'
            : item.requesterUsername || 'Demandeur'

    let y = await drawBlueHeader(
        doc,
        'FICHE DE SOLLICITATION',
        'Demande de prestation CasaNayo — présentation alignée sur l’app mobile',
        M,
        W,
        M
    )

    doc.setTextColor(40, 40, 40)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(`Référence sollicitation : #${item.id}`, M, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(`Date d'émission : ${issued}`, M, y + 14)
    doc.setTextColor(21, 101, 192)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(String(item.status), W - M - 8, y + 4, { align: 'right' })
    y += 40
    doc.setDrawColor(200, 200, 200)
    doc.line(M, y, W - M, y)
    y += 22

    y = sectionTitle(doc, M, y, '1. PRESTATION ET PARTIES')
    const deviseLabel = item.deviseId === 1 ? 'FC' : item.deviseId === 2 ? 'USD' : String(item.deviseId ?? '—')
    const budgetStr =
        item.budget != null && Number.isFinite(item.budget) ? `${item.budget} ${deviseLabel}` : '—'
    const solRows: { label: string; value: string }[] = [
        { label: 'Utilisateur (export)', value: username || '—' },
        { label: 'Vue', value: perspective === 'mine' ? 'Mes demandes' : 'Prestataire — demande reçue' },
        { label: 'Prestation', value: item.prestationTitle || '—' },
        { label: 'ID prestation', value: item.prestationId != null ? String(item.prestationId) : '—' },
        { label: 'Prestataire (nom affiché)', value: item.providerDisplayName && item.providerDisplayName !== '—' ? item.providerDisplayName : counterparty },
        {
            label: 'Demandeur (nom affiché)',
            value:
                item.requesterDisplayName && item.requesterDisplayName !== '—'
                    ? item.requesterDisplayName
                    : perspective === 'host'
                      ? item.requesterUsername || '—'
                      : '—',
        },
        { label: 'Budget indiqué', value: budgetStr },
    ]
    if (item.userId != null) solRows.push({ label: 'ID demandeur (sollicitation)', value: String(item.userId) })
    y = keyValueBlock(doc, M, W, y, solRows)

    y = sectionTitle(doc, M, y, '2. DATES')
    y = keyValueBlock(doc, M, W, y, [
        { label: 'Souhait début', value: fmtDateShort(item.startDate) },
        { label: 'Souhait fin', value: fmtDateShort(item.endDate) },
        { label: 'Créée le', value: fmtDate(item.createdAt) },
    ])

    if (item.description?.trim()) {
        y = sectionTitle(doc, M, y, '3. DESCRIPTION')
        doc.setFillColor(250, 250, 250)
        const lines = doc.splitTextToSize(item.description.trim(), W - 2 * M - 24)
        const h = 16 + Math.min(lines.length, 10) * 11
        doc.roundedRect(M, y, W - 2 * M, Math.min(h, 140), 4, 4, 'F')
        doc.setTextColor(60, 60, 60)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.text(lines.slice(0, 10), M + 12, y + 16)
        y += Math.min(h, 140) + 14
    }

    drawFooter(
        doc,
        M,
        W,
        'Ce document résume votre sollicitation de prestation sur CasaNayo. Il est généré automatiquement à titre d’archive personnelle.'
    )

    const gen = new Date().toLocaleString('fr-FR').replace(/[/:,\s]/g, '_')
    doc.save(`CasaNayo_Sollicitation_${item.id}_${gen}.pdf`)
}
