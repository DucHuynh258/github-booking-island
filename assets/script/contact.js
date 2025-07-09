document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      name: form.from_name.value,
      email: form.from_email.value,
      phone: form.phone.value,
      message: form.message.value
    };

  console.log(formData);
    //Kiểm tra dữ liệu 
    
    fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        form.reset();
      })
      .catch(err => {
        console.error(err);
        alert("Lỗi gửi liên hệ, thử lại sau nhé!");
      });
  });
});
