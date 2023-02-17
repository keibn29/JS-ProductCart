import { keyLocalStorageListSP, API, isEmptyArray } from "./constant.js";
import { handleLocalStorage, handleApi, calculateTotal } from "./iife.js";
import { getCartNotice } from "./cart.js";

$(async function () {
  const billFooter = $("#bill-footer");
  const listContentBill = $("#list-content-bill");
  let listBills = await handleApi.getAllData(API.BILL);
  if (!isEmptyArray(listBills)) {
    billFooter.show();
    let htmlContent = `
      <div
        class="content title"
        id="content-bill-title"
        style="display: flex"
      >
        <div class="code">Code</div>
        <div class="name">Customer Name</div>
        <div class="date">Purchase Date</div>
        <div class="number">Product Numbers</div>
        <div class="total-quantity">Total Quantity</div>
        <div class="total-price">Total Price</div>
        <div class="return">Return</div>
      </div>
    `;
    listBills.map((item) => {
      let totalQuantity = calculateTotal.total(item.products, "quantityCart");
      htmlContent += `
        <div class="content">
          <div class="code">
            ${item.id}
            <div 
              class="detail"
              onclick="handleShowDetailBill('${item.id}', 
                '${encodeURIComponent(JSON.stringify(item.products))}')"
            >
              Details
              <i class="fas fa-caret-down"></i>
            </div>
          </div>
          <div class="name">${item.lastName} ${item.firstName}</div>
          <div class="date">${item.purchaseDate}</div>
          <div class="number">${item.products.length}</div>
          <div class="total-quantity">${totalQuantity}</div>
          <div class="total-price">
            ${Number(item.totalCartPrice).toLocaleString()}<sup>đ</sup>
          </div>
          <div class="return">
            <i
              class="far fa-times-circle" 
              onclick="returnBillItem('${item.id}', 
                '${encodeURIComponent(JSON.stringify(item.products))}')"
              data-toggle="modal" 
              data-target="#confirmReturnBillModal"
            ></i>
          </div>
          <div 
            class="list-products" 
            billid="${item.id}"
            style="display: none"
          ></div>
        </div>
      `;
      listContentBill.html(htmlContent);
    });
  } else {
    billFooter.show();
    listContentBill.html(`
      <div class="bill-empty-image"></div>
    `);
  }

  window.handleShowDetailBill = (billId, obj) => {
    const billDetail = $(`[billid='${billId}']`);
    const listProducts = JSON.parse(decodeURIComponent(obj));
    let htmlContent = `
      <div class="product-item title">
        <div class="shoe-name">Product Name</div>
        <div class="quantity">Quantity</div>
        <div class="subtotal">Price</div>
        <div class="total">Total Price</div>
      </div>
    `;

    listProducts.map((item) => {
      htmlContent += `
          <div class="product-item">
            <div class="shoe-name">
              <div
              class="shoe-name-left"
              style="background-image: url(${item.img})"
              >
              </div>
              <div class="shoe-name-right">${item.name}</div>
            </div>
            <div class="quantity">${item.quantityCart}</div>
            <div class="subtotal">
              ${Number(item.price).toLocaleString()}<sup>đ</sup>
            </div>
            <div class="total">
              ${Number(
                item.price * item.quantityCart
              ).toLocaleString()}<sup>đ</sup>
            </div>
          </div>
        `;
      billDetail.html(htmlContent);
    });
    billDetail.toggle();
  };

  window.returnBillItem = (billId, obj) => {
    const listProducts = JSON.parse(decodeURIComponent(obj));
    const btnConfirm = $("#confirmReturnBill");
    btnConfirm.click(function () {
      deleteBillById(billId, listProducts);
    });
  };

  const deleteBillById = (billId, listProducts) => {
    handleApi
      .deleteItemById(`${API.BILL}/${billId}`)
      .then((response) => {
        if (response.status !== 200) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        let listShoes = handleLocalStorage.getListItem(keyLocalStorageListSP);
        listProducts.map((productItem) => {
          listShoes.map((shoeItem) => {
            if (productItem.id === shoeItem.id) {
              shoeItem.quantityStock =
                shoeItem.quantityStock + productItem.quantityCart;
              handleLocalStorage.setListItem(keyLocalStorageListSP, listShoes);
            }
          });
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  getCartNotice();
});
