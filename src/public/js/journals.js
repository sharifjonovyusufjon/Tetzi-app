console.log("Journals");

$(function () {
  $(".journal-status").on("change", function (e) {
    const id = e.target.id;
    console.log(id);
    const journalStatus = $(`#${id}.journal-status`).val();

    axios
      .post(`/admin/journal/update/${id}`, {
        journalStatus: journalStatus,
      })
      .then((response) => {
        const result = response.data;
        if (result.journal) {
          console.log("Journal status updated!");
          $(".journal-status").blur();
        } else {
          alert("Journal status update failed!");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Journal status update failed!");
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

  const fileTarget = $("#file");
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
          $(".one")
            .attr("src", URL.createObjectURL(uploadFile))
            .addClass("succsess!");
        }
        filename = $(this)[0].files[0].name;
      }
      $(this).siblings(".one").val(filename);
    }
  });
});

function validateJournalForm() {
  const journalTitle = $(".journal-title").val(),
    journalContext = $(".journal-category").val(),
    journalCategory = $(".journal-desc").val();

  if (journalTitle === "" || journalContext === "" || journalCategory === "") {
    alert("Please insert all required inputs!");
    return false;
  }

  const journalImage = $(".image-one").get(0).files[0].name
    ? $(".image-one").get(0).files[0].name
    : null;

  console.log("journalImage", journalImage);
  if (!memberImage) {
    alert("Please insert journal image!");
    return false;
  }
}
