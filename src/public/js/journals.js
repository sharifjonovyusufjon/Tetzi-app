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
});
