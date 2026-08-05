/* Developed by Grafizen International PVT. LTD. */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    AlertCircle,
    Package,
    Truck,
    DollarSign,
    Calendar,
    Clock,
    ChevronDown,
    X,

    CheckCircle2,
    CheckCircle,
    IndianRupee,
} from 'lucide-react';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useNavigate } from 'react-router-dom';
import { ApiGet, ApiPost } from "@/helper/axios"
import { useParams } from "react-router-dom"

const returnReasons = [
    'Product Quality Issue',
    'Wrong Item Received',
    'Damaged in Transit',
    'Not as Described',
    'Changed Mind',
    'Other',
];

const timeSlots = [
    '9:00 AM - 12:00 PM',
    '12:00 PM - 3:00 PM',
    '3:00 PM - 6:00 PM',
    '6:00 PM - 9:00 PM',
];

const products = [
    {
        id: '1',
        name: 'A2 Gir Cow Ghee 500ml',
        price: 899,
        qty: 1,
        image: 'https://via.placeholder.com/100',
        deliveredAt: '10 Mar 2026',
    },
    {
        id: '2',
        name: 'Raw Forest Honey 250g',
        price: 499,
        qty: 2,
        image: 'https://via.placeholder.com/100',
        deliveredAt: '10 Mar 2026',
    },
];

export default function ReturnPage() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        selectedProducts: [],
        reason: '',
        otherReason: '',
        refundMethod: 'original',
        bankAccountNumber: '',
        bankIFSC: '',
        bankHolderName: '',
        pickupAddress: '',
        pickupPhone: '',
        pickupDate: '',
        pickupTimeSlot: '',
    });

    const [errors, setErrors] = useState();
    const [submitted, setSubmitted] = useState(false);
    const [requestId, setRequestId] = useState('');
    const [expandedTimeSlot, setExpandedTimeSlot] = useState(false);
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (!id) return
        fetchOrder()
    }, [id])

    const fetchOrder = async () => {
        try {
            const res = await ApiGet(`/order-summary/${id}`)
            const data = res?.data

            setOrder(data)

            const formattedProducts = data?.orderItems?.map((item) => ({
                id: item.productId?._id,
                name: item.productId?.name,
                price: item.price,
                qty: item.quantity,
                image: item.selectedColorImage,
                deliveredAt: new Date(data.createdAt).toDateString(),
            }))

            setProducts(formattedProducts)

        } catch (err) {
            console.error(err)
        }
    }

    const handleBackProducts = () => {
        navigate("/my-orders")
        setSubmitted(false);
        resetForm();
    }

    const handleTrackReturnProduct = () => {
        navigate("/my-orders/return-order-details")
    }

    const validateForm = () => {
        const newErrors = {};

        if (formData.selectedProducts.length === 0) {
            newErrors.products = 'Please select at least one product to return';
        }

        if (!formData.reason) {
            newErrors.reason = 'Please select a reason for return';
        }

        if (formData.reason === 'Other' && !formData.otherReason.trim()) {
            newErrors.otherReason = 'Please specify your reason';
        }

        if (formData.refundMethod === 'bank') {
            if (!formData.bankAccountNumber.trim()) {
                newErrors.bankAccountNumber = 'Account number is required';
            }
            if (!formData.bankIFSC.trim()) {
                newErrors.bankIFSC = 'IFSC code is required';
            }
            if (!formData.bankHolderName.trim()) {
                newErrors.bankHolderName = 'Account holder name is required';
            }
        }

        if (!formData.pickupAddress.trim()) {
            newErrors.pickupAddress = 'Pickup address is required';
        }

        if (!formData.pickupPhone.trim()) {
            newErrors.pickupPhone = 'Phone number is required';
        }

        if (!formData.pickupDate) {
            newErrors.pickupDate = 'Pickup date is required';
        }

        if (!formData.pickupTimeSlot) {
            newErrors.pickupTimeSlot = 'Pickup time slot is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateRefundAmount = () => {
        return formData.selectedProducts.reduce((total, selected) => {
            const product = products.find((p) => p.id === selected.id);
            return total + (product ? product.price * selected.qty : 0);
        }, 0);
    };

    const handleSelectProduct = (productId, qtyToReturn) => {
        setFormData((prev) => {
            const existingIndex = prev.selectedProducts.findIndex(
                (p) => p.id === productId
            );

            if (existingIndex > -1) {
                const updated = [...prev.selectedProducts];
                updated.splice(existingIndex, 1);
                return { ...prev, selectedProducts: updated };
            }

            return {
                ...prev,
                selectedProducts: [
                    ...prev.selectedProducts,
                    { id: productId, qty: qtyToReturn },
                ],
            };
        });

        if (errors.products) {
            setErrors((prev) => ({ ...prev, products: '' }));
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (!validateForm()) return

        try {
            const payload = {
                orderId: order?._id,

                items: formData.selectedProducts.map((p) => ({
                    productId: p.id,
                    quantity: p.qty,
                })),

                reason:
                    formData.reason === "Other"
                        ? formData.otherReason
                        : formData.reason,

                refundMethod: formData.refundMethod,

                bankDetails:
                    formData.refundMethod === "bank"
                        ? {
                            accountNumber: formData.bankAccountNumber,
                            ifsc: formData.bankIFSC,
                            holderName: formData.bankHolderName,
                        }
                        : null,

                pickupDetails: {
                    address: formData.pickupAddress,
                    phone: formData.pickupPhone,
                    date: formData.pickupDate,
                    timeSlot: formData.pickupTimeSlot,
                },
            }

            const res = await ApiPost("/return-request/create", payload)

            console.log('res', res)

            if (res?.data?.success) {
                alert("Return Request send Successfully..");
                setRequestId(res?.data?.requestId || `RET-${Date.now()}`)
                setSubmitted(true)
            }

        } catch (err) {
            console.error(err)
            alert("Return request failed")
        }
    }

    const resetForm = () => {
        setFormData({
            selectedProducts: [],
            reason: '',
            otherReason: '',
            refundMethod: 'original',
            bankAccountNumber: '',
            bankIFSC: '',
            bankHolderName: '',
            pickupAddress: '',
            pickupPhone: '',
            pickupDate: '',
            pickupTimeSlot: '',
        });
        setErrors();
        setSubmitted(false);
    };

    const isProductSelected = (productId) =>
        formData.selectedProducts.some((p) => p.id === productId);

    return (

        <>

            <Header />
            <div
                className="  pt-[110px] md:pt-[160px] pb-[40px] px-4"

            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >

                    <div className=" mb-2 md:mb-5">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className=" text-[20px] md:text-2xl font-[600] text-slate-900 ">
                                Return & Refund
                            </h1>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <motion.div
                            className="lg:col-span-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <form onSubmit={handleSubmit} className=" space-y-4 md:space-y-6">

                                <motion.div
                                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200"
                                    whileHover={{ shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="p-2 bg-gradient-to-r from-[#0c776b]  to-emerald-500 rounded-lg"

                                        >
                                            <Check size={20} style={{ color: '#fff' }} />
                                        </div>
                                        <h2 className="text-[15px] font-semibold text-slate-900">
                                            Return Policy
                                        </h2>
                                    </div>
                                    <ul className="space-y-2 text-slate-600">
                                        <li className="flex gap-2 pl-3 text-[12px] items-center">
                                            <span
                                                className="text-lg text-[#0c776b] "

                                            >
                                                <CheckCircle size={17} />
                                            </span>
                                            <span>Returns accepted within 30 days of delivery</span>
                                        </li>
                                        <li className="flex gap-2 pl-3 text-[12px] items-center">
                                            <span
                                                className="text-lg text-[#0c776b] "

                                            >
                                                <CheckCircle size={17} />
                                            </span>
                                            <span>Product must be in original condition</span>
                                        </li>
                                        <li className="flex gap-2 pl-3 text-[12px] items-center">
                                            <span
                                                className="text-lg text-[#0c776b] "

                                            >
                                                <CheckCircle size={17} />
                                            </span>
                                            <span>Free pickup at your doorstep</span>
                                        </li>
                                        <li className="flex gap-2 pl-3 text-[12px] items-center">
                                            <span
                                                className="text-lg text-[#0c776b] "

                                            >
                                                <CheckCircle size={17} />
                                            </span>
                                            <span>Refund within 7 business days</span>
                                        </li>
                                    </ul>
                                </motion.div>

                                <motion.div
                                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200"
                                    whileHover={{ shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="p-2 bg-gradient-to-r from-[#0c776b]  to-emerald-500 rounded-lg"
                                            style={{ backgroundColor: 'rgba(157, 187, 90, 0.1)' }}
                                        >
                                            <Package size={20} style={{ color: '#fff' }} />
                                        </div>
                                        <h2 className="text-[15px] font-semibold text-slate-900">
                                            Select Products to Return
                                        </h2>
                                    </div>

                                    {errors.products && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2"
                                        >
                                            <AlertCircle size={20} className="text-red-600" />
                                            <span className="text-red-700 text-sm">
                                                {errors.products}
                                            </span>
                                        </motion.div>
                                    )}

                                    <div className="space-y-3">
                                        {products.map((product) => (
                                            <motion.div
                                                key={product.id}
                                                whileHover={{ scale: 1.02 }}
                                                className="p-3 border-[1.2px] border-slate-200 rounded-xl cursor-pointer transition-all"
                                                style={{
                                                    borderColor: isProductSelected(product.id)
                                                        ? '#059601'
                                                        : '#e2e8f0',
                                                    backgroundColor: isProductSelected(product.id)
                                                        ? 'rgba(157, 187, 90, 0.05)'
                                                        : 'transparent',
                                                }}
                                                onClick={() =>
                                                    handleSelectProduct(product.id, product.qty)
                                                }
                                            >
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={isProductSelected(product.id)}
                                                        onChange={() => handleProductSelect(product)}
                                                        className="w-5 h-5 rounded cursor-pointer"
                                                        style={{
                                                            accentColor: '#059601',
                                                        }}
                                                    />
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-14 h-14  text-[10px] rounded-lg object-cover bg-slate-100"
                                                    />
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-[14px] text-slate-900">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-[10px] text-slate-600">
                                                            Qty: {product.qty} | Delivered:{' '}
                                                            {product.deliveredAt}
                                                        </p>
                                                        <p
                                                            className="font-semibold text-[15px] mt-1"
                                                            style={{ color: '#059601' }}
                                                        >
                                                            ₹{product.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200"
                                    whileHover={{ shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="p-2 rounded-lg"
                                            style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }}
                                        >
                                            <AlertCircle size={20} style={{ color: '#EAB308' }} />
                                        </div>
                                        <h2 className="text-[15px] font-semibold text-slate-900">
                                            Reason for Return
                                        </h2>
                                    </div>

                                    {errors.reason && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2"
                                        >
                                            <AlertCircle size={20} className="text-red-600" />
                                            <span className="text-red-700 text-sm">
                                                {errors.reason}
                                            </span>
                                        </motion.div>
                                    )}

                                    <div className=" gap-[10px] grid grid-cols-2">
                                        {returnReasons.map((reason) => (
                                            <motion.label
                                                key={reason}
                                                className="flex items-center p-3 border-1 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300"
                                                style={{
                                                    borderColor:
                                                        formData.reason === reason
                                                            ? '#059601'
                                                            : '#e2e8f0',
                                                    backgroundColor:
                                                        formData.reason === reason
                                                            ? 'rgba(157, 187, 90, 0.05)'
                                                            : 'transparent',
                                                }}
                                                whileHover={{ scale: 1.01 }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="reason"
                                                    value={reason}
                                                    checked={formData.reason === reason}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            reason: e.target.value,
                                                        }))
                                                    }
                                                    style={{ accentColor: '#059601' }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="ml-3 text-[13px] text-slate-900">{reason}</span>
                                            </motion.label>
                                        ))}
                                    </div>

                                    {formData.reason === 'Other' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4"
                                        >
                                            <textarea
                                                value={formData.otherReason}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        otherReason: e.target.value,
                                                    }))
                                                }
                                                placeholder="Please specify your reason"
                                                className="w-full p-3 border-1 text-[13px] border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 resize-none"
                                                rows={3}
                                            />
                                            {errors.otherReason && (
                                                <p className="text-red-600 text-sm mt-2">
                                                    {errors.otherReason}
                                                </p>
                                            )}
                                        </motion.div>
                                    )}
                                </motion.div>

                                <motion.div
                                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200"
                                    whileHover={{ shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="p-2 bg-gradient-to-r from-[#0c776b]  to-emerald-500 rounded-lg"
                                            style={{ backgroundColor: 'rgba(157, 187, 90, 0.1)' }}
                                        >
                                            <IndianRupee size={20} style={{ color: '#fff' }} />
                                        </div>
                                        <h2 className="text-[15px] font-semibold text-slate-900">
                                            Refund Method
                                        </h2>
                                    </div>

                                    <div className=" grid lg:grid-cols-2 gap-[10px]">
                                        {['original', 'wallet', 'bank'].map((method) => (
                                            <motion.label
                                                key={method}
                                                className="flex items-center p-3 border-1 border-slate-200 rounded-xl cursor-pointer"
                                                style={{
                                                    borderColor:
                                                        formData.refundMethod === method
                                                            ? '#059601'
                                                            : '#e2e8f0',
                                                    backgroundColor:
                                                        formData.refundMethod === method
                                                            ? 'rgba(157, 187, 90, 0.05)'
                                                            : 'transparent',
                                                }}
                                                whileHover={{ scale: 1.01 }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="refundMethod"
                                                    value={method}
                                                    checked={formData.refundMethod === method}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            refundMethod: e.target.value,
                                                        }))
                                                    }
                                                    style={{ accentColor: '#059601' }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="ml-3 text-[13px] md:text-[15px] text-slate-900 capitalize">
                                                    {method === 'original'
                                                        ? 'Original Payment Method'
                                                        : method === 'wallet'
                                                            ? 'GAWDEE Wallet'
                                                            : 'Bank Transfer'}
                                                </span>
                                            </motion.label>
                                        ))}
                                    </div>

                                    {formData.refundMethod === 'bank' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 grid grid-cols-2 gap-3"
                                        >
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Account Number"
                                                    value={formData.bankAccountNumber}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            bankAccountNumber: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full p-2 border-1 text-[14px] border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                                                />
                                                {errors.bankAccountNumber && (
                                                    <p className="text-red-600 text-sm mt-1">
                                                        {errors.bankAccountNumber}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="IFSC Code"
                                                    value={formData.bankIFSC}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            bankIFSC: e.target.value.toUpperCase(),
                                                        }))
                                                    }
                                                    className="w-full p-2 border-1 text-[14px] border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                                                />
                                                {errors.bankIFSC && (
                                                    <p className="text-red-600 text-sm mt-1">
                                                        {errors.bankIFSC}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Account Holder Name"
                                                    value={formData.bankHolderName}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            bankHolderName: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full p-2 border-1 text-[14px] border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                                                />
                                                {errors.bankHolderName && (
                                                    <p className="text-red-600 text-sm mt-1">
                                                        {errors.bankHolderName}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>

                                <motion.div
                                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200"
                                    whileHover={{ shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="p-2 bg-gradient-to-r from-[#0c776b]  to-emerald-500 rounded-lg"
                                            style={{ backgroundColor: 'rgba(157, 187, 90, 0.1)' }}
                                        >
                                            <Truck size={20} style={{ color: '#fff' }} />
                                        </div>
                                        <h2 className="text-[15px] font-semibold text-slate-900">
                                            Pickup Details
                                        </h2>
                                    </div>

                                    <div className="  space-y-1 md:space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 md:mb-2">
                                                Pickup Address
                                            </label>
                                            <textarea
                                                value={formData.pickupAddress}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        pickupAddress: e.target.value,
                                                    }))
                                                }
                                                placeholder="Enter your complete address"
                                                className="w-full p-3 text-[13px] border-1 border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 resize-none"
                                                rows={3}
                                            />
                                            {errors.pickupAddress && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {errors.pickupAddress}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 md:mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.pickupPhone}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        pickupPhone: e.target.value,
                                                    }))
                                                }
                                                placeholder="+91 XXXXXXXXXX"
                                                className="w-full text-[13px] px-3 py-2 border-1 border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                                            />
                                            {errors.pickupPhone && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {errors.pickupPhone}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 pt-[10px] md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 md:mb-2">
                                                    Pickup Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.pickupDate}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            pickupDate: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full text-[13px] px-3 py-2 border-1 border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                                                />
                                                {errors.pickupDate && (
                                                    <p className="text-red-600 text-sm mt-1">
                                                        {errors.pickupDate}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 md:mb-2">
                                                    Pickup Time Slot
                                                </label>
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setExpandedTimeSlot(!expandedTimeSlot)
                                                        }
                                                        className="w-full px-3 py-2 text-[13px] border-1 border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-left flex justify-between items-center"
                                                        style={{
                                                            borderColor: formData.pickupTimeSlot
                                                                ? '#059601'
                                                                : '#e2e8f0',
                                                        }}
                                                    >
                                                        <span
                                                            className={
                                                                formData.pickupTimeSlot
                                                                    ? 'text-slate-900'
                                                                    : 'text-slate-500'
                                                            }
                                                        >
                                                            {formData.pickupTimeSlot || 'Select time slot'}
                                                        </span>
                                                        <ChevronDown
                                                            size={20}
                                                            className={`transition-transform ${expandedTimeSlot ? 'rotate-180' : ''
                                                                }`}
                                                        />
                                                    </button>

                                                    <AnimatePresence>
                                                        {expandedTimeSlot && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                className="absolute top-full left-0 right-0 mt-2 bg-white border-1 border-slate-200 rounded-lg shadow-lg z-10"
                                                            >
                                                                {timeSlots.map((slot) => (
                                                                    <button
                                                                        key={slot}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setFormData((prev) => ({
                                                                                ...prev,
                                                                                pickupTimeSlot: slot,
                                                                            }));
                                                                            setExpandedTimeSlot(false);
                                                                        }}
                                                                        className="w-full text-[13px] text-left p-2 hover:bg-slate-50 border-b last:border-b-0 transition-colors"
                                                                    >
                                                                        {slot}
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                {errors.pickupTimeSlot && (
                                                    <p className="text-red-600 text-sm mt-1">
                                                        {errors.pickupTimeSlot}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full  py-2 md:py-3 px-6 rounded-xl bg-gradient-to-r from-[#0c776b]  to-emerald-500 font-semibold text-white transition-all flex items-center justify-center gap-2"

                                >
                                    <Check size={20} />
                                    Submit Return Request
                                </motion.button>
                            </form>
                        </motion.div>

                        <motion.div
                            className="lg:col-span-1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div
                                className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200 lg:fixed top-[230px]"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(157, 187, 90, 0.02) 100%)',
                                }}
                            >
                                <h3 className="text-xl font-semibold text-slate-900 mb-2 md:mb-4">
                                    Return Summary
                                </h3>

                                <div className=" space-y-1 md:space-y-3 mb-4 md:mb-6">
                                    <h4 className="text-sm font-medium text-slate-700">
                                        Selected Items
                                    </h4>
                                    {formData.selectedProducts.length === 0 ? (
                                        <p className="text-slate-500 text-sm">
                                            No items selected yet
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {formData.selectedProducts.map((selected) => {
                                                const product = products.find(
                                                    (p) => p.id === selected.id
                                                );
                                                return (
                                                    <div
                                                        key={selected.id}
                                                        className="flex justify-between text-sm"
                                                    >
                                                        <span className="text-slate-700">{product?.name}</span>
                                                        <span
                                                            className="font-medium"
                                                            style={{ color: '#059601' }}
                                                        >
                                                            ₹{product && product.price * selected.qty}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div
                                    className="border-t-2 pt-2 md:pt-4 mb-4 md:mb-6"
                                    style={{ borderColor: 'rgba(157, 187, 90, 0.2)' }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-slate-900">
                                            Refund Amount:
                                        </span>
                                        <span
                                            className="text-2xl font-bold"
                                            style={{ color: '#059601' }}
                                        >
                                            ₹{calculateRefundAmount()}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Check size={16} style={{ color: '#059601' }} />
                                        <span>Free return pickup</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} style={{ color: '#059601' }} />
                                        <span>7-day refund process</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Package size={16} style={{ color: '#059601' }} />
                                        <span>Original packaging required</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <AnimatePresence>
                    {submitted && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[10000]"
                            onClick={() => setSubmitted(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="flex justify-center mb-4"
                                >
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: 'rgba(157, 187, 90, 0.2)' }}
                                    >
                                        <Check size={32} style={{ color: '#059601' }} />
                                    </div>
                                </motion.div>

                                <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
                                    Return Request Submitted!
                                </h2>

                                <p className="text-slate-600 text-center mb-6">
                                    Your return request has been successfully processed.
                                </p>

                                <div
                                    className="bg-slate-50 rounded-xl p-4 mb-6"
                                    style={{ backgroundColor: 'rgba(157, 187, 90, 0.05)' }}
                                >
                                    <p className="text-sm text-slate-600 mb-1">Request ID:</p>
                                    <p className="text-lg font-mono font-semibold text-slate-900">
                                        {requestId}
                                    </p>
                                </div>

                                <div className="space-y-2 mb-6 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Package size={16} style={{ color: '#059601' }} />
                                        <span>Pickup scheduled for {formData.pickupDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={16} style={{ color: '#059601' }} />
                                        <span>
                                            Refund amount: ₹{calculateRefundAmount()}
                                        </span>
                                    </div>
                                </div>

                                <div className=" gap-3 flex">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-2 px-4 rounded-lg font-semibold text-white transition-all"
                                        style={{ backgroundColor: '#059601' }}
                                        onClick={

                                            handleBackProducts
                                        }
                                    >
                                        Back to Orders
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-2 px-4 rounded-lg font-semibold border-1 text-slate-900 transition-all"
                                        style={{ borderColor: '#059601', color: '#059601' }}
                                        onClick={handleTrackReturnProduct}
                                    >
                                        Track Request
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Footer />

        </>
    );
}