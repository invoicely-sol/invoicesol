"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  Filter,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface Invoice {
  _id: string;
  largeBusiness: string;
  status: string;
  amount: number;
  percentageGiven: number;
  invoiceDate: Date;
  dueDate: Date;
  invoiceNumber: string;
}

export default function InvoiceDashboard() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [investmentPercentage, setInvestmentPercentage] = useState<number[]>([0]);
  const router = useRouter();

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesStatus =
      selectedStatus === "All" || invoice.status === selectedStatus;
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.largeBusiness.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/invoice/retreive-all", {
          method: "GET",
        });

        const data = await response.json();
        setInvoices(data.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500";
      case "Pending":
        return "bg-yellow-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleInvestButton = async (invoiceNumber: string) => {
    try {
      const response = await fetch("/api/invoice/investor/invest", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceNumber,
          investmentPercentage: investmentPercentage[0],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Investment updated successfully:", data);
        // Optionally refresh invoices or update state here
      } else {
        console.error("Error updating investment:", data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="flex flex-col py-20">
      <main className="flex-1 p-6">
        <h1 className="mb-6 text-3xl font-bold">Investor Dashboard</h1>
        <div className="mb-6 flex items-center justify-between">
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
              Invested
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
                  <TableHead>Investment Options</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.invoiceNumber}>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.largeBusiness}</TableCell>
                    <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>{invoice.percentageGiven}%</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(invoice.invoiceDate).toDateString()}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toDateString()}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Invest Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Invoice No. - {invoice.invoiceNumber}
                            </DialogTitle>
                            <DialogDescription>
                              Select the percentage of this invoice you'd like to invest into
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mb-4">
                            <Label htmlFor="tokenize-percentage">
                              Investment Percentage
                            </Label>
                            <div className="flex items-center gap-4">
                              <Slider
                                id="tokenize-percentage"
                                min={1}
                                max={50}
                                step={1}
                                value={investmentPercentage}
                                onValueChange={setInvestmentPercentage}
                              />
                              <span>{investmentPercentage[0]}%</span>
                            </div>
                            <Button 
                              onClick={() => handleInvestButton(invoice.invoiceNumber)}
                              className="ml-44 mt-4 bg-blue-950 text-white"
                            >
                              Invest Now
                            </Button>
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
  );
}