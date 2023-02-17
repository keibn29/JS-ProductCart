import { handleApi } from "./iife.js";
import { API, isEmptyArray } from "./constant.js";

$(async function () {
  const getAllProvinces = () => {
    return handleApi.getAllData(API.PROVINCE).then((data) => {
      return data;
    });
  };

  const getDistrictsByProvinceID = async (provinceId) => {
    let listDistrictsByProvince = [];
    const listDistricts = await handleApi.getAllData(API.DISTRICT);
    if (!isEmptyArray(listDistricts)) {
      listDistrictsByProvince = listDistricts.filter(
        (item) => item.province_code === provinceId
      );
    }
    return listDistrictsByProvince;
  };

  const getWardsByDistrictsID = async (districtId) => {
    let listWardsByDistrict = [];
    const listWards = await handleApi.getAllData(API.WARD);
    if (!isEmptyArray(listWards)) {
      listWardsByDistrict = listWards.filter(
        (item) => item.district_code === districtId
      );
    }
    return listWardsByDistrict;
  };

  let provinceOptionHtmlDefault = `
    <option value="" disabled selected>
      Chọn tỉnh thành
    </option>
  `;
  let districtOptionHtmlDefault = `
  <option value="" disabled selected>
    Chọn quận (huyện)
  </option>
  `;
  let wardOptionHtmlDefault = `
  <option value="" disabled selected>
    Chọn phường (xã)
  </option>
  `;

  let province = $("#province");
  let listProvinces = await getAllProvinces();
  if (!isEmptyArray(listProvinces)) {
    let provinceOptionHtmlUpdated = provinceOptionHtmlDefault;
    listProvinces.map((item) => {
      provinceOptionHtmlUpdated += `
        <option value="${item.code}">${item.name}</option>
      `;
      province.html(provinceOptionHtmlUpdated);
    });
  }

  let district = $("#district");
  province.change(async function () {
    district.html(districtOptionHtmlDefault);
    ward.html(wardOptionHtmlDefault);

    const provinceId = Number(province.val());
    let listDistrictsByProvince = await getDistrictsByProvinceID(provinceId);
    if (!isEmptyArray(listDistrictsByProvince)) {
      let districtOptionHtmlUpdated = districtOptionHtmlDefault;
      listDistrictsByProvince.map((item) => {
        districtOptionHtmlUpdated += `
          <option value="${item.code}">${item.name}</option>
        `;
        district.html(districtOptionHtmlUpdated);
      });
    }
  });

  let ward = $("#ward");
  district.change(async function () {
    ward.html(wardOptionHtmlDefault);

    const districtId = Number(district.val());
    let listWardsByDistrict = await getWardsByDistrictsID(districtId);
    if (!isEmptyArray(listWardsByDistrict)) {
      let wardOptionHtmlUpdated = wardOptionHtmlDefault;
      listWardsByDistrict.map((item) => {
        wardOptionHtmlUpdated += `
          <option value="${item.code}">${item.name}</option>
        `;
        ward.html(wardOptionHtmlUpdated);
      });
    }
  });
});
