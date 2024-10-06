"use client"

import { useEffect, useState } from "react"
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



export default function InvoiceDashboard() {
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [invoices, setInvoices] = useState([]);

  const filteredInvoices = invoices.length === 0 ? [] : invoices.filter((invoice: {
      "_id": string,
      "largeBusiness": string,
      "status": string,
      "amount": number,
      "percentageGiven": number,
      "invoiceDate": Date,
      "dueDate": Date,
      "invoiceNumber": string
    }) => {
      const matchesStatus = selectedStatus === "All" || invoice.status === selectedStatus
      const matchesSearch =
        invoice.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.largeBusiness?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })

  useEffect(() => {
    async function fetchData(){
      const data = await fetch("/api/invoice/business-sm/retrieve", {
        method: "GET"
      })
      const resp = await data.json();
      console.log(resp.data);
      setInvoices(resp.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log(invoices)
  }, [invoices])

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
    <div className="flex flex-col py-20">
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
                  <TableHead>Percentage Given</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Uploaded</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice: {
                      "_id": string,
                      "largeBusiness": string,
                      "status": string,
                      "amount": number,
                      "percentageGiven": number,
                      "invoiceDate": Date,
                      "dueDate": Date,
                      "invoiceNumber": string
                    }) => (
                  <TableRow key={invoice.invoiceNumber}>
                    <TableCell>{invoice.largeBusiness}</TableCell>
                    <TableCell>{invoice.largeBusiness}</TableCell>
                    <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>{invoice.percentageGiven}%</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(invoice.dueDate).toDateString()}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toDateString()}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Invoice Details - {invoice.invoiceNumber}</DialogTitle>
                            <DialogDescription>
                              View detailed information about this invoice.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Business:</span>
                              <span className="col-span-3">{invoice.largeBusiness}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Amount:</span>
                              <span className="col-span-3">${invoice.amount.toLocaleString()}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Percentage Given:</span>
                              <span className="col-span-3">{invoice.percentageGiven}%</span>
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
                              <span className="font-medium">Due Date:</span>
                              <span className="col-span-3">{new Date(invoice.dueDate).toDateString()}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-medium">Invoice Date:</span>
                              <span className="col-span-3">{new Date(invoice.invoiceDate).toDateString()}</span>
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