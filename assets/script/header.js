    // When the page is scrolled, the header should become sticky
    window.onscroll = function() {
        makeHeaderSticky();
    };

    // Get the header element
    const header = document.getElementById("navbar");

    // Get the offset position of the header
    const sticky = header.offsetTop;

    function makeHeaderSticky() {
        if (window.pageYOffset > sticky) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    }