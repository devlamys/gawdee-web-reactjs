/* Developed by Grafizen International PVT. LTD. */
'use client'

import React from "react"
import Header from "@/component/Header"
import Footer from "@/component/Footer"

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      <main className="max-w-5xl mx-auto px-4 pb-20 pt-[130px] font-sans text-gray-800 space-y-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Privacy Policy
        </h1>

        <p>Last Updated: 26 May 2026</p>

        <p>
          At Gawdee, we respect your privacy and are committed to protecting your personal information, customer trust, and data security. This Privacy Policy explains how we collect, use, store, and protect information when you interact with our website, products, services, social media pages, customer support, or business operations. By using Gawdee platforms, you agree to the terms of this Privacy Policy.
        </p>

        <h2 className="text-lg font-medium text-gray-900">1. About Gawdee</h2>
        <p>
          Gawdee is an organic and natural products brand focused on ethical farming, traditional methods, and quality products.
        </p>

        <h2 className="text-lg font-medium text-gray-900">2. Information We Collect</h2>
        <p><strong>Personal Information</strong></p>
        <ul className="list-disc list-inside">
          <li>Name</li>
          <li>Mobile number</li>
          <li>Email address</li>
          <li>Billing & shipping address</li>
          <li>Order details</li>
          <li>Payment confirmation details</li>
        </ul>
        <p><strong>Technical Information</strong></p>
        <ul className="list-disc list-inside">
          <li>IP address</li>
          <li>Device type</li>
          <li>Browser information</li>
          <li>Website activity</li>
          <li>Cookies and analytics data</li>
        </ul>
        <p><strong>Communication Information</strong></p>
        <ul className="list-disc list-inside">
          <li>Messages sent through website, email, WhatsApp, or social media</li>
          <li>Customer support conversations</li>
          <li>Product reviews or feedback</li>
        </ul>

        <h2 className="text-lg font-medium text-gray-900">3. How We Use Your Information</h2>
        <ul className="list-disc list-inside">
          <li>Process and deliver orders</li>
          <li>Provide customer support</li>
          <li>Improve our website and services</li>
          <li>Send order updates and important notifications</li>
          <li>Improve marketing and customer experience</li>
          <li>Prevent fraud, misuse, and unauthorized activity</li>
          <li>Maintain business security and operational management</li>
        </ul>

        <h2 className="text-lg font-medium text-gray-900">4. Payments & Transaction Security</h2>
        <p>
          Payments are processed through secure third-party payment gateways. Gawdee does not store complete debit card, credit card, banking passwords, CVV numbers, or sensitive payment credentials on its servers.
        </p>

        <h2 className="text-lg font-medium text-gray-900">5. Cookies & Tracking Technologies</h2>
        <p>
          Our website may use cookies, pixels, and analytics tools to improve performance, save user preferences, analyze traffic and shopping behavior, and measure advertising performance. Users can disable cookies in browser settings if preferred.
        </p>

        <h2 className="text-lg font-medium text-gray-900">6. Information Sharing</h2>
        <p>
          Gawdee does not sell or rent customer information. Limited information may be shared with trusted third parties when necessary, including:
        </p>
        <ul className="list-disc list-inside">
          <li>Delivery and logistics partners</li>
          <li>Payment providers</li>
          <li>Website and hosting services</li>
          <li>Marketing and analytics tools</li>
          <li>Legal or government authorities if required by law</li>
        </ul>

        <h2 className="text-lg font-medium text-gray-900">7. Employee & Internal Confidentiality</h2>
        <p>
          All employees, interns, freelancers, vendors, and associated personnel working with Gawdee are required to protect customer privacy, maintain professionalism, and follow ethical business practices. Unauthorized sharing of data may result in termination or legal action.
        </p>

        <h2 className="text-lg font-medium text-gray-900">8. Data Security</h2>
        <p>
          We use reasonable security measures to protect information from unauthorized access, misuse, loss, or disclosure. Users are also responsible for protecting their account information.
        </p>

        <h2 className="text-lg font-medium text-gray-900">9. Product & Health Disclaimer</h2>
        <p>
          Gawdee products are intended for general wellness and nutritional purposes only. They are not medical advice, and natural products may vary in color, texture, or aroma.
        </p>

        <h2 className="text-lg font-medium text-gray-900">10. Third-Party Links & Services</h2>
        <p>
          Our website may contain links to third-party websites. Gawdee is not responsible for their privacy practices or content.
        </p>

        <h2 className="text-lg font-medium text-gray-900">11. Children's Privacy</h2>
        <p>
          We do not knowingly collect personal information from individuals under 18 years of age.
        </p>

        <h2 className="text-lg font-medium text-gray-900">12. Changes to This Policy</h2>
        <p>
          Gawdee may update this Privacy Policy at any time without prior notice. Updated policies become effective immediately after publication.
        </p>

        <h2 className="text-lg font-medium text-gray-900">13. Contact & Support</h2>
        <p>
          For questions or assistance, contact Gawdee through official channels:
          <br />
          Website: <a href="https://gawdee.com/" className="text-green-700 hover:underline">https://gawdee.com/</a>
        </p>

        <h2 className="text-lg font-medium text-gray-900">14. Consent</h2>
        <p>
          By using Gawdee websites, services, or products, you confirm that you have read, understood, and agreed to this Privacy Policy.
        </p>
      </main>

      <Footer />
    </>
  )
}