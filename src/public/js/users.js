console.log("Users");

$(function () {
  $(".member-status").on("change", function (e) {
    const id = e.target.id;
    console.log(id);
    const memberStatus = $(`#${id}.member-status`).val();

    axios
      .post(`/admin/member/update`, {
        _id: id,
        memberStatus: memberStatus,
      })
      .then((response) => {
        const result = response.data;
        if (result.member) {
          console.log("Member status updated!");
          $(".member-status").blur();
        } else {
          alert("Member status update failed!");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Member status update failed!");
      });
  });
});
