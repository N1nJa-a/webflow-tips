//Declare the data variable globally
let data = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://n8n.epyc.in/webhook/genai-test")
    .then((response) => response.json())
    .then((responseData) => {
      // Save the data globally
      data = responseData;
      // Call a function to display the data
      populateCardLayout(data);

      populateLandscapeLayout(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

// View toggle
document.addEventListener("DOMContentLoaded", () => {
  // const filterWrapper = document.getElementById("filter-wrapper");
  const landscapeLayout = document.getElementById("landscape-layout");
  const cardLayout = document.getElementById("card-layout");
  const cardDiv = document.getElementById("card");
  const landscapeDiv = document.getElementById("landscape");

  cardLayout.setAttribute("fs-cmsfilter-element", "list");

  landscapeLayout.style.display = "none";

  // Click the cardDiv on page load
  cardDiv.dispatchEvent(new Event("click"));

  // Add click event listener to the card div
  cardDiv.addEventListener("click", () => {
    // filterWrapper.style.display = "flex";
    cardLayout.style.display = "flex";
    landscapeLayout.style.display = "none";
    cardDiv.classList.add("is-active");
    landscapeDiv.classList.remove("is-active");
  });

  // Add click event listener to the landscape div
  landscapeDiv.addEventListener("click", () => {
    // filterWrapper.style.display = "none";
    cardLayout.style.display = "none";
    landscapeLayout.style.display = "flex";
    landscapeDiv.classList.add("is-active");
    cardDiv.classList.remove("is-active");
  });
});

//Card data code
function populateCardLayout(data) {
  // Group companies by category

  const groupedData = {};
  data.forEach((company) => {
    const category = company.Category;
    if (!groupedData[category]) {
      groupedData[category] = [];
    }
    groupedData[category].push(company);
  });

  // Get the wrapper element for all cards
  const companyCardsWrapper = document.querySelector(".genai-card_wrapper");

  // Loop through each category and create a container for the cards
  Object.keys(groupedData).forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("genai-card_category-wrapper");

    // Add category heading and divider
    const categoryHeadingWrapper = document.createElement("div");
    categoryHeadingWrapper.classList.add("genai-card_category-heading-wrapper");

    const categoryHeadingContainer = document.createElement("div");
    categoryHeadingContainer.classList.add(
      "genai-card_category-heading-container"
    );

    const categoryHeadingTag = document.createElement("div");
    categoryHeadingTag.classList.add("genai-card_category-heading-tag");
    categoryHeadingTag.textContent = category;
    categoryHeadingTag.setAttribute("fs-cmsfilter-field", "category");

    categoryHeadingContainer.appendChild(categoryHeadingTag);
    categoryHeadingWrapper.appendChild(categoryHeadingContainer);

    const divider = document.createElement("div");
    divider.classList.add("divider", "black");
    categoryHeadingWrapper.appendChild(divider);

    categoryContainer.appendChild(categoryHeadingWrapper);

    // Sort companies within the category alphabetically
    const sortedCompanies = groupedData[category].sort((a, b) =>
      a.Name.localeCompare(b.Name)
    );

    // Add cards for the category
    const _3ColLayout = document.createElement("div");
    _3ColLayout.classList.add("_3-col-layout", "genai-card_layout");
    // _3ColLayout.setAttribute("fs-cmsfilter-element", "list");

    sortedCompanies.forEach((company) => {
      const cardTemplate = `
        <div class="genai-card" data-company='${JSON.stringify(company)}'>
          <div>
            <div class="genai-card_company-logo-name-wrapper">
            <div class="genai-card_company-logo-container">
              ${
                company.Favicon
                  ? `<img src="${company.Favicon}" loading="lazy" alt="" class="genai-card_company-logo" />`
                  : ""
              }
            </div>
            ${
              company.Name
                ? `<h3 class="genai-p-l-company-name" fs-cmsfilter-field="name">${company.Name}</h3>`
                : ""
            }
          </div>
          <div class="text-container padding-horizontal padding-xsmall">
            ${
              company["Brief Description"]
                ? `<div class="genai-company-description" fs-cmsfilter-field="description">${company["Brief Description"]}</div>`
                : ""
            }
          </div>
        </div>
        <div class="genai-card_category-container">
          ${
            company["Sub-category"]
              ? `<div class="genai-card_category-tag" fs-cmsfilter-field="tag">${company["Sub-category"]}</div>`
              : ""
          }
          ${
            company.Modality
              ? `<div class="genai-card_category-tag yellow-tag" fs-cmsfilter-field="modality">${company.Modality}</div>`
              : ""
          }
        </div>
        </div>
      `;

      _3ColLayout.innerHTML += cardTemplate;
    });

    categoryContainer.appendChild(_3ColLayout);

    // Add the category container to the main wrapper
    companyCardsWrapper.appendChild(categoryContainer);
  });

  // Add click event listener to each card in card layout
  const cardElements = document.querySelectorAll(".genai-card");
  cardElements.forEach((card) => {
    card.addEventListener("click", () => {
      const companyData = JSON.parse(card.dataset.company);
      // console.log("card clicked");
      openPopup(companyData);
      // console.log("popup opened");
    });
  });
}

// Landscape data code
function populateLandscapeLayout(data) {
  // Group companies by category and sub-category
  const groupedData = {};
  data.forEach((company) => {
    const category = company.Category;
    const subCategory = company["Sub-category"];

    if (!groupedData[category]) {
      groupedData[category] = {};
    }

    if (!groupedData[category][subCategory]) {
      groupedData[category][subCategory] = [];
    }

    groupedData[category][subCategory].push(company);
  });

  // Get the wrapper element for landscape layout
  const landscapeWrapper = document.getElementById("landscape-layout");

  // Loop through each category and create a container for sub-categories and companies
  Object.keys(groupedData).forEach((category) => {
    const categoryHeadingWrapper = document.createElement("div");
    categoryHeadingWrapper.classList.add(
      "genai-landscape_category-heading-wrapper"
    );

    const categoryHeading = document.createElement("div");
    categoryHeading.classList.add("genai-landscape_category-heading");
    categoryHeading.textContent = category;

    const categoryLayout = document.createElement("div");
    categoryLayout.classList.add("genai-landscape_category-layout");

    // Loop through each sub-category in the current category
    Object.keys(groupedData[category]).forEach((subCategory) => {
      const subCategoryWrapper = document.createElement("div");
      subCategoryWrapper.classList.add("genai-landscape_category-wrapper");

      const subCategoryTag = document.createElement("div");
      subCategoryTag.classList.add("genai-landscape_category");
      subCategoryTag.textContent = subCategory;

      const layoutWrapper = document.createElement("div");
      layoutWrapper.classList.add("genai-landscape_layout");

      // Sort companies within the sub-category alphabetically
      const sortedCompanies = groupedData[category][subCategory].sort((a, b) =>
        a.Name.localeCompare(b.Name)
      );

      // Loop through each company in the current sub-category
      sortedCompanies.forEach((company) => {
        const cardElement = createCardElement(
          company.Favicon,
          company.Name,
          company
        );
        layoutWrapper.appendChild(cardElement);
      });

      subCategoryWrapper.appendChild(subCategoryTag);
      subCategoryWrapper.appendChild(layoutWrapper);

      categoryLayout.appendChild(subCategoryWrapper);
    });

    categoryHeadingWrapper.appendChild(categoryHeading);
    categoryHeadingWrapper.appendChild(categoryLayout);

    landscapeWrapper.appendChild(categoryHeadingWrapper);
  });
}

// New Function to create a single card element
function createCardElement(favicon, companyName, companyData) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("genai-landscape_company-logo-name-wrapper");

  const companyLogoContainer = document.createElement("div");
  companyLogoContainer.classList.add("genai-landscape_company-logo-container");

  const companyLogo = document.createElement("img");
  companyLogo.src = favicon;
  companyLogo.alt = "Company Logo";
  companyLogo.classList.add("genai-card_company-logo");

  const companyNameElement = document.createElement("h3");
  companyNameElement.classList.add("genai-p-l-company-name");
  companyNameElement.textContent = companyName;

  companyLogoContainer.appendChild(companyLogo);
  cardElement.appendChild(companyLogoContainer);
  cardElement.appendChild(companyNameElement);

  cardElement.addEventListener("click", () => {
    openPopup(companyData);
  });

  return cardElement;
}

// Function to open the popup with company details
function openPopup(companyData) {
  // console.log("Popup opened");
  const popupWrapper = document.querySelector(".genai-popup_wrapper");
  popupWrapper.style.display = "flex";
  popupWrapper.style.opacity = "1";
  // Get the popup container and individual elements
  // const popupContainer = document.querySelector(".genai-popup_container");
  const companyIcon = document.getElementById("company-icon");
  const companyNameElement = document.getElementById("company-name");
  const companyBriefDescription = document.getElementById(
    "company-brief-description"
  );
  const foundingYear = document.getElementById("founding-year");
  const stage = document.getElementById("stage");
  const employee = document.getElementById("employee");
  const companyModality = document.getElementById("company-modality");
  const location = document.getElementById("location");
  const investor = document.getElementById("investor");
  const companyDescription = document.getElementById("company-description");
  const companyCategory = document.getElementById("company-category");
  const companyTag = document.getElementById("company-tag");
  const companyWebsite = document.getElementById("company-website");
  const companyLinkedIn = document.getElementById("company-linkedin");
  const founder1 = document.getElementById("founder-1");
  const founderName1 = document.getElementById("founder-name-1");
  const founderLinkedIn1 = document.getElementById("founder-linkedin-1");
  const founder2 = document.getElementById("founder-2");
  const founderName2 = document.getElementById("founder-name-2");
  const founderLinkedIn2 = document.getElementById("founder-linkedin-2");
  const founder3 = document.getElementById("founder-3");
  const founderName3 = document.getElementById("founder-name-3");
  const founderLinkedIn3 = document.getElementById("founder-linkedin-3");
  const founder4 = document.getElementById("founder-4");
  const founderName4 = document.getElementById("founder-name-4");
  const founderLinkedIn4 = document.getElementById("founder-linkedin-4");

  // console.log(companyData);

  // Populate the popup with company data
  companyIcon.src = companyData.Favicon;
  companyNameElement.textContent = companyData.Name;
  companyBriefDescription.textContent = companyData["Brief Description"];
  foundingYear.textContent = companyData["Founding Year"];
  stage.textContent = companyData.Stage;
  employee.textContent = companyData["Employee Count Category"];
  companyModality.textContent = companyData.Modality;
  location.textContent = companyData.HQ;
  investor.textContent = companyData["Key Investors"];
  companyDescription.textContent = companyData["Detailed Description"];
  companyCategory.textContent = companyData.Category;
  companyTag.textContent = companyData["Sub-category"];
  const httpsUrl =
    companyData["Website Link"].startsWith("http://") ||
    companyData["Website Link"].startsWith("https://")
      ? companyData["Website Link"]
      : "https://" + companyData["Website Link"];
  companyWebsite.href = httpsUrl;
  companyLinkedIn.href = companyData["LinkedIn Profile"];

  if (companyData["Founders Name 1"] !== "") {
    founder1.style.display = "flex";
    founderName1.textContent = companyData["Founders Name 1"];
    founderLinkedIn1.href = companyData["Founder 1 Linkedin"];
  }
  if (companyData["Founders Name 2"] !== "") {
    founder2.style.display = "flex";
    founderName2.textContent = companyData["Founders Name 2"];
    founderLinkedIn2.href = companyData["Founder 2 Linkedin"];
  }
  if (companyData["Founders Name 3"] !== "") {
    founder3.style.display = "flex";
    founderName3.textContent = companyData["Founders Name 3"];
    founderLinkedIn3.href = companyData["Founder 3 Linkedin"];
  }
  if (companyData["Founders Name 4"] !== "") {
    founder4.style.display = "flex";
    founderName4.textContent = companyData["Founders Name 4"];
    founderLinkedIn4.href = companyData["Founder 4 Linkedin"];
  }
}

// console.log("Code run successfully");
