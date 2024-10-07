"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell, ChevronDown, HelpCircle, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"

export default function Component() {
  const [step, setStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [businessName, setBusinessName] = useState("")
  const [largeBusiness, setLargeBusiness] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [dueDate, setDueDate] = useState("")
  const [invoiceDate, setInvoiceDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("")
  const [tokenizePercentage, setTokenizePercentage] = useState(50)
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletPublicKey, setWalletPublicKey] = useState("");
  const [lgBusinessEmail, setLgBusinessEmail] = useState("")
  const { toast } = useToast();
  const wallet = useWallet();
  const {connection} = useConnection();

  useEffect(() => {
    if(wallet.publicKey !== null && connection !== null){
      setWalletConnected(true);
      setWalletPublicKey(wallet.publicKey.toString());
    } else {
      setWalletConnected(false);
    }
  }, [connection, wallet])

  useEffect(() => {
    setIsFormValid(
      businessName.trim() !== "" &&
      largeBusiness.trim() !== "" &&
      invoiceDate.trim() !== "" &&
      invoiceNumber.trim() !== "" &&
      dueDate.trim() !== ""
    )
  }, [businessName, largeBusiness, invoiceDate, invoiceNumber, dueDate])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setStep(2)
    }
  }

  const handleResubmission = () => {
    setStep(1);
    setBusinessName("");
    setLargeBusiness("");
    setInvoiceNumber("");
    setInvoiceDate("");
    setAmount("");
    setDueDate("");
    setPaymentTerms("");
    setLgBusinessEmail("");
    setCurrency("USD");
  }

  const handleSubmit = async (event: React.FormEvent) => {
    console.log(lgBusinessEmail);
    event.preventDefault()
    // Here you would typically send the data to your backend
    const data = await fetch("/api/invoice/business-sm/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          smallBusiness: businessName,
          largeBusiness: largeBusiness,
          lgBusinessEmail: lgBusinessEmail,
          amount: parseFloat(amount),
          invoiceNumber: invoiceNumber,
          invoiceDate: invoiceDate,
          dueDate: dueDate,
          paymentTerms: paymentTerms,
          smallBusinessAddress: walletPublicKey,
          percentageGiven: tokenizePercentage,
          status:'Pending'
        }
      ),
    })
    const resp = await data.json();
    toast({
      title: "Invoice submitted successfully!",
      description: "Our team is reviewing it. We'll notify you once it's approved.",
    })
    setStep(4)
  }

  return (
    <div className="py-20 flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto py-12">
          <h1 className="text-3xl font-bold mb-2">Upload Your Invoice for Discounting</h1>
          <p className="text-muted-foreground mb-6">Get Your Invoice Paid Faster – Upload Your Invoice Now!</p>
          <div className="mb-8 px-16">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-1/4 h-2 rounded-full ${
                    s <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Upload Invoice</span>
              <span>Add Details</span>
              <span>Review</span>
              <span>Await Approval</span>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h2 className="mt-4 text-xl font-semibold">Drag and drop your invoice file here</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Or click to upload</p>
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.docx,.xlsx"
                    />
                    <Button asChild className="mt-4">
                      <label htmlFor="file-upload">Select File</label>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Accepted file types: .pdf, .docx, .xlsx</p>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="business-name">Small Business Name</Label>
                      <Input
                        id="business-name"
                        placeholder="Enter your business name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="large-business">Large Business Name</Label>
                      <Input
                        id="large-business"
                        placeholder="Enter the name of the company you've invoiced"
                        value={largeBusiness}
                        onChange={(e) => setLargeBusiness(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="large-business-email">Large Business Email</Label>
                      <Input
                        id="large-business-email"
                        placeholder="Enter your business Email"
                        value={lgBusinessEmail}
                        onChange={(e) => setLgBusinessEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="large-business">Invoice Number</Label>
                      <Input
                        id="large-business"
                        placeholder="Enter the Invoice Number (Located at the top of the invoice)"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        required
                      />
                    <div className="grid gap-2">
                      <Label htmlFor="due-date">Invoice Date</Label>
                      <Input
                        id="invoice-date"
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        required
                      />
                    </div>

                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Invoice Amount</Label>
                      <div className="flex gap-2">
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter invoice amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="INR">INR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="due-date">Due Date</Label>
                      <Input
                        id="due-date"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="payment-terms">Payment Terms</Label>
                      <Input
                        id="payment-terms"
                        placeholder="Payment Terms (Optional)"
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button onClick={() => setStep(3)} disabled={!isFormValid}>Next</Button>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="tokenize-percentage">
                      Select the percentage of this invoice you'd like to offer for investment
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="tokenize-percentage"
                        min={50}
                        max={100}
                        step={1}
                        value={[tokenizePercentage]}
                        onValueChange={(value) => setTokenizePercentage(value[0])}
                      />
                      <span className="font-bold">{tokenizePercentage}%</span>
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Review Your Information</h3>
                    <p>Business Name: {businessName}</p>
                    <p>Large Business: {largeBusiness}</p>
                    <p>Large Business Email: {lgBusinessEmail}</p>
                    <p>
                      Amount: {currency} {amount}
                    </p>
                    <p>
                      Invoice Number: {invoiceNumber}
                    </p>
                    <p>
                      Invoice Date: {invoiceDate}
                    </p>
                    <p>Due Date: {dueDate}</p>
                    {paymentTerms.trim() !== "" ? <p>Payment Terms: {paymentTerms}</p> : null}
                    <p>Tokenization Percentage: {tokenizePercentage}%</p>
                  </div>
                  <div className="pt-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {/* RadixUI error tooltip hover wont work directly on diabled button */}
                      <span tabIndex={0}>
                      <Button type="submit" disabled={!walletConnected}>Submit for Approval</Button>
                      </span>
                      </TooltipTrigger>
                      {walletConnected 
                      ? null 
                      : <TooltipContent>
                      <p>{walletConnected ? null : "Please Connect to wallet"}</p>
                    </TooltipContent>
                      }
                    </Tooltip>
                  </TooltipProvider>
                  </div>
                </div>
              )}
              {step === 4 && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Invoice Submitted Successfully!</h2>
                  <p className="mb-4">Our team is reviewing your invoice. We'll notify you once it's approved.</p>
                  <Button onClick={handleResubmission}>Submit Another Invoice</Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}