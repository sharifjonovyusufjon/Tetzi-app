console.log("Comments");

$(function () {
  $(".comment-delete").on("click", function (e) {
    const id = e.target.id;

    axios
      .get(`/admin/comment/remove/${id}`)
      .then((response) => {
        const result = response.data;
        if (result.comment) {
          console.log("Comment status updated!");
          $(e.target).closest("tr").remove();
        } else {
          alert("Comment status update failed!");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Comment status update failed!");
      });
  });
});
