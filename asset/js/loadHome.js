import { keyLocalStorageListSP, isEmptyArray } from "./constant.js";
import { handleLocalStorage } from "./iife.js";
import { addShoeToCart } from "./home.js";

$(function () {
  let listShoes = handleLocalStorage.getListItem(keyLocalStorageListSP);
  const listContentHome = $("#list-content-home");
  let htmlContent = "";
  if (!isEmptyArray(listShoes)) {
    listShoes.map((shoeItem) => {
      htmlContent += `
        <div class="content">
          <div
            class="content-top"
            style="background-image: url(${shoeItem.img})">
          </div>
          <div class="content-bottom">
            <div class="content-bottom-up">${shoeItem.name}</div>
            <div class="content-bottom-down">
              <div class="shoe-text">
                <div class="shoe-price">
                  ${Number(shoeItem.price).toLocaleString()}<sup>đ</sup>
                </div>
                <div class="shoe-quantity">Quantity: ${
                  shoeItem.quantityStock
                }</div>
              </div>
              <div class="shoe-button">
                <button onclick="addToCart(${shoeItem.id})">Add to cart</button>
              </div>
            </div>
          </div>
        </div>
      `;
      listContentHome.html(htmlContent);
    });
  }

  window.addToCart = (shoeId) => {
    addShoeToCart(shoeId);
  };
});
