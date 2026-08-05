/* Developed by Grafizen International PVT. LTD. */
"use client";

import { ArrowLeft, Download } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import pdfview from "../../public/imges/Gawdee-organic.pdf"
export default function PdfViewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const pdfUrl = searchParams.get("url") || pdfview;

  return (
    <div className="min-h-screen bg-[#F6F8F4]">

      <div className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-[40px] items-center gap-2 rounded-[10px] border border-[#DDE7DA] bg-[#F8FBF6] px-4 text-[13px] font-semibold text-[#0c776b]"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <a
            href={pdfUrl}
            download
            className="inline-flex h-[40px] items-center gap-2 rounded-[10px] bg-[#0c776b] px-4 text-[13px] font-semibold text-white"
          >
            <Download size={16} />
            Download PDF
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] p-4">
        <div className="h-[calc(100vh-90px)] overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-sm">
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}