"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MessageCircle, Phone, Mail, Search, Truck, CreditCard, Package } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const faqCategories = [
    {
      title: "Orders & Shipping",
      icon: Truck,
      questions: [
        {
          question: "How long does shipping take?",
          answer:
            "Standard shipping takes 3-5 business days within India. Express shipping is available for 1-2 business days delivery.",
        },
        {
          question: "Can I track my mystery box order?",
          answer:
            "Yes! Once your order ships, you'll receive a tracking number via email and SMS. You can also track orders in your account.",
        },
        {
          question: "What if my mystery box is damaged during shipping?",
          answer:
            "We're sorry to hear that! Please contact us within 48 hours with photos of the damage, and we'll send a replacement immediately.",
        },
        {
          question: "Can I change my shipping address after placing an order?",
          answer:
            "You can change your shipping address within 2 hours of placing the order. After that, please contact our support team for assistance.",
        },
      ],
    },
    {
      title: "Mystery Boxes",
      icon: Package,
      questions: [
        {
          question: "What's inside the mystery boxes?",
          answer:
            "Each box contains 4-8 surprise items worth 2-3x the box price. Items vary by category but are always high-quality and curated by our team.",
        },
        {
          question: "Can I return items from a mystery box?",
          answer:
            "Due to the nature of mystery boxes, individual items cannot be returned. However, if you're unsatisfied with your entire box, contact us within 7 days.",
        },
        {
          question: "How often do you release new mystery boxes?",
          answer: "We release new themed boxes monthly, with special limited editions for holidays and events.",
        },
        {
          question: "Can I request specific items in my mystery box?",
          answer:
            "Mystery boxes are pre-curated for the surprise element. However, you can choose different categories that match your interests.",
        },
      ],
    },
    {
      title: "Payments & Refunds",
      icon: CreditCard,
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit/debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay.",
        },
        {
          question: "How do refunds work?",
          answer:
            "Refunds are processed within 5-7 business days to your original payment method. You'll receive an email confirmation once processed.",
        },
        {
          question: "Are there any hidden charges?",
          answer: "No hidden charges! The price you see includes all taxes. Shipping is free for orders above ₹2,000.",
        },
        {
          question: "Can I get a refund if I don't like my mystery box?",
          answer:
            "We offer a 30-day satisfaction guarantee. If you're not happy with your box, contact us for a full refund or exchange.",
        },
      ],
    },
  ]

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: MessageCircle,
      action: "Start Chat",
      available: "24/7",
      onClick: () => {
        toast({
          title: "Live Chat",
          description: "Live chat feature will be available soon!",
        })
      },
    },
    {
      title: "Phone Support",
      description: "+91 9901412827",
      icon: Phone,
      action: "Call Now",
      available: "9 AM - 9 PM",
      onClick: () => {
        window.open("tel:+919901412827")
      },
    },
    {
      title: "Email Support",
      description: "support@arijmysteryvault.com",
      icon: Mail,
      action: "Send Email",
      available: "24 hours response",
      onClick: () => {
        window.open("mailto:support@arijmysteryvault.com")
      },
    },
  ]

  const handleContactFormChange = (field: string, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactForm.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you within 24 hours.",
      })

      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (faq) =>
          searchQuery === "" ||
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Help Center</h1>
        <Badge className="bg-green-600">24/7 Support</Badge>
      </div>

      {/* Search */}
      <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Options */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Contact Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contactOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <Card
                key={index}
                className="bg-black/40 border-white/10 backdrop-blur-sm hover:bg-black/60 transition-colors cursor-pointer"
                onClick={option.onClick}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{option.title}</h3>
                  <p className="text-gray-300 text-sm mb-2">{option.description}</p>
                  <p className="text-green-400 text-xs mb-4">{option.available}</p>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Frequently Asked Questions
          {searchQuery && (
            <span className="text-lg font-normal text-gray-300 ml-2">
              - {filteredFAQs.reduce((total, category) => total + category.questions.length, 0)} results
            </span>
          )}
        </h2>
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((category, categoryIndex) => {
              const Icon = category.icon
              return (
                <Card key={categoryIndex} className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Icon className="h-5 w-5 mr-2 text-purple-400" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem
                          key={faqIndex}
                          value={`item-${categoryIndex}-${faqIndex}`}
                          className="border-white/10"
                        >
                          <AccordionTrigger className="text-white hover:text-purple-400">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-300">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No results found</h3>
                <p className="text-gray-300">Try searching with different keywords or browse all categories above.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Contact Form */}
      <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Still Need Help?</CardTitle>
          <CardDescription className="text-gray-300">
            Send us a message and we'll get back to you within 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContactFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => handleContactFormChange("name", e.target.value)}
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                disabled={isSubmitting}
              />
              <Input
                placeholder="Your Email"
                type="email"
                value={contactForm.email}
                onChange={(e) => handleContactFormChange("email", e.target.value)}
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                disabled={isSubmitting}
              />
            </div>
            <Input
              placeholder="Subject"
              value={contactForm.subject}
              onChange={(e) => handleContactFormChange("subject", e.target.value)}
              className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
              disabled={isSubmitting}
            />
            <Textarea
              placeholder="Describe your issue..."
              rows={4}
              value={contactForm.message}
              onChange={(e) => handleContactFormChange("message", e.target.value)}
              className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isSubmitting ? "Sending Message..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
