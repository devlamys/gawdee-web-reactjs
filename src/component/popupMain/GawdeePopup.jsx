/* Developed by Grafizen International PVT. LTD. */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import mixmeImage from '../../../public/imges/popupImage/mixme.jpg';

const GawdeePopup = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                <div className="fixed inset-0 font-Poppins z-[100000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col"
                    >

                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 z-10 p-1 bg-white/80 rounded-full hover:bg-white transition"
                        >
                            <X size={16} />
                        </button>

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
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default GawdeePopup;