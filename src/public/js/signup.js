console.log("signup");
$(function () {
  const fileTarget = $("#file-in");
  let filename;

  fileTarget.on("change", function () {
    if (window.FileReader) {
      const uploadFile = $(this)[0].files[0];
      const uploads = $(this)[0];
      console.log("this: ", uploads);
      console.log(uploadFile);
      const fileType = uploadFile["type"];
      const validImageType = ["image/jpg", "image/jpeg", "image/png"];
      if (!validImageType.includes(fileType)) {
        alert("Please insert jpg, jpeg and png!");
      } else {
        if (uploadFile) {
          console.log(URL.createObjectURL(uploadFile));
          $(".upload-img")
            .attr("src", URL.createObjectURL(uploadFile))
            .addClass("succsess!");
        }
        filename = $(this)[0].files[0].name;
      }
      $(this).siblings(".upload-name").val(filename);
    }
  });
});

function validateSignupForm() {
  const memberFirstName = $(".member-first-name").val(),
    memberLastName = $(".member-last-name").val(),
    memberEmail = $(".member-email").val(),
    memberPhone = $(".member-phone").val(),
    memebrAddress1 = $(".member-address1").val(),
    memberAddress2 = $(".member-address2").val(),
    memberCity = $(".member-city").val(),
    memberPostCode = $(".member-post").val(),
    memberPassword = $(".member-password").val(),
    confirmPassword = $(".member-confirm-password").val();

  if (
    memberFirstName === "" ||
    memberLastName === "" ||
    memberEmail === "" ||
    memberPhone === "" ||
    memebrAddress1 === "" ||
    memberAddress2 === "" ||
    memberCity === "" ||
    memberPostCode === "" ||
    memberPassword === "" ||
    confirmPassword === ""
  ) {
    alert("Please insert all required inputs!");
    return false;
  }

  if (memberPassword !== confirmPassword) {
    alert("Password differs, plese check!");
    return false;
  }

  const memberImage = $(".member-image").get(0).files[0].name
    ? $(".member-image").get(0).files[0].name
    : null;

  console.log("memberImage", memberImage);
  if (!memberImage) {
    alert("Please insert restaurant image!");
    return false;
  }
}
