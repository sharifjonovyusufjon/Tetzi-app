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

function validateProductForm() {
  const productName = $(".product-name").val(),
    productPrice = $(".product-price").val(),
    productCount = $(".product-count").val(),
    productDesc = $(".product-desc").val(),
    productBrand = $(".product-brand").val(),
    productCategory = $(".product-category").val(),
    productColor = $(".product-color").val(),
    productSize = $(".product-size").val();

  if (
    productName === "" ||
    productPrice === "" ||
    productCount === "" ||
    productDesc === "" ||
    productBrand === "" ||
    productColor === "" ||
    productSize === "" ||
    productCategory === ""
  ) {
    alert("Please insert all required detals!");
    return false;
  } else {
    return true;
  }
}

function previewFileHandler(input, order) {
  const imgClassName = input.className;
  console.log("imgClassName:", imgClassName);

  const file = $(`.${imgClassName}`).get(0).files[0];

  const fileType = file["type"];
  const validImageType = ["image/jpg", "image/jpeg", "image/png"];
  if (!validImageType.includes(fileType)) {
    alert("Please insert jpg, jpeg and png!");
  } else {
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        $(`#image-section-${order}`).attr("src", reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
}
