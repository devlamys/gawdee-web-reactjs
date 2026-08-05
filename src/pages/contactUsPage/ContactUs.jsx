/* Developed by Grafizen International PVT. LTD. */

import { ContactForm } from '@/component/contactCom/contact-form'
import { ContactInfoCards } from '@/component/contactCom/contact-info-cards'
import { FarmBrandSection } from '@/component/contactCom/farm-brand-section'
import { FooterCTA } from '@/component/contactCom/footer-cta'
import HeroSection from '@/component/contactCom/HeroSection'

import { MapSection } from '@/component/contactCom/map-section'
import { NewsletterSection } from '@/component/contactCom/newsletter-section'
import { QuickSupport } from '@/component/contactCom/quick-support'
import Footer from '@/component/Footer'
import Header from '@/component/Header'
import React from 'react'

export default function ContactUs() {
    return (
        <>

            <Header />
            <main className="min-min-h-screen md77:pt-[100px] pt-[100px]  md118:pt-[180px] max-w-7xl  mx-auto">
                <HeroSection />
                <ContactInfoCards />
                <div className=' w-[100%] flex gap-[20px] items-center '>

                    <ContactForm />
                </div>

            </main>

            <Footer />
        </>
    )
}