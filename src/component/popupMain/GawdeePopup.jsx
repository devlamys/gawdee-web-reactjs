/* Developed by Grafizen International PVT. LTD. */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

// OLD IMAGE IMPORT (COMMENTED OUT)
// import mixmeImage from '../../../public/imges/popupImage/mixme.jpg';

// NEW INDEPENDENCE DAY POPUP IMAGE IMPORT
import independenceOfferImage from '../../../public/imges/popupImage/independence-offer-popup-v1 copy.webp';

const GawdeePopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopyCode = (e) => {
        if (e) e.stopPropagation();
        navigator.clipboard.writeText('FREEDOM10');
        setCopied(true);
        toast.success('Promo code FREEDOM10 copied to clipboard!', {
            duration: 2500,
            style: {
                borderRadius: '8px',
                background: '#0c776b',
                color: '#fff',
                fontWeight: '600',
            },
        });
        setTimeout(() => {
            setCopied(false);
        }, 2500);
    };

    useEffect(() => {
        const hasShown = sessionStorage.getItem('gawdeePopupShown');
        if (!hasShown) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem('gawdeePopupShown', 'true');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 font-Poppins z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl p-2.5 sm:p-3 flex flex-col border border-emerald-100"
                    >

                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 z-20 p-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-white transition-all border border-gray-200 text-gray-700 hover:scale-105 active:scale-95"
                            title="Close"
                        >
                            <X size={18} />
                        </button>

                        {/* ============================================================== */}
                        {/* OLD POPUP DESIGN (COMMENTED OUT CODE) */}
                        {/* ============================================================== */}
                        {/*
                        <div className="p-1.5 overflow-hidden  flex flex-col items-center justify-between">

                            <div className="w-full aspect-square rounded-xl overflow-hidden">
                                <img
                                    src={mixmeImage}
                                    alt="Gawdee Mix Me"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="w-full flex   pb-3 pt-3 items-center gap-3 justify-between px-2">

                                <div className=" ">
                                    <h2 className="text-xl font-[500] text-gray-800 ">Gawdee Mix Me</h2>
                                    <p className="text-gray-600  leading-4 text-[12px]">
                                       Pick your daily nutrition. 3 delicious flavours for 1 better habit.
                                    </p>
                                </div>

                                <button
                                    onClick={() => window.location.href = '/products/mix-me'}
                                    className="w-[140px] py-2 justify-center flex-shrink-0 flex items-center rounded-[10px] bg-[#0B776B] text-white font-[500] text-[14px] hover:opacity-90 transition-all shadow-md "
                                >
                                    View Details
                                    <ArrowRight size={16} className="inline ml-2" />
                                </button>
                            </div>

                        </div>
                        */}

                        {/* ============================================================== */}
                        {/* NEW INDEPENDENCE DAY SPECIAL POPUP DESIGN */}
                        {/* ============================================================== */}
                        <div className="p-1 overflow-hidden flex flex-col items-center">
                            {/* Main Poster Graphic */}
                            <div className="w-full rounded-2xl overflow-hidden shadow-inner">
                                <img
                                    src={independenceOfferImage}
                                    alt="Independence Day Offer - Flat 10% OFF | Use Code FREEDOM10"
                                    className="w-full h-auto object-cover block rounded-2xl"
                                />
                            </div>

                            {/* Bottom Controls Bar */}
                            <div className="w-full flex items-center justify-between gap-2 pt-3 pb-1 px-2">
                                {/* Left Info */}
                                <div className="flex flex-col justify-center">
                                    <span className="text-[10px] sm:text-[11px] font-bold text-[#0c776b] tracking-wider uppercase leading-tight">
                                        INDEPENDENCE DAY SPECIAL
                                    </span>
                                    <span className="text-[11px] sm:text-xs text-gray-600 font-medium">
                                        Use code <strong className="text-gray-900 font-bold">FREEDOM10</strong> at checkout
                                    </span>
                                </div>

                                {/* Right Buttons */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {/* Copy Code Button */}
                                    <button
                                        onClick={handleCopyCode}
                                        title="Click to copy FREEDOM10"
                                        className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 sm:py-1.5 transition-all duration-200 hover:scale-[1.02] active:scale-95 font-bold cursor-pointer border ${copied
                                            ? "bg-[#0c776b] text-white border-[#0c776b] shadow-md shadow-[#0c776b]/20"
                                            : "bg-[#0c776b]/10 hover:bg-[#0c776b]/20 text-[#0c776b] border-[#0c776b]/30"
                                            }`}
                                    >
                                        <span className="text-[11px] sm:text-xs font-extrabold tracking-wider leading-none">
                                            FREEDOM10
                                        </span>
                                        <span className="text-[9px] sm:text-[10px] leading-tight font-medium flex items-center gap-0.5 mt-0.5 opacity-90">
                                            {copied ? (
                                                <>
                                                    <Check size={10} className="inline animate-bounce" /> Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={9} className="inline opacity-80" /> Copy code
                                                </>
                                            )}
                                        </span>
                                    </button>

                                    {/* Shop Offer Button */}
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            window.location.href = '/all-products';
                                        }}
                                        className="bg-[#0c776b] hover:bg-[#095f56] text-white rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 font-semibold text-[12px] sm:text-[13px] flex items-center gap-1 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-md shadow-[#0c776b]/20 cursor-pointer whitespace-nowrap"
                                    >
                                        Shop offer
                                        <ArrowRight size={14} className="inline" />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default GawdeePopup;