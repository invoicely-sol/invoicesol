"use client"

import { useState } from "react"
import { Bell, ChevronDown, Filter, LogOut, Search, Settings, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const invoices = [
  {
    id: "INV001",
    business: "Acme Corp",
    amount: 5000,
    status: "Approved",
    dateUploaded: "2023-05-01",
    lastUpdated: "2023-05-03",
  },
  {
    id: "INV002",
    business: "Globex Inc",
    amount: 7500,
    status: "Pending",
    dateUploaded: "2023-05-02",
    lastUpdated: "2023-05-02",
  },
  {
    id: "INV003",
    business: "Initech",
    amount: 3000,
    status: "Rejected",
    dateUploaded: "2023-05-03",
    lastUpdated: "2023-05-04",
  },
  {
    id: "INV004",
    business: "Umbrella Corp",
    amount: 10000,
    status: "Approved",
    dateUploaded: "2023-05-04",
    lastUpdated: "2023-05-06",
  },
  {
    id: "INV005",
    business: "Hooli",
    amount: 15000,
    status: "Pending",
    dateUploaded: "2023-05-05",
    lastUpdated: "2023-05-05",
  },
]

export default function InvoiceDashboard() {
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesStatus = selectedStatus === "All" || invoice.status === selectedStatus
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.business.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500"
      case "Pending":
        return "bg-yellow-500"
      case "Rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-col py-20 px-10">
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Invoice Dashboard</h1>
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Button
              variant={selectedStatus === "All" ? "default" : "outline"}
              onClick={() => setSelectedStatus("All")}
            >
              All
            </Button>
            <Button
              variant={selectedStatus === "Approved" ? "default" : "outline"}
              onClick={() => setSelectedStatus("Approved")}
            >
              Approved
            </Button>
            <Button
              variant={selectedStatus === "Pending" ? "default" : "outline"}
              onClick={() => setSelectedStatus("Pending")}
            >
              Pending
            </Button>
            <Button
              variant={selectedStatus === "Rejected" ? "default" : "outline"}
              onClick={() => setSelectedStatus("Rejected")}
            >
              Rejected
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Uploaded</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.business}</TableCell>
                    <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>{invoice.dateUploaded}</TableCell>
                    <TableCell>{invoice.lastUpdated}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Invoice Details - {invoice.id}</DialogTitle>
                            <DialogDescription>
                              View detailed information about this invoice.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Business:</span>
                              <span className="col-span-3">{invoice.business}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Amount:</span>
                              <span className="col-span-3">${invoice.amount.toLocaleString()}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Status:</span>
                              <span className="col-span-3">
                                <Badge className={getStatusColor(invoice.status)}>
                                  {invoice.status}
                                </Badge>
                              </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Date Uploaded:</span>
                              <span className="col-span-3">{invoice.dateUploaded}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Last Updated:</span>
                              <span className="col-span-3">{invoice.lastUpdated}</span>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}