import { calculateTotalCartPrice, getlistItemCartById } from "./cart.js";
import {
  keyLocalStorageItemCart,
  keyLocalStorageListSP,
  API,
} from "./constant.js";
import { handleLocalStorage, handleApi } from "./iife.js";

$(function () {
  const lastName = $("#lastName");
  const firstName = $("#firstName");
  const email = $("#email");
  const phone = $("#phone");
  const province = $("#province");
  const district = $("#district");
  const ward = $("#ward");
  const house = $("#house");
  const note = $("#note");

  const btnConfirm = $("#confirm");
  btnConfirm.click(function () {
    if (isValidateForm()) {
      addNewBill();
    }
  });

  $(".text-field").on("input", function () {
    isValidateForm($(this).attr("id"));
  });

  const isValidateForm = (id) => {
    if (isEmptyValue()) {
      setErrorMessage(id);
      return false;
    }
    $(".status").each(function () {
      removeErrorMessage($(this));
    });
    return true;
  };

  const isEmptyValue = () => {
    if (
      !lastName.val() ||
      !firstName.val() ||
      !email.val() ||
      !phone.val() ||
      !province.val() ||
      !district.val() ||
      !ward.val()
    ) {
      return true;
    }
    return false;
  };

  const setErrorMessage = (id) => {
    const lastNameStatus = $("#lastName-status");
    const firstNameStatus = $("#firstName-status");
    const emailStatus = $("#email-status");
    const phoneStatus = $("#phone-status");
    const provinceStatus = $("#province-status");
    const districtStatus = $("#district-status");
    const wardStatus = $("#ward-status");

    if (!id || id === lastName.attr("id")) {
      setNameErrorMessage(lastName, lastNameStatus, "Vui lòng nhập họ");
    }
    if (!id || id === firstName.attr("id")) {
      setNameErrorMessage(firstName, firstNameStatus, "Vui lòng nhập tên");
    }
    if (!id || id === email.attr("id")) {
      setEmailErrorMessage(emailStatus);
    }
    if (!id || id === phone.attr("id")) {
      setPhoneErrorMessage(phoneStatus);
    }
    if (!id || id === province.attr("id")) {
      setAddressErrorMessage(province, provinceStatus, "Vui lòng chọn tỉnh");
    }
    if (!id || id === district.attr("id")) {
      setAddressErrorMessage(
        district,
        districtStatus,
        "Vui lòng chọn quận (huyện)"
      );
    }
    if (!id || id === ward.attr("id")) {
      setAddressErrorMessage(ward, wardStatus, "Vui lòng chọn phường (xã)");
    }
  };

  const setNameErrorMessage = (nameType, statusType, errMessage) => {
    if (!nameType.val()) {
      statusType.show().text(errMessage);
      // statusType.text(errMessage);
    } else {
      removeErrorMessage(statusType);
    }
  };

  const setPhoneErrorMessage = (statusType) => {
    let firstDigitStr = String(phone.val())[0];
    if (!phone.val()) {
      statusType.show().text("Vui lòng nhập số điện thoại");
    } else if (phone.val().length !== 10 || Number(firstDigitStr) !== 0) {
      statusType.show().text("Vui lòng nhập số điện thoại hợp lệ");
    } else {
      removeErrorMessage(statusType);
    }
  };

  const setEmailErrorMessage = (statusType) => {
    let validRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (!email.val()) {
      statusType.show().text("Vui lòng nhập email");
    } else if (!email.val().match(validRegex)) {
      statusType.show().text("Vui lòng nhập email hợp lệ");
    } else {
      removeErrorMessage(statusType);
    }
  };

  const setAddressErrorMessage = (addressType, statusType, errMessage) => {
    console.log(addressType.val());
    if (!addressType.val()) {
      statusType.show().text(errMessage);
    } else {
      removeErrorMessage(statusType);
    }
  };

  const removeErrorMessage = (statusType) => {
    statusType.hide();
  };

  const addNewBill = () => {
    let listItemCart = getlistItemCartById();
    let totalCartPrice = calculateTotalCartPrice();
    let billDetail = {
      id: randomId(),
      lastName: lastName.val(),
      firstName: firstName.val(),
      email: email.val(),
      phone: phone.val(),
      provinceId: province.val(),
      provinceName: province.find("option:selected").text(),
      districtId: district.val(),
      districtName: district.find("option:selected").text(),
      wardId: ward.val(),
      wardName: ward.find("option:selected").text(),
      apartmentNumber: house.val(),
      note: note.val(),
      purchaseDate: new Date().toLocaleDateString("en-GB"),
      products: [...listItemCart],
      totalCartPrice: totalCartPrice.get("totalPrice"),
    };

    handleApi
      .addNewItem(API.BILL, billDetail)
      .then((response) => {
        if (response.status !== 201) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        let listShoes = handleLocalStorage.getListItem(keyLocalStorageListSP);
        listItemCart.map((cartItem) => {
          listShoes.map((shoeItem) => {
            if (cartItem.id === shoeItem.id) {
              shoeItem.quantityStock =
                cartItem.quantityStock - cartItem.quantityCart;
              handleLocalStorage.setListItem(keyLocalStorageListSP, listShoes);
            }
          });
        });
        localStorage.removeItem(keyLocalStorageItemCart);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const randomId = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  };
});
