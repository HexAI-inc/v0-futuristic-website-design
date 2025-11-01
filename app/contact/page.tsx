import { ContactForm } from "@/components/contact-form"
import { Mail, MapPin, Phone, Clock } from "lucide-react"

export const metadata = {
  title: "Contact Us | Gambia's Biodiversity Outlook",
  description: "Get in touch with us about conservation initiatives, protected areas, and biodiversity programs in The Gambia.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-16">
      <div className="container mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about The Gambia's protected areas or want to get involved in conservation efforts? 
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Office Address</h3>
                    <p className="text-muted-foreground">
                      Department of Parks & Wildlife Management<br />
                      Kotu Road, Serrekunda<br />
                      The Gambia, West Africa
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">info@gambiaparks.gm</p>
                    <p className="text-muted-foreground">conservation@biodiversity.gm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground">+220 446 1100</p>
                    <p className="text-muted-foreground">+220 992 8765</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Office Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 8:00 AM - 5:00 PM<br />
                      Saturday: 9:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Conservation Programs</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Interested in supporting our conservation work? Learn about:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Community Conservation Partnerships</li>
                <li>• Volunteer & Research Opportunities</li>
                <li>• Educational Programs & School Visits</li>
                <li>• Ecotourism Development</li>
                <li>• Wildlife Protection Initiatives</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card/50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  )
}