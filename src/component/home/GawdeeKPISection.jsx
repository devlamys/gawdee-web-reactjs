/* Developed by Grafizen International PVT. LTD. */
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";
import { useRef } from "react";
import customersHappy from "../../../public/imges/calculativeSection/activeCustomers.png"
import userGrowth from "../../../public/imges/calculativeSection/userGrowth.png"
import satisfection from "../../../public/imges/calculativeSection/satisfection.png"
import delivered from "../../../public/imges/calculativeSection/delivered.png"
import orderDeliverd from "../../../public/imges/calculativeSection/order-deliverys.png"

import {
    ShoppingCart,
    Users,
    TrendingUp,
    Package,
    Star,
} from "lucide-react";

const kpiData = [
    {
        title: "Happy Customers",
        value: 12450,
        icon: customersHappy,
        growth: "Trusted by families across India",
    },
    {
        title: "Daily Active Buyers",
        value: 8320,
        icon: userGrowth,
        growth: "People choosing natural lifestyle",
    },
{
    title: "Customer Driven Growth",
    value: 2450000,
    icon: orderDeliverd,
    growth: "Built on trust, quality & repeat customers",
},
    {
        title: "Products Delivered",
        value: 45890,
        icon: delivered,
        growth: "Pure & quality checked dispatch",
    },
    {
        title: "Customer Satisfaction",
        value: 480,
        suffix: "/5",
        icon: satisfection,
        growth: "Rated by real verified users",
    },
];

export default function GawdeeKPISection() {
    const ref = useRef(null);

    const isInView = useInView(ref, {
        once: true,
        margin: "-100px",
    });

    return (
        <div
            ref={ref}
            className="w-full relative px-4 pb-16 pt-[60px] "
        >

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-center mb-9"
            >

                          <motion.div
                            initial={{ y: 80, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 0.7 }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                            viewport={{ once: false, margin: "-100px" }}
                            className="absolute left-0 w-fit right-0 mx-auto  top-[30px] md:top-[-20px] block md:block text-[52px] lg:text-[130px] font-semibold uppercase text-transparent [-webkit-text-stroke:2px_rgba(60,80,40,0.25)] leading-none select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_10%,transparent)]"
                          >
                            Insights
                          </motion.div>
                <h2 className="text-3xl md:text-4xl font-[600] md:font-bold leading-8 text-[#0c776b]">
                    Gawdee Performance Overview
                </h2>

            </motion.div>

            <div className=" flex flex-wrap justify-center md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
                {kpiData.map((item, index) => {

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0, scale: 1 }
                                    : {}
                            }
                            transition={{
                                duration: 0.5,
                                delay: index * 0.08,
                                ease: "easeOut",
                            }}
                            whileHover={{ scale: 1.06 }}
                            className=" flex w-[160px] md:w-full relative gap-[15px] bg-white rounded-[10px] md:rounded-2xl p-3 md:p-4  items-center border border-[#dcebe0] shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden"
                        >

                            <div className="w-11 h-11 rounded-xl  flex items-center justify-center ">
                             <img src={item.icon} />
                            </div>

                            <div>

                                <h3 className="md:text-2xl text-[16px] font-bold text-[#0c776b]">
                                    {item.prefix && item.prefix}

                                    {isInView && (
                                        <CountUp
                                            end={item.value}
                                            duration={2.2}
                                            separator=","
                                        />
                                    )}

                                    {item.suffix && item.suffix}
                                </h3>

                                <p className="md:text-[12px] text-[10px] leading-[10px] md:leading-normal text-[#0c776b] ">
                                    {item.title}
                                </p>

                            </div>

                            <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#1f8f3a]/10 blur-2xl rounded-full"></div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}