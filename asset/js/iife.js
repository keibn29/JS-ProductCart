export const handleLocalStorage = (function () {
  return {
    getListItem: function (keyItem) {
      return JSON.parse(localStorage.getItem(keyItem));
    },
    setListItem: function (keyItem, listItem) {
      localStorage.setItem(keyItem, JSON.stringify(listItem));
    },
  };
})();

export const handleApi = (function () {
  return {
    getAllData: function (url) {
      return fetch(url)
        .then((response) => {
          if (response.status !== 200) {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
          return response.json();
        })
        .catch((err) => {
          alert(err);
        });
    },
    addNewItem: function (url, data) {
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((response) => {
        return response;
      });
    },
    deleteItemById: function (url) {
      return fetch(url, {
        method: "DELETE",
      }).then((response) => {
        return response;
      });
    },
  };
})();

export const calculateTotal = (function () {
  let total;

  return {
    total: function (listItem, propertyName, quantity) {
      if (!listItem || listItem.length === 0) {
        return (total = 0);
      }
      if (quantity) {
        return (total = listItem.reduce((acc, curr) => {
          return acc + curr[`${propertyName}`] * curr[`${quantity}`];
        }, 0));
      }
      if (propertyName && !quantity) {
        return (total = listItem.reduce((acc, curr) => {
          return acc + curr[`${propertyName}`];
        }, 0));
      }
      if (!quantity && !propertyName) {
        return (total = listItem.reduce((acc, curr) => {
          return acc + curr;
        }, 0));
      }
    },
  };
})();
