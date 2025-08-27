(() => {
  "use strict";

  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// index.ejs toggling script show gst or not

let taxSwitch = document.getElementById("flexSwitchCheckDefault");
taxSwitch.addEventListener("click", () => {
  let taxInfo = document.getElementsByClassName("tax-info");
  for (info of taxInfo) {
    if (info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
});

const filterLogo = document.getElementById("filter-logo");
const filterOverlay = document.getElementById("filter-overlay");
const closeBtn = document.querySelector("#filter-overlay .close-btn");

let overlayVisible = false;

// Function to handle logo visibility based on screen size
function updateFilterLogoVisibility() {
  if (window.innerWidth > 1024) {
    filterLogo.style.display = "none";  // Hide logo on desktop
    filterOverlay.style.display = "none"; // Ensure overlay is hidden on desktop
  } else if (!overlayVisible) {
    filterLogo.style.display = "block"; // Show logo on mobile when overlay is closed
  }
}

// Open overlay when clicking filter logo
filterLogo.addEventListener("click", () => {
  overlayVisible = true;
  filterOverlay.style.display = "flex";
  filterLogo.style.display = "none"; // Hide logo when overlay is open
});

// Close overlay when clicking close button
closeBtn.addEventListener("click", () => {
  overlayVisible = false;
  filterOverlay.style.display = "none";
  updateFilterLogoVisibility(); // Re-check visibility based on screen size
});

// Close overlay when clicking outside (background click)
filterOverlay.addEventListener("click", (e) => {
  if (e.target === filterOverlay) {
    overlayVisible = false;
    filterOverlay.style.display = "none";
    updateFilterLogoVisibility(); // Re-check visibility based on screen size
  }
});

// Listen for window resize (desktop <-> mobile switching)
window.addEventListener("resize", updateFilterLogoVisibility);

// Initial check on page load
updateFilterLogoVisibility();




