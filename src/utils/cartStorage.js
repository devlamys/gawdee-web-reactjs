/* Developed by Grafizen International PVT. LTD. */
const GUEST_SESSION_KEY = "guestSessionId";

const getGuestSessionId = () => {
  if (typeof window === "undefined") return "server";

  let guestSessionId = sessionStorage.getItem(GUEST_SESSION_KEY);

  if (!guestSessionId) {
    guestSessionId = `guest-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

    sessionStorage.setItem(GUEST_SESSION_KEY, guestSessionId);
  }

  return guestSessionId;
};

const getGuestCartKey = () => {
  return `guestCart_${getGuestSessionId()}`;
};

const dispatchGuestCartUpdate = (items) => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("guest-cart-updated", {
      detail: {
        _id: "guest-cart",
        items,
      },
    })
  );
};

export const getGuestCart = () => {
  try {
    if (typeof window === "undefined") return [];

    const cart = localStorage.getItem(getGuestCartKey());
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Get guest cart error:", error);
    return [];
  }
};

export const saveGuestCart = (items) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(getGuestCartKey(), JSON.stringify(items));
  dispatchGuestCartUpdate(items);
};

export const clearGuestCart = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(getGuestCartKey());

  dispatchGuestCartUpdate([]);
};

const makeGuestCartItemKey = (item) => {
  return `${item.productId}-${item.selectedColor || "default"}`;
};

export const addItemToGuestCart = (newItem) => {
  const oldItems = getGuestCart();

  const newItemKey = makeGuestCartItemKey(newItem);

  const existingIndex = oldItems.findIndex(
    (item) => makeGuestCartItemKey(item) === newItemKey
  );

  if (existingIndex !== -1) {
    const oldQty = Number(
      oldItems[existingIndex].quantity || oldItems[existingIndex].qty || 1
    );

    const addQty = Number(newItem.quantity || newItem.qty || 1);

    oldItems[existingIndex].quantity = oldQty + addQty;
    oldItems[existingIndex].qty = oldQty + addQty;
  } else {
    oldItems.push({
      ...newItem,
      cartItemId: newItemKey,
    });
  }

  saveGuestCart(oldItems);

  return {
    _id: "guest-cart",
    items: oldItems,
  };
};

export const updateGuestCartQty = (targetItem, newQty) => {
  const oldItems = getGuestCart();

  const updatedItems = oldItems.map((item) => {
    const isSameItem =
      makeGuestCartItemKey(item) === makeGuestCartItemKey(targetItem);

    return isSameItem
      ? {
          ...item,
          quantity: newQty,
          qty: newQty,
        }
      : item;
  });

  saveGuestCart(updatedItems);

  return {
    _id: "guest-cart",
    items: updatedItems,
  };
};

export const removeItemFromGuestCart = (targetItem) => {
  const oldItems = getGuestCart();

  const updatedItems = oldItems.filter(
    (item) => makeGuestCartItemKey(item) !== makeGuestCartItemKey(targetItem)
  );

  saveGuestCart(updatedItems);

  return {
    _id: "guest-cart",
    items: updatedItems,
  };
};