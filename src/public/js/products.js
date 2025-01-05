console.log("Products");

$(function () {
  $(".product-status").on("change", function (e) {
    const id = e.target.id;
    console.log(id);
    const productStatus = $(`#${id}.product-status`).val();

    axios
      .post(`/admin/product/update/${id}`, {
        productStatus: productStatus,
      })
      .then((response) => {
        const result = response.data;
        if (result.product) {
          console.log("Product status updated!");
          $(".product-status").blur();
        } else {
          alert("Product status update failed!");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Product status update failed!");
      });
  });

  $(".new-button").on("click", () => {
    $(".product-container").slideToggle(500);
    $(".new-button").css("display", "none");
  });

  $(".cancel-button").on("click", () => {
    $(".product-container").slideToggle(100);
    $(".new-button").css("display", "flex");
  });
});
