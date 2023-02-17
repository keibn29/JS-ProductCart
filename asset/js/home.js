import { keyLocalStorageItemCart, keyLocalStorageListSP } from "./constant.js";
import { handleLocalStorage } from "./iife.js";
import { calculateTotalCartPrice, getlistItemCartById } from "./cart.js";

export const addShoeToCart = (shoeId) => {
  let listShoes = handleLocalStorage.getListItem(keyLocalStorageListSP);
  let shoeItem = listShoes.find((shoeItem) => shoeItem.id === shoeId);

  let arrCart = handleLocalStorage.getListItem(keyLocalStorageItemCart);
  if (!arrCart) {
    arrCart = [];
  }

  let existItem = arrCart.find((cartItem) => cartItem.id === shoeId);
  if (!existItem) {
    arrCart = handleAddNewItemToCart(shoeItem.quantityStock, arrCart, shoeId);
  } else {
    const quantityCartUpdated = handleUpdateQuantityOfExistCartItem(
      existItem.quantityCart,
      shoeItem.quantityStock
    );
    existItem.quantityCart = quantityCartUpdated;
  }

  handleLocalStorage.setListItem(keyLocalStorageItemCart, arrCart);
  calculateTotalCartPrice();
};

const handleAddNewItemToCart = (quantityStock, arrCart, shoeId) => {
  if (quantityStock <= 0) {
    alert("Sản phẩm hiện không còn hàng, xin vui lòng chọn sản phẩm khác");
    return arrCart;
  }

  let newItem = new cart(shoeId, 1);
  arrCart.push(newItem);
  return arrCart;
};

function cart(id, quantityCart) {
  this.id = id;
  this.quantityCart = quantityCart;
}

const handleUpdateQuantityOfExistCartItem = (quantityCart, quantityStock) => {
  if (quantityCart >= quantityStock) {
    alert("Đơn hàng không thể vượt quá số lượng hàng có sẵn");
    return quantityCart;
  }
  return (quantityCart += 1);
};

getlistItemCartById();
