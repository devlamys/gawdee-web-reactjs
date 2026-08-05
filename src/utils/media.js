/* Developed by Grafizen International PVT. LTD. */
export const getMediaUrl = (media, size = "thumb") => {
  if (!media) return "";

  if (typeof media === "string") return media;

  if (Array.isArray(media)) {
    return getMediaUrl(media[0], size);
  }

  const thumbUrl =
    media.thumb ||
    media.thumbnail ||
    media.small ||
    media.cover ||
    media.poster;

  const mediumUrl =
    media.medium ||
    media.mediumUrl ||
    media.optimized ||
    thumbUrl;

  const largeUrl =
    media.large ||
    media.original ||
    media.url ||
    media.image ||
    media.path ||
    media.src ||
    mediumUrl ||
    thumbUrl;

  if (size === "thumb") return thumbUrl || mediumUrl || largeUrl || "";
  if (size === "medium") return mediumUrl || thumbUrl || largeUrl || "";
  if (size === "large") return largeUrl || mediumUrl || thumbUrl || "";

  return thumbUrl || mediumUrl || largeUrl || "";
};

export const getProductThumb = (product) => {
  return (
    getMediaUrl(product?.thumbnail, "thumb") ||
    getMediaUrl(product?.featuredImage, "thumb") ||
    getMediaUrl(product?.image1, "thumb") ||
    getMediaUrl(product?.image, "thumb") ||
    getMediaUrl(product?.images?.[0], "thumb") ||
    ""
  );
};

export const getProductMedium = (product) => {
  return (
    getMediaUrl(product?.mediumImage, "medium") ||
    getMediaUrl(product?.featuredImage, "medium") ||
    getMediaUrl(product?.image1, "medium") ||
    getMediaUrl(product?.image, "medium") ||
    getMediaUrl(product?.images?.[0], "medium") ||
    getProductThumb(product)
  );
};