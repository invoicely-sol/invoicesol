"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Check, X } from "lucide-react"

type Invoice = {
  id: string
  smallBusinessName: string
  largeBusinessName: string
  invoiceDate: string
  dueDate: string
  amount: number
  status: "Pending" | "Approved" | "Rejected"
}

const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    smallBusinessName: "Tech Solutions LLC",
    largeBusinessName: "MegaCorp Inc.",
    invoiceDate: "Aug 15, 2024",
    dueDate: "Sep 15, 2024",
    amount: 1200.00,
    status: "Pending"
  },
  {
    id: "INV-002",
    smallBusinessName: "Green Energy Co.",
    largeBusinessName: "Power Utilities Ltd.",
    invoiceDate: "Aug 20, 2024",
    dueDate: "Sep 20, 2024",
    amount: 3500.50,
    status: "Approved"
  },
  {
    id: "INV-003",
    smallBusinessName: "Local Cafe",
    largeBusinessName: "City Hall",
    invoiceDate: "Aug 25, 2024",
    dueDate: "Sep 25, 2024",
    amount: 750.25,
    status: "Rejected"
  }
]

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const filteredInvoices = invoices.filter(invoice =>
    invoice.smallBusinessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.largeBusinessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const openDetailModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsDetailModalOpen(true)
  }

  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedInvoice(null)
  }

  const openConfirmModal = (invoice: Invoice, type: "approve" | "reject") => {
    setSelectedInvoice(invoice)
    setActionType(type)
    setIsConfirmModalOpen(true)
  }

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false)
    setSelectedInvoice(null)
    setActionType(null)
    setRejectionReason("")
  }

  const handleConfirmAction = () => {
    if (selectedInvoice && actionType) {
      const updatedInvoices: Invoice[] = invoices.map(invoice => {
        if (invoice.id === selectedInvoice.id) {
          return {
            ...invoice,
            status: actionType === "approve" ? "Approved" : "Rejected"
          }
        }
        return invoice
      })
      setInvoices(updatedInvoices)
      closeConfirmModal()
      closeDetailModal()
    }
  }

  return (
    <div className="container mx-auto p-4 py-32">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice Management</h1>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search invoices"
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8 w-64"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Small Business Name</TableHead>
            <TableHead>Large Business Name</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>
                <Button variant="link" onClick={() => openDetailModal(invoice)}>
                  {invoice.id}
                </Button>
              </TableCell>
              <TableCell>{invoice.smallBusinessName}</TableCell>
              <TableCell>{invoice.largeBusinessName}</TableCell>
              <TableCell>{invoice.invoiceDate}</TableCell>
              <TableCell>{invoice.dueDate}</TableCell>
              <TableCell>${invoice.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    invoice.status === "Approved"
                      ? "outline"
                      : invoice.status === "Rejected"
                      ? "destructive"
                      : "default"
                  }
                >
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => openConfirmModal(invoice, "approve")}
                    disabled={invoice.status !== "Pending"}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => openConfirmModal(invoice, "reject")}
                    disabled={invoice.status !== "Pending"}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Invoice Number</Label>
                  <div>{selectedInvoice.id}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge
                    variant={
                      selectedInvoice.status === "Approved"
                        ? "outline"
                        : selectedInvoice.status === "Rejected"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {selectedInvoice.status}
                  </Badge>
                </div>
                <div>
                  <Label>Small Business Name</Label>
                  <div>{selectedInvoice.smallBusinessName}</div>
                </div>
                <div>
                  <Label>Large Business Name</Label>
                  <div>{selectedInvoice.largeBusinessName}</div>
                </div>
                <div>
                  <Label>Invoice Date</Label>
                  <div>{selectedInvoice.invoiceDate}</div>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <div>{selectedInvoice.dueDate}</div>
                </div>
                <div>
                  <Label>Amount</Label>
                  <div>${selectedInvoice.amount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={closeDetailModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Invoice" : "Reject Invoice"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType} this invoice?
            </DialogDescription>
          </DialogHeader>
          {actionType === "reject" && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason for rejection</Label>
                <Textarea
                  id="reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter the reason for rejection"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeConfirmModal}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAction}>
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}