import {
  keyLocalStorageListSP,
  keyLocalStorageItemCart,
  isEmptyArray,
} from "./constant.js";
import { handleLocalStorage, calculateTotal } from "./iife.js";

export const calculateTotalCartPrice = () => {
  let listItem = getlistItemCartById();

  const totalPrice = calculateTotal.total(listItem, "price", "quantityCart");
  const totalCartPrice = new Map([["totalPrice", totalPrice]]);

  return totalCartPrice;
};

let listShoes = handleLocalStorage.getListItem(keyLocalStorageListSP);
export const getlistItemCartById = () => {
  let arrCart = handleLocalStorage.getListItem(keyLocalStorageItemCart);
  let listItemCart = [];
  if (!isEmptyArray(arrCart)) {
    arrCart.map((cartItem) => {
      let shoe = listShoes.find((shoeItem) => shoeItem.id === cartItem.id);
      if (shoe) {
        let itemCart = {
          ...cartItem,
          ...shoe,
        };
        listItemCart.push(itemCart);
      }
    });

    getCartNotice();
  }

  return listItemCart;
};

export const getCartNotice = () => {
  const cartNotice = document.querySelector(".cart-notice");
  const arrCart = handleLocalStorage.getListItem(keyLocalStorageItemCart);
  const cartLength = calculateTotal.total(arrCart, "quantityCart");
  cartNotice.innerHTML = `<span>${cartLength}</span>`;
};
