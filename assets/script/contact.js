(function () {
  emailjs.init("YOUR_PUBLIC_KEY"); 
})();

document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();

  emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", this)
    .then(() => {
      alert("Gửi thành công! Chúng tôi sẽ phản hồi sớm nhất ");
      this.reset();
    }, (error) => {
      console.error(error);
      alert("Gửi thất bại, thử lại sau hoặc gọi số hotline nha!");
    });
});
