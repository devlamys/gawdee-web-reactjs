/* Developed by Grafizen International PVT. LTD. */
import React from "react";

import ArtBoard1 from "../../../public/imges/productDetails/A1Content/Artboard1.jpg";
import ArtBoard2 from "../../../public/imges/productDetails/A1Content/Artboard2.jpg";
import ArtBoard3 from "../../../public/imges/productDetails/A1Content/Artboard3.jpg";
import ArtBoard4 from "../../../public/imges/productDetails/A1Content/Artboard4.jpg";
import ArtBoard5 from "../../../public/imges/productDetails/A1Content/Artboard5.jpg";
import ArtBoard6 from "../../../public/imges/productDetails/A1Content/Artboard6.jpg";

const artBoards = [
  ArtBoard1,
  ArtBoard2,
  ArtBoard3,
  ArtBoard4,
  ArtBoard5,
  ArtBoard6,
];

export default function AoneContent({ product }) {
  const backendArtBoards = product?.aPlusContent?.images || [];

  const finalArtBoards =
    backendArtBoards.length > 0
      ? backendArtBoards
          .map((item) => {
            if (typeof item === "string") return item;
            return item?.image || item?.url || "";
          })
          .filter(Boolean)
      : artBoards;

  return (
    <div className="lg:w-full w-[92%] max-w-7xl mx-auto lg:pt-[100px] pt-[20px] lg:pb-[30px] space-y-4 lg:space-y-6">

      {finalArtBoards[0] && (
        <div className="w-full overflow-hidden rounded-[12px] bg-white">
          <img
            src={finalArtBoards[0]}
            alt="A1 Content Artboard 1"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {(finalArtBoards[1] || finalArtBoards[2]) && (
        <div className="grid grid-cols-1  md77:grid-cols-2 md11:grid-cols-2 gap-4 lg:gap-6">
          {finalArtBoards.slice(1, 3).map((image, index) => (
            <div
              key={index}
              className=" overflow-hidden md11:h-[400px] md11:w-[630px] rounded-[12px] bg-white"
            >
              <img
                src={image}
                alt={`A1 Content Artboard ${index + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {finalArtBoards[3] && (
        <div className="w-full overflow-hidden rounded-[12px] bg-white">
          <img
            src={finalArtBoards[3]}
            alt="A1 Content Artboard 4"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {(finalArtBoards[4] || finalArtBoards[5]) && (
        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          {finalArtBoards.slice(4, 6).map((image, index) => (
            <div
              key={index}
              className="w-full overflow-hidden   rounded-[12px] bg-white"
            >
              <img
                src={image}
                alt={`A1 Content Artboard ${index + 5}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      )}

      {finalArtBoards.length > 6 && (
        <div className="grid grid-cols-1  md:grid-cols-2 gap-4 lg:gap-6">
          {finalArtBoards.slice(6).map((image, index) => (
            <div
              key={index}
              className="w-full overflow-hidden rounded-[12px] bg-white"
            >
              <img
                src={image}
                alt={`A1 Content Artboard ${index + 7}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}