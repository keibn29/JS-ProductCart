import { getlistItemCartById, calculateTotalCartPrice } from "./cart.js";
import { addShoeToCart } from "./home.js";
import {
  keyLocalStorageItemCart,
  ATTRIBUTE_METHOD,
  isEmptyArray,
} from "./constant.js";
import { handleLocalStorage } from "./iife.js";

$(function () {
  const listContentCart = $("#list-content-cart");
  const totalPrice = $("#total-price");
  const btnBuy = $(".btn-buy");
  const cartNotice = $(".cart-notice");

  let listItemCart = getlistItemCartById();
  if (!isEmptyArray(listItemCart)) {
    let htmlContent = `
      <div class="content title">
        <div class="shoe-name">Shoe Name</div>
        <div class="quantity">Quantity</div>
        <div class="subtotal">Subtotal</div>
        <div class="total">Total</div>
        <div class="action">Clear Cart</div>
      </div>
    `;
    listItemCart.map((cartItem) => {
      htmlContent += `
        <div class="content" contentid="${cartItem.id}">
          <div class="shoe-name">
            <div 
              class="shoe-name-left" 
              style="background-image: url(${cartItem.img})"
            >
            </div>
            <div class="shoe-name-right">
              <div class="right-up">${cartItem.name}</div>
              <div class="right-down">Quantity: ${cartItem.quantityStock}</div>
            </div>
          </div>
          <div class="quantity quantity-item">
            <button 
              class="minus" 
              onclick="reduceQuantityCart(${cartItem.id}, ${cartItem.price})"
            >
              <span>-</span>
            </button>
            <span class="quantity-value" qtycartid="${cartItem.id}">
              ${cartItem.quantityCart}
            </span>
            <button 
              class="plus" 
              onclick="increaseQuantityCart(${cartItem.id}, ${cartItem.price})"
            >
              +
            </button>
          </div>
          <div class="subtotal">
            ${Number(cartItem.price).toLocaleString()}<sup>đ</sup>
          </div>
          <div class="total" totalid="${cartItem.id}">
            ${Number(
              cartItem.price * cartItem.quantityCart
            ).toLocaleString()}<sup>đ</sup>
          </div>
          <div class="action">
            <i 
              class="far fa-times-circle" 
              onclick="removeCartItem(${cartItem.id})"
              data-toggle="modal" 
              data-target="#confirmDeleteCartModal"
            >
            </i>
          </div>
        </div>
      `;
      listContentCart.html(htmlContent);
    });
  }

  window.increaseQuantityCart = (shoeId, shoePrice) => {
    addShoeToCart(shoeId);

    let arrCart = handleLocalStorage.getListItem(keyLocalStorageItemCart);
    let cartItem = arrCart.find((item) => item.id === shoeId);
    $(`[qtycartid='${shoeId}']`).html(`${cartItem.quantityCart}`);
    $(`[totalid='${shoeId}']`).html(
      `${Number(
        shoePrice * cartItem.quantityCart
      ).toLocaleString()}<sup>đ</sup>`
    );

    loadTotalCartPrice();
  };

  window.reduceQuantityCart = (shoeId, shoePrice) => {
    let arrCart = handleLocalStorage.getListItem(keyLocalStorageItemCart);
    let cartItem = arrCart.find((item) => item.id === shoeId);
    if (cartItem) {
      const quantityCartUpdated = handleReduceQuantityOfCartItem(
        cartItem.quantityCart,
        shoeId,
        shoePrice
      );
      cartItem.quantityCart = quantityCartUpdated;
      handleLocalStorage.setListItem(keyLocalStorageItemCart, arrCart);
    }

    loadTotalCartPrice();
  };

  const handleReduceQuantityOfCartItem = (quantityCart, shoeId, shoePrice) => {
    const listBtnMinus = $(".minus");
    if (quantityCart === 1) {
      handleAttributes(listBtnMinus, ATTRIBUTE_METHOD.SET);
      removeCart(shoeId);
      return quantityCart;
    }

    handleAttributes(listBtnMinus, ATTRIBUTE_METHOD.REMOVE);
    quantityCart -= 1;
    $(`[qtycartid='${shoeId}']`).html(`${quantityCart}`);
    $(`[totalid='${shoeId}']`).html(
      `${Number(shoePrice * quantityCart).toLocaleString()}<sup>đ</sup>`
    );
    return quantityCart;
  };

  const handleAttributes = (list, method) => {
    if (method === ATTRIBUTE_METHOD.SET) {
      list.each(function () {
        $(this).attr("data-toggle", "modal");
        $(this).attr("data-target", "#confirmDeleteCartModal");
      });
    } else {
      list.each(function () {
        $(this).removeAttr("data-toggle");
        $(this).removeAttr("data-target");
      });
    }
  };

  window.removeCartItem = (shoeId) => {
    removeCart(shoeId);
  };

  const removeCart = (shoeId) => {
    const btnConfirm = $("#confirmDeleteCart");
    btnConfirm.click(function () {
      let arrCart = handleLocalStorage.getListItem(keyLocalStorageItemCart);
      let cartItem = arrCart.find((item) => item.id === shoeId);
      let index = arrCart.indexOf(cartItem);
      if (index > -1) {
        arrCart.splice(index, 1);
        const cartContent = $(`[contentid='${shoeId}']`);
        cartContent.remove();

        handleLocalStorage.setListItem(keyLocalStorageItemCart, arrCart);
        handleShowEmptyCartImg();
      }
      loadTotalCartPrice();
    });
  };

  const handleShowEmptyCartImg = () => {
    let arrCart = handleLocalStorage.getListItem(keyLocalStorageItemCart);
    if (!arrCart || arrCart.length === 0) {
      listContentCart.html(`<div class="cart-empty-image"></div>`);
      cartNotice.html(`<span>0</span>`);
      totalPrice.css({ display: "none" });
      btnBuy.css({ display: "none" });
    }
  };

  const loadTotalCartPrice = () => {
    let totalCartPrice = calculateTotalCartPrice();
    totalPrice.html(`
    Total Price:
      <span>
        ${Number(totalCartPrice.get("totalPrice")).toLocaleString()}<sup>đ</sup>
      </span>
    `);
  };

  loadTotalCartPrice();
  handleShowEmptyCartImg();
});
