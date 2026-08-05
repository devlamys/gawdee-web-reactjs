/* Developed by Grafizen International PVT. LTD. */
import React, { Suspense, lazy, useMemo } from "react";
import "../src/App.css";
import { Route, Routes, useLocation } from "react-router-dom";

import ScrollToTop from "./component/Scrooltop";
import { Meta } from "./component/seo/Meta";

import Home from "./pages/home/Home";
import AllOrdersPage from "./pages/productpage/AllOrdersPage";
import GawdeePopup from "./component/popupMain/GawdeePopup";

const ProductmainPage = lazy(() => import("./pages/productpage/ProductmainPage"));
const ProductDetails = lazy(() => import("./pages/productDetails/ProductDetails"));
const ContactUs = lazy(() => import("./pages/contactUsPage/ContactUs"));
const AboutUsPage = lazy(() => import("./pages/aboutus/AboutUsPage"));
const DesiGheeProduct = lazy(() =>
  import("./pages/categoriesProduct/DesiGheeProduct")
);
const OrderDetailsPage = lazy(() =>
  import("./pages/productpage/OrderDetailsPage")
);
const ReturnPage = lazy(() => import("./pages/conditionsPage/ReturnPage"));
const ReturnDetailsPage = lazy(() =>
  import("./pages/productpage/ReturnDetailsPage")
);
const CheckoutPage = lazy(() => import("./pages/productpage/CheckoutPage"));
const BlogDetailsPage = lazy(() => import("./pages/blogs/BlogDetailsPage"));
const BlogsPage = lazy(() => import("./pages/blogs/BlogsPage"));
const GawdeeForm = lazy(() => import("./pages/GawdeeForm"));
const OrdersPage = lazy(() => import("./pages/productpage/OrdersPage"));
const CancelOrderPage = lazy(() =>
  import("./pages/conditionsPage/CancelOrderPage")
);
const PdfViewPage = lazy(() => import("./pages/PdfViewPage"));
const ComboProductDetails = lazy(() =>
  import("./pages/combo/ComboProductDetails")
);
const CookiePolicyPage = lazy(() =>
  import("./pages/PolicyPage/CookiePolicyPage")
);
const PrivacyPolicyPage = lazy(() =>
  import("./pages/PolicyPage/PrivacyPolicyPage")
);
const TermsConditionsPage = lazy(() =>
  import("./pages/PolicyPage/TermsConditionsPage")
);

const InvoiceView = lazy(() =>
  import("./pages/conditionsPage/InvoiceView").then((module) => ({
    default: module.InvoiceView,
  }))
);

const pageLoader = (
  <div className="min-h-[100vh] w-full flex items-center justify-center bg-[#fbffff]">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-[#1f7a3f] rounded-full animate-spin" />
  </div>
);

const metaData = {
  "/about-us": {
    title: "About Gawdee | Our Story, Ethical Farming & Natural Wellness",
    description:
      "Discover the story behind Gawdee and our dedication to ethical farming, natural ingredients, sustainability, and delivering trusted products to every home.",
    keywords:
      "About Gawdee, Ethical Farming, Natural Products, Organic Lifestyle, Farm Fresh Products, Natural Wellness",
  },

  "/contact-us": {
    title: "Contact Gawdee | Get in Touch for Support & Inquiries",
    description:
      "Contact Gawdee for product inquiries, customer support, order assistance, partnerships, or general questions. We're here to help and assist you.",
    keywords:
      "Contact Gawdee, Gawdee Support, Customer Service, Order Assistance, Customer Inquiries",
  },

  "/blogs": {
    title: "Gawdee Blog | Natural Wellness, Healthy Living & Organic Insights",
    description:
      "Explore the Gawdee Blog for insights on natural wellness, ethical farming, healthy living, nutrition, organic foods, and sustainable lifestyle tips.",
    keywords:
      "Gawdee Blog, Natural Wellness, Healthy Living, Organic Foods, Ethical Farming",
  },

  "/all-products": {
    title: "Shop Organic Foods, A2 Gir Cow Ghee & Natural Products | Gawdee",
    description:
      "Explore Gawdee's complete collection of A2 Gir Cow Ghee, organic foods, natural sweeteners, wellness products, moringa powders, and farm-fresh essentials.",
    keywords:
      "Organic Foods, A2 Gir Cow Ghee, Natural Products, Farm Fresh Products, Wellness Products",
  },

  "/products/desi-ghee": {
    title:
      "A2 Gir Cow Ghee | Ethical Farming & Traditional Bilona Craftsmanship | Gawdee",
    description:
      "Crafted from the milk of ethically cared-for Gir cows and prepared using traditional Bilona methods, Gawdee A2 Ghee reflects purity, authenticity, and mindful farming.",
    keywords:
      "A2 Gir Cow Ghee, Bilona Ghee, Desi Cow Ghee, Natural Goodness, Gir Cow Products",
  },

  "/products/honey": {
    title: "Raw Forest Honey & Raw Ajwain Honey | Nature's Pure Sweetness | Gawdee",
    description:
      "Experience the richness of Raw Forest Honey and Raw Ajwain Honey, carefully sourced from nature and preserved in their purest form to deliver authentic flavor and natural goodness.",
    keywords:
      "Raw Forest Honey, Raw Ajwain Honey, Natural Honey, Pure Honey, Natural Sweetener",
  },

  "/products/drops": {
    title: "Taral Drops | Ayurvedic Wellness Rooted in Tradition | Gawdee",
    description:
      "Inspired by the wisdom of Ayurveda, Gawdee Taral Drops are thoughtfully crafted using traditional principles to support daily wellness and mindful living.",
    keywords:
      "Taral Drops, Ayurvedic Wellness, Natural Care, Daily Wellness, Gawdee Drops",
  },

  "/products/mix-me": {
    title: "Mix Me | Nourishing Family Nutrition in Every Sip | Gawdee",
    description:
      "Thoughtfully crafted for modern families, Mix Me combines nutrition and great taste in Coco, Vanilla, and Elaichi variants to support daily wellness and mindful living.",
    keywords:
      "Family Nutrition, Daily Wellness, Nutrition Powder, Healthy Family, Coco Mix Me, Vanilla Mix Me, Elaichi Mix Me",
  },

  "/cookie-policy": {
    title: "Gawdee Cookie Policy | Transparency in Data Usage & Cookies",
    description:
      "Learn how Gawdee uses cookies and similar technologies to improve website functionality, personalize your experience, and analyze traffic. Your privacy is important to us.",
    keywords:
      "Gawdee Cookie Policy, Cookies, Data Privacy, Website Tracking, User Experience",
  },

  "/privacy-policy": {
    title: "Gawdee Privacy Policy | Data Protection & Customer Security",
    description:
      "Gawdee values your privacy. Read how we collect, process, and protect information when using our website and services.",
    keywords:
      "Gawdee Privacy Policy, Data Protection, Personal Information, Customer Privacy, Organic Products",
  },

  "/terms-and-condition": {
    title: "Gawdee Terms & Conditions | User Agreement & Policies",
    description:
      "Read the full Terms & Conditions for Gawdee products and services. Understand your rights, obligations, and our policies while using our platform.",
    keywords:
      "Gawdee Terms and Conditions, User Agreement, Policies, Organic Products, Legal Information",
  },
};

const defaultMeta = {
  title: "Gawdee | Pure A2 Gir Cow Ghee, Organic Foods & Natural Farm Products",
  description:
    "Gawdee brings you pure, natural, and ethically sourced products including A2 Gir Cow Ghee, organic foods, natural sweeteners, and farm-fresh essentials.",
  keywords:
    "Gawdee, organic wellness, A2 Gir Cow Ghee, organic foods, natural sweeteners, farm-fresh essentials",
};

function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/917055107030?text=Hello%20Gawdee%2C%20I%20want%20to%20know%20more%20about%20your%20products."
      target="_blank"
      className="cursor-pointer"
      rel="noopener noreferrer"
      aria-label="Connect with Gawdee on WhatsApp"
    >
      <div
        className="
          fixed md:bottom-9 bottom-[95px] right-9 flex z-[7000]
          items-center rounded-full gap-3 bg-[#25D366]
          cursor-pointer shadow-lg hover:shadow-xl overflow-hidden
          w-[50px] hover:w-[240px] h-[50px]
          transition-all duration-300 ease-out
        "
      >
        <div className="flex-shrink-0 w-[50px] h-[50px] rounded-xl flex items-center justify-center">
          <i className="fa-brands text-white text-[30px] fa-whatsapp"></i>
        </div>

        <p className="text-white cursor-pointer font-medium whitespace-nowrap pr-4 text-[15px] font-Roboto">
          Connect on WhatsApp
        </p>
      </div>
    </a>
  );
}

function LazyRoutes() {
  return (
    <Suspense fallback={pageLoader}>

      <Routes>

        <Route path="/all-products" element={<ProductmainPage />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUsPage />} />

        <Route path="/products/:slug" element={<DesiGheeProduct />} />

        <Route path="/combo-product" element={<ComboProductDetails />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blog-details/:slug" element={<BlogDetailsPage />} />

        <Route path="/exhibitions" element={<GawdeeForm />} />

        <Route path="/my-orders" element={<OrdersPage />} />
        <Route path="/my-orders/order-details/:id" element={<OrderDetailsPage />} />
        <Route
          path="/my-orders/return-order-details"
          element={<ReturnDetailsPage />}
        />
        <Route
          path="/my-orders/order-details/return-request/:id"
          element={<ReturnPage />}
        />
        <Route path="/my-orders/invoice/:orderId" element={<InvoiceView />} />
        <Route path="/my-orders/cancel/:id" element={<CancelOrderPage />} />

        <Route path="/gawdee-organic-lab-test" element={<PdfViewPage />} />

        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-and-condition" element={<TermsConditionsPage />} />
        <Route path="/all-orders" element={<AllOrdersPage />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  const location = useLocation();

  const currentMeta = useMemo(() => {
    return metaData[location.pathname] || defaultMeta;
  }, [location.pathname]);

  return (
    <>
      <Meta
        title={currentMeta.title}
        description={currentMeta.description}
        keywords={currentMeta.keywords}
      />

      <ScrollToTop />
      <GawdeePopup />

      <div className="w-full font-Poppins ease-soft-spring h-full !bg-[#fbffff] duration-1000">
        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/*" element={<LazyRoutes />} />
        </Routes>

        <WhatsAppFloatingButton />
      </div>
    </>
  );
}

export default App;