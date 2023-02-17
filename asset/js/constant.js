export const keyLocalStorageListSP = "DANHSACHSP";
export const keyLocalStorageItemCart = "DANHSACHITEMCART";

const API_ADDRESS = "https://provinces.open-api.vn/api";
const API_JSON_SERVER = "http://localhost:3000";
export const API = {
  PROVINCE: API_ADDRESS + "/p/",
  DISTRICT: API_ADDRESS + "/d/",
  WARD: API_ADDRESS + "/w/",
  BILL: API_JSON_SERVER + "/bills",
};

export const ATTRIBUTE_METHOD = {
  SET: "set",
  REMOVE: "remove",
};

export const isEmptyArray = (list) => {
  if (list && list.length > 0) {
    return false;
  }
  return true;
};
