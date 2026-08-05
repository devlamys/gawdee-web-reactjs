/* Developed by Grafizen International PVT. LTD. */

'use client';

import { motion } from 'framer-motion';
import {
  Download,
  Printer,
  MessageCircle,
  Share2,
  ArrowLeft,
} from 'lucide-react';

import { Globe, Mail, MapIcon, MapPin, PhoneCall, Webhook, WebhookOffIcon } from "lucide-react";
import logo from "../../../public/imges/Logo-green-text.png"
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import image1 from "../../../public/imges/productDetails/QrImage.jpeg"
import stamp from "../../../public/imges/productDetails/stamp.png"

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ApiGet } from "@/helper/axios";

export function InvoiceView({ onBack, onEdit }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();

  const printRef = useRef(null);

  const [orderData, setOrderData] = useState(location.state?.order || null);
  console.log('orderData', orderData)
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderData || !orderId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await ApiGet(`/order-details/${orderId}`);

        const data =
          res?.data?.data ||
          res?.data?.order ||
          res?.order ||
          res?.data ||
          null;

        setOrderData(data);
      } catch (error) {
        console.error("Invoice Order Fetch Error:", error);
        setOrderData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, orderData]);

  const formatPaymentMethod = (method, order = {}) => {
    const value = String(method || "").toLowerCase().trim();

    if (
      value === "razorpay" ||
      value === "online" ||
      value === "upi" ||
      order?.razorpay_payment_id ||
      order?.razorpay_order_id
    ) {
      return "Razorpay";
    }

    if (
      value === "cod" ||
      value === "cash on delivery" ||
      value === "cash_on_delivery"
    ) {
      return "COD";
    }

    if (value === "card") return "Card";
    if (value === "netbanking" || value === "net banking") return "Net Banking";
    if (value === "wallet") return "Wallet";

    return method ? String(method).charAt(0).toUpperCase() + String(method).slice(1) : "-";
  };

  const toNumber = (value) => {
    const num = Number(value || 0);
    return Number.isFinite(num) ? num : 0;
  };

  const formatDate = (date) => {
    if (!date) return new Date().toLocaleDateString("en-IN");

    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return String(date);

    return d.toLocaleDateString("en-IN");
  };

  const numberToWords = (amount) => {
    const num = Math.round(Number(amount || 0));

    if (num === 0) return "Zero Rupees Only";

    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const belowHundred = (n) => {
      if (n < 20) return ones[n];
      return `${tens[Math.floor(n / 10)]} ${ones[n % 10]}`.trim();
    };

    const belowThousand = (n) => {
      if (n < 100) return belowHundred(n);

      return `${ones[Math.floor(n / 100)]} Hundred ${n % 100 ? belowHundred(n % 100) : ""
        }`.trim();
    };

    let n = num;
    let words = "";

    const crore = Math.floor(n / 10000000);
    n %= 10000000;

    const lakh = Math.floor(n / 100000);
    n %= 100000;

    const thousand = Math.floor(n / 1000);
    n %= 1000;

    if (crore) words += `${belowThousand(crore)} Crore `;
    if (lakh) words += `${belowThousand(lakh)} Lakh `;
    if (thousand) words += `${belowThousand(thousand)} Thousand `;
    if (n) words += `${belowThousand(n)} `;

    return `${words.trim()} Rupees Only`;
  };

  const invoice = useMemo(() => {
    const data = orderData?.data || orderData || {};

    const orderInfo =
      typeof data?.orderId === "object" && data?.orderId !== null
        ? data.orderId
        : {};

    const customerDetails =
      orderInfo?.customerDetails ||
      data?.customerDetails ||
      {};

    const deliveryDetails =
      orderInfo?.deliveryDetails ||
      data?.deliveryDetails ||
      {};

    const priceDetails =
      data?.priceDetails ||
      orderInfo?.priceDetails ||
      {};

    const customerName =
      data?.billingDetails?.name ||
      `${customerDetails?.firstName || ""} ${customerDetails?.lastName || ""}`.trim() ||
      customerDetails?.fullName ||
      customerDetails?.name ||
      "Customer";

    const customerPhone =
      data?.billingDetails?.phone ||
      customerDetails?.phone ||
      customerDetails?.mobile ||
      "";

    const customerAddress =
      data?.billingDetails?.address ||
      customerDetails?.streetAddress ||
      customerDetails?.address ||
      "";

    const customerCity =
      customerDetails?.city ||
      deliveryDetails?.city ||
      "RAJKOT";

    const customerPincode =
      customerDetails?.pinCode ||
      customerDetails?.pincode ||
      deliveryDetails?.pincode ||
      "";

    const customerState =
      customerDetails?.state ||
      deliveryDetails?.state ||
      "Gujarat";

    const rawItems =
      Array.isArray(data?.items) && data.items.length > 0
        ? data.items
        : Array.isArray(orderInfo?.orderItems) && orderInfo.orderItems.length > 0
          ? orderInfo.orderItems
          : Array.isArray(data?.orderItems)
            ? data.orderItems
            : [];

    const responseTax = Number(
      priceDetails?.tax ||
      priceDetails?.gst ||
      data?.tax ||
      data?.gst ||
      orderInfo?.tax ||
      orderInfo?.gst ||
      0
    );

    const hasTaxInResponse = responseTax > 0;

    const items = rawItems.map((item, index) => {
      const product =
        typeof item?.productId === "object" && item?.productId !== null
          ? item.productId
          : {};

      const qty = Number(item?.quantity || item?.qty || 1);

      const mrp = Number(
        product?.price ||
        product?.mrp ||
        item?.mrp ||
        item?.originalPrice ||
        item?.productPrice ||
        item?.price ||
        0
      );

      const rate = Number(
        product?.salePrice ||
        item?.salePrice ||
        item?.sellingPrice ||
        item?.rate ||
        item?.price ||
        product?.price ||
        0
      );

      const discountPerItem = Math.max(mrp - rate, 0);
      const discountAmount =
        Number(item?.discountAmount || 0) > 0
          ? Number(item.discountAmount)
          : discountPerItem * qty;

      const netAmount = rate * qty;

      const variant =
        item?.variant ||
        item?.selectedColor ||
        item?.weight ||
        "";

      const productWeight =
        product?.weight && product?.weightUnit
          ? `${product.weight} ${product.weightUnit}`
          : "";

      return {
        sr: index + 1,

        name: `${product?.name || product?.title || item?.name || "Gawdee Product"}${variant || productWeight ? `\n${variant || productWeight}` : ""
          }`,

        hsn: item?.hsn || product?.hsn || product?.hsnCode || "04059020",

        mrp: mrp.toFixed(2),
        qty: qty.toFixed(2),
        unit: item?.unit || product?.weightUnit || "PCS-PIE",

        rate: rate.toFixed(2),

        discount: discountAmount.toFixed(2),

        gst: hasTaxInResponse ? `${item?.taxRate || priceDetails?.taxRate || 5}.0%` : "-",

        net: netAmount.toFixed(2),

        grossAmount: mrp * qty,
        taxableAmount: netAmount,
        discountAmount,
      };
    });

    const subtotalQty = items.reduce(
      (sum, item) => sum + Number(item.qty || 0),
      0
    );

    const mrpSubtotal = items.reduce(
      (sum, item) => sum + Number(item.grossAmount || 0),
      0
    );

    const productDiscount = items.reduce(
      (sum, item) => sum + Number(item.discountAmount || 0),
      0
    );

    const netSubtotal = items.reduce(
      (sum, item) => sum + Number(item.taxableAmount || 0),
      0
    );

    const couponDiscount = Number(priceDetails?.couponDiscount || 0);

    const backendDiscount = Number(priceDetails?.discount || 0);

    const extraDiscount =
      backendDiscount > productDiscount
        ? backendDiscount - productDiscount
        : 0;

    const shippingCost = Number(
      priceDetails?.shippingCost ||
      orderInfo?.deliveryDetails?.price ||
      deliveryDetails?.price ||
      0
    );

    const tax = hasTaxInResponse ? responseTax : 0;

    const cgst = tax > 0 ? tax / 2 : 0;
    const sgst = tax > 0 ? tax / 2 : 0;

    const calculatedFinalAmount = Math.max(
      netSubtotal - extraDiscount - couponDiscount + tax + shippingCost,
      0
    );

    const finalAmount = Number(
      priceDetails?.finalAmount ||
      data?.finalAmount ||
      orderInfo?.finalAmount ||
      calculatedFinalAmount
    );

    const rawPaymentMethod =
      data?.paymentMethod ||
      orderInfo?.paymentMethod ||
      data?.paymentMode ||
      orderInfo?.paymentMode ||
      "";

    const displayPaymentMethod = formatPaymentMethod(rawPaymentMethod, data);

    return {
      company: "GAWDEE ORGANIC PRIVATE LIMITED",
      address:
        "Property No.113, Limbada, Wankaner, Morbi, Gujarat, India-363621",
      phone1: "+91 70 55 20 70 30",
      phone2: "+91 70 55 30 70 30",
      website: "www.gawdee.com",
      email: "info@gawdee.com",

      invoiceNo:
        data?.invoiceNumber ||
        data?.invoiceNo ||
        orderInfo?.orderId ||
        data?.orderId ||
        data?._id?.slice(-8)?.toUpperCase() ||
        "-",

      invoiceDate: formatDate(data?.createdAt || orderInfo?.createdAt),
      supplyDate: formatDate(orderInfo?.createdAt || data?.createdAt),

      courier:
        orderInfo?.courierName ||
        orderInfo?.shippingProvider ||
        data?.courierCompany ||
        data?.shippingPartner ||
        "",

      awb:
        orderInfo?.awbNumber ||
        orderInfo?.trackingNo ||
        orderInfo?.shipmentId ||
        data?.trackingNo ||
        data?.awb ||
        "0.000",

      paymentMode: displayPaymentMethod,

      receiver: {
        name: customerName,
        mobile: customerPhone,
        address: customerAddress,
        pin: `${customerCity}${customerPincode ? `-${customerPincode}` : ""}`,
        state: customerState,
        gstin: customerDetails?.gstin || "",
      },

      consignee: {
        name: customerName,
        address: customerAddress,
        pin: `${customerCity}${customerPincode ? `-${customerPincode}` : ""}`,
        state: customerState,
        gstin: customerDetails?.gstin || "",
      },

      items,

      subtotalQty: subtotalQty.toFixed(2),

      subtotalDiscount: productDiscount.toFixed(2),

      subtotalNet: netSubtotal.toFixed(2),

      mrpSubtotal: mrpSubtotal.toFixed(2),
      extraDiscount: extraDiscount.toFixed(2),
      couponDiscount: couponDiscount.toFixed(2),
      shippingCost: shippingCost.toFixed(2),
      tax: tax.toFixed(2),

      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),

      billAmount: finalAmount.toFixed(2),

      amountWords:
        data?.amountWords ||
        data?.amountInWords ||
        numberToWords(finalAmount),

      bank: {
        name: "ICICI",
        branch: "WANKANER",
        account: "118405014771",
        ifsc: "ICIC0001184",
        upi: "7055207030.eazypay@icici",
      },

      legal: {
        cin: "U15400GJ2022PTC130470",
        fssi: "10722047000066",
        gstin: "24AAJCG6632L1ZC",
        pan: "AAJCG6632L",
      },
    };
  }, [orderData]);

  console.log('invoice', invoice)

  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleDownloadPDF = async () => {
    const invoiceElement = printRef.current;

    if (!invoiceElement) {
      alert("Invoice not found");
      return;
    }

    try {

      invoiceElement.style.width = "794px";

      await new Promise((res) => setTimeout(res, 300));

      const canvas = await html2canvas(invoiceElement, {
        scale: 3, 
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 210;
      const pdfHeight = 297;

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;

      if (imgHeight <= pdfHeight) {

        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      } else {

        let heightLeft = imgHeight;

        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
      }

      pdf.save(`Invoice-${invoice.invoiceNo}.pdf`);
    } catch (error) {
      console.error(error);
      alert("PDF failed");
    }
  };

  const handleWhatsApp = () => {
    const message = `I have an invoice for you!\n\nInvoice ID: ${invoice}\nOrder ID: ${orderId}\nTotal Amount: ₹${formatCurrency(total)}\n\nPlease review and confirm.`;

    const phone = customerPhone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  };

  const handleSMS = () => {
    const message = `Invoice ${invoice} - Order ${orderId} - Total: ₹${formatCurrency(total)}`;
    const smsUrl = `sms:${customerPhone}?body=${encodeURIComponent(message)}`;

    window.location.href = smsUrl;
  };

  const handlePrint = () => {
    window.print();
  };
  return (
    <div className="p-6">

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mb-6 no-print flex  justify-between gap-4 rounded-[18px] border border-[#E5E7EB] bg-white/90 p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between"
      >

        <button
          type="button"
          onClick={handleBack}
          className="group inline-flex h-[42px] w-fit items-center gap-2 rounded-[12px] border border-[#DDE7DA] bg-[#F8FBF6] px-4 text-[13px] font-semibold text-[#0c776b] transition-all duration-300 hover:-translate-x-0.5 hover:border-[#0c776b]/40 hover:bg-[#EEF7EA] active:scale-[0.98]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-white text-[#0c776b] shadow-sm transition group-hover:bg-[#0c776b] group-hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </span>
          Back
        </button>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="group inline-flex  h-[42px] items-center gap-2 rounded-[12px] border border-[#E4E9E2] bg-white px-4 text-[13px] font-semibold text-[#0c776b] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0c776b]/40 hover:bg-[#F3FAF0] hover:shadow-md active:scale-[0.98]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#EAF4EC] text-[#0c776b] transition group-hover:bg-[#0c776b] group-hover:text-white">
              <Download className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="group inline-flex cursor-pointer h-[42px] items-center gap-2 rounded-[12px] border border-[#E4E9E2] bg-white px-4 text-[13px] font-semibold text-[#374151] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#64748B]/40 hover:bg-[#F8FAFC] hover:shadow-md active:scale-[0.98]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#F1F5F9] text-[#475569] transition group-hover:bg-[#475569] group-hover:text-white">
              <Printer className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline">Print</span>
          </button>

        </div>
      </motion.div>

      <div id="invoice-print-area" ref={printRef} className="invoice-print-area w-full overflow-x-auto md:overflow-visible bg-white">
        <div className="invoice-paper w-[794px] min-h-[1023px] mx-auto bg-white p-4 text-black shadow-xl">

          <div className="border border-black">
            <div className="flex items-start justify-between px-4 py-3">
              <div className="w-[150px]">
                <img src={logo} alt="Gawdee" className="w-[120px] object-contain" />
              </div>

              <div className="text-center">
                <h1 className="text-[20px]  my-0 font-bold tracking-[2px] text-[#009b75] uppercase">
                  {invoice.company}
                </h1>
                <p className="text-[10px]  justify-center flex items-center gap-2 font-[500] ">
                  <MapPin size={12} className=" text-[#009b75]" /> {invoice.address}
                </p>
                <p className="text-[13px] font-semibold mt-4 italic">
                  “The Mother of Organic Nutrition”
                </p>
              </div>

              <div className="w-[130px] flex flex-col justify-end text-[12px] !space-y-1 font-semibold leading-[20px]">
                <div className=" flex gap-1 items-center text-[11px] font-[500]">
                  <div className=" w-[20px] border flex justify-center items-center rounded-[100px] text-[#009b75] border-[#009b75] h-[20px]">
                    <PhoneCall size={10} />
                  </div>
                  <p> {invoice.phone1}</p>
                </div>
                <div className=" flex gap-1 items-center text-[11px] font-[500]">
                  <div className=" w-[20px] border flex justify-center items-center rounded-[100px] text-[#009b75] border-[#009b75] h-[20px]">
                    <PhoneCall size={10} />
                  </div>
                  <p>{invoice.phone2}</p>
                </div>

                <div className=" flex gap-1 items-center text-[11px] font-[500]">
                  <div className=" w-[20px] border flex justify-center items-center rounded-[100px] text-[#009b75] border-[#009b75] h-[20px]">
                    <Globe size={10} />
                  </div>
                  <p>{invoice.website}</p>
                </div>
                <div className=" flex gap-1 items-center text-[11px] font-[500]">
                  <div className=" w-[20px] border flex justify-center items-center rounded-[100px] text-[#009b75] border-[#009b75] h-[20px]">
                    <Mail size={10} />
                  </div>

                  <p>{invoice.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 border-t border-b border-black text-[14px] font-[600]">
              <div className="px-2">Debit Memo</div>
              <div className="text-center">Bill of Supply</div>
              <div className="text-right px-2">Original</div>
            </div>

            <div className="grid grid-cols-2 border-b border-black min-h-[80px] text-[12px]">
              <div className="p-3 border-r border-black">
                <div className="grid grid-cols-[100px_10px_1fr] gap-y-[2px]">
                  <b className=" font-[600]">Invoice Date</b><span>:</span><span className=" text-[10px] font-[500]">{invoice.invoiceDate}</span>
                  <b className=" font-[600]">Invoice No.</b><span>:</span><span className=" text-[10px] font-[500]">{invoice.invoiceNo}</span>
                  <b className=" font-[600]">Date of Supply</b><span>:</span><span className=" text-[10px] font-[500]">{invoice.supplyDate}</span>
                </div>
              </div>

              <div className="p-3">
                <div className="grid grid-cols-[120px_10px_1fr] gap-y-[2px]">
                  <span className=" font-[600] text-[12px]">Courier Compny</span><span>:</span><span className=" text-[10px] font-[500]">{invoice.courier}</span>
                  <span className=" font-[600] text-[12px]">Tracking No./AWB</span><span>:</span><span className=" text-[10px] font-[500]">{invoice.awb}</span>
                  <span className=" font-[600] text-[12px]">Payment Mode</span><span>:</span><span className=" text-[10px] font-[500]"> {invoice.paymentMode}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 border-b border-black text-[12px]">
              <div className="border-r border-black">
                <div className="font-[600] text-[14px] border-b border-black px-2 py-1">
                  Details of Receiver / Billed to:
                </div>
                <div className="p-3 min-h-[120px] flex flex-col justify-center">

                  <div className="grid grid-cols-[55px_1fr] gap-y-[3px] items-start text-[12px]">

                    <p className="font-[600] text-[10px]">M/s.</p>
                    <p className="font-[500]">: {invoice.receiver.name}</p>

                    <p className="font-[600]">MO</p>
                    <p className="font-[500] text-[10px]">: {invoice.receiver.mobile}</p>

                    <p className="font-[600]">Add.</p>
                    <p className="font-[500] leading-[12px] text-[10px] whitespace-pre-line">
                      : {invoice.receiver.address}
                    </p>

                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-2 text-[12px]">

                    <div className="flex items-center">
                      <span className="font-[600]">PIN COD</span>
                      <span className="px-1">:</span>
                      <span className="font-[500] text-[10px]">{invoice.receiver.pin}</span>
                    </div>

                    <div className="flex items-center justify-end">
                      <span className="font-[600]">State</span>
                      <span className="px-1">:</span>
                      <span className="font-[500] text-[10px]">{invoice.receiver.state}</span>
                    </div>

                  </div>

                  <div className="flex items-center mt-2 text-[12px]">
                    <span className="font-[600]">GSTIN</span>
                    <span className="px-1">:</span>
                    <span className="font-[500] text-[10px]">{invoice.receiver.gstin}</span>
                  </div>

                </div>
              </div>

              <div>
                <div className="font-[600] text-[14px]  border-b border-black px-2 py-1">
                  Details of Consignee / Shipped to:
                </div>
                <div className="p-3 min-h-[130px] flex flex-col justify-center">

                  <div className="grid grid-cols-[55px_1fr] gap-y-[6px] items-start text-[12px]">

                    <p className="font-[600]">M/s.</p>
                    <p className="font-[500] text-[10px]">
                      : {invoice.consignee.name}
                    </p>

                    <p className="font-[600]">Add.</p>
                    <p className="font-[500] text-[10px] leading-[12px] whitespace-pre-line">
                      : {invoice.consignee.address}
                    </p>

                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-1 text-[12px]">

                    <div className="flex items-center">
                      <span className="font-[600]">PIN COD</span>
                      <span className="px-1">:</span>
                      <span className="font-[500] text-[10px]">{invoice.consignee.pin}</span>
                    </div>

                    <div className="flex items-center justify-end">
                      <span className="font-[600]">State</span>
                      <span className="px-1">:</span>
                      <span className="font-[500] text-[10px]">{invoice.consignee.state}</span>
                    </div>

                  </div>

                  <div className="flex items-center mt-3 text-[12px]">
                    <span className="font-[600]">GSTIN</span>
                    <span className="px-1">:</span>
                    <span className="font-[500] text-[10px]">{invoice.consignee.gstin}</span>
                  </div>

                </div>
              </div>
            </div>

            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className=" text-center">
                  <th className="border-r font-[600] border-b border-black w-[28px] py-2">Sr.</th>
                  <th className="border-r font-[600] border-b border-black py-2">Description of Goods</th>
                  <th className="border-r font-[600] border-b border-black w-[70px]">HSN</th>
                  <th className="border-r font-[600] border-b border-black w-[60px]">MRP</th>
                  <th className="border-r font-[600] border-b border-black w-[60px]">Qty</th>
                  <th className="border-r font-[600] border-b border-black w-[60px]">Uni</th>
                  <th className="border-r font-[600] border-b border-black w-[70px]">Rate</th>
                  <th className="border-r font-[600] border-b border-black w-[60px]">Disc.</th>
                  <th className="border-r font-[600] border-b border-black w-[55px]">GST</th>
                  <th className="border-b font-[600] border-black w-[80px]">Net Amount</th>
                </tr>
              </thead>

              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.sr} className="align-top text-[11px] font-[500] h-[170px]">
                    <td className="border-r border-b border-black text-center py-2">{item.sr}</td>
                    <td className="border-r border-b border-black px-2 py-2 whitespace-pre-line">
                      {item.name}
                    </td>
                    <td className="border-r border-b border-black text-center py-2">{item.hsn}</td>
                    <td className="border-r border-b border-black text-center py-2">{item.mrp}</td>
                    <td className="border-r border-b border-black text-center py-2">{item.qty}</td>
                    <td className="border-r border-b border-black text-center py-2">{item.unit}</td>
                    <td className="border-r border-b border-black text-center py-2">{item.rate}</td>
                    <td className="border-r border-b border-black text-center py-2">{item.discount}</td>
                    <td className="border-r border-b border-black text-center py-2">{item.gst}</td>
                    <td className="border-b border-black text-right py-2 px-1">{item.net}</td>
                  </tr>
                ))}

                <tr className=" h-[26px]">
                  <td className="border-r border-b border-black"></td>
                  <td className="border-r font-[600] border-b border-black text-left pl-[10px]">Sub Total :</td>
                  <td className="border-r  font-[600] border-b border-black"></td>
                  <td className="border-r  font-[600] border-b border-black"></td>
                  <td className="border-r  font-[600] border-b border-black text-center ">{invoice.subtotalQty}</td>
                  <td className="border-r  font-[600] border-b border-black"></td>
                  <td className="border-r  font-[600] border-b border-black"></td>
                  <td className="border-r  font-[600] border-b border-black text-center ">{invoice.subtotalDiscount}</td>
                  <td className="border-r  font-[600] border-b border-black"></td>
                  <td className="border-b  font-[600] border-black text-right px-1 f">{invoice.subtotalNet}</td>
                </tr>
              </tbody>
            </table>

            <div className="grid grid-cols-[1fr_220px] border-b border-black text-[12px]">
              <div className="border-r border-black p-2 min-h-[18px]">
                <p className="font-[600] text-[16px]">Total Invoice Amount in Words:</p>
                <p className="font-[600] text-[13px]">{invoice.amountWords}</p>
              </div>

              <div className="p-2 h-full">
                <div className="grid grid-cols-2 gap-y-1">
                  <span>CGST</span><span className="text-right  font-[600]">{invoice.cgst}</span>
                  <span>SGST</span><span className="text-right font-[600]">{invoice.sgst}</span>
                  <span></span><span className="text-right font-[600]">0.00</span>
                  <span></span><span className="text-right font-[600]">0.00</span>
                  <span></span><span className="text-right font-[600]">0.00</span>
                  <span className=' text-[] font-bold '>Bill Amount :</span>
                  <span className=' font-bold text-right'>{invoice.billAmount}</span>
                </div>

              </div>
            </div>

            <div className="grid grid-cols-3 border-b border-black text-[12px]">
              <div className="border-r border-black p-2 min-h-[80px]">
                <div className="grid  font-[600] grid-cols-[110px_10px_1fr]">
                  <b className="font-[600]">Bank Name</b><span>:</span><span className=" font-[500] text-[11px]">{invoice.bank.name}</span>
                  <b className="font-[600]">Branch Name</b><span>:</span><span className=" font-[500] text-[11px]">{invoice.bank.branch}</span>
                  <b className="font-[600]">Bank A/c. No.</b><span>:</span><span className=" font-[500] text-[11px]">{invoice.bank.account}</span>
                  <b className="font-[600]">RTGS/IFSC Code</b><span>:</span><span className=" font-[500] text-[11px]">{invoice.bank.ifsc}</span>
                </div>
              </div>

              <div className="border-r border-black p-2">
                <div className="grid grid-cols-[90px_10px_1fr]">
                  <b>Previous Bal</b><span>:</span><span></span>
                  <b>This Bill</b><span>:</span><span>{invoice.billAmount}</span>
                  <b className="text-pink-600">Closing Bal</b><span>:</span>
                  <span className="text-blue-700 font-bold">{invoice.billAmount} DB</span>
                </div>
              </div>

              <div className="p-2 text-center relative">

                <p className="font-[500]">For, GAWDEE ORGANIC PRIVATE</p>
                <img className='w-[80px] my-3 mx-auto object-contain' src={stamp} alt="" />
                <p className="mt-1 font-bold text-[11px]">Authorised Signatory</p>
              </div>
            </div>

            <div className="grid grid-cols-[320px_1fr] text-[12px]">
              <div className="border-r border-black p-2">
                <p className="font-bold">Terms & Condition :</p>
                <p className="font-[500]  text-[10px] leading-[14px]">
                  (1) Returns will only be accepted for damaged, defective, or wrongly
                  supplied products, and must be reported within 48 hours of delivery
                  with valid proof.
                </p>
                <p className="font-[500]  text-[10px] leading-[14px] mt-1">
                  (2) Delivery & Risk: All products are carefully packed and shipped.
                  Risk of loss or damage passes to the buyer upon delivery.
                </p>
                <p className="font-[500]  text-[10px] mt-1 leading-[14px]">
                  (3) Jurisdiction: All disputes are subject to wankaner jurisdiction only.
                </p>
              </div>

              <div className="grid grid-cols-[185.7px_1fr]">
                <div className="p-2">
                  <div className="w-[100px] mx-auto h- [90px] border rounded-[5px] overflow-hidden border-black bg-white flex items-center justify-center text-[10px] text-center">
                    <img src={image1} alt="" />
                  </div>
                  <p className="font-[600] mt-1  text-center text-[14px]">PAYMENT QR CODE</p>
                  <div className=" flex   gap-[2px]  items-start">

                    <p className=" min-w-[30px] font-[600] text-[11px]">UPI ID :</p>
                    <p className="text-[10px] whitespace-pre-line max-w-[118px] pt-[2px]">{invoice.bank.upi}</p>
                  </div>
                </div>

                <div className="p-3 border-l border-black  border-[#a5a000]">
                  <div className="grid grid-cols-[55px_10px_1fr] text-[14px] leading-[24px]">
                    <span className=" font-[600]">CIN</span><span>:</span><span className=" text-[12px] font-[500]">{invoice.legal.cin}</span>
                    <span className=" font-[600]">FSSI</span><span>:</span><span className=" text-[12px] font-[500]">{invoice.legal.fssi}</span>
                    <span className=" font-[600]">GSTIN</span><span>:</span><span className=" text-[12px] font-[500]">{invoice.legal.gstin}</span>
                    <span className=" font-[600]">PAN</span><span>:</span><span className=" text-[12px] font-[500]">{invoice.legal.pan}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
  @media print {
    @page {
      size: A4;
      margin: 5mm;
    }

    html,
    body {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body * {
      visibility: hidden !important;
    }

    #invoice-print-area,
    #invoice-print-area * {
      visibility: visible !important;
    }

    #invoice-print-area {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }

    .invoice-paper {
      width: 200mm !important;
      min-height: auto !important;
      margin: 0 auto !important;
      padding: 0 !important;
      background: white !important;
      color: black !important;
      box-shadow: none !important;
    }

    .no-print {
      display: none !important;
      visibility: hidden !important;
    }

    table,
    tr,
    td,
    th {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    img,
    svg {
      visibility: visible !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

  }

  @media (max-width: 768px) {
  .invoice-paper {
    transform: scale(0.9);
    transform-origin: top left;
    width: 794px;
  }
}
`}</style>
    </div>
  );
}