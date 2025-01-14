document.addEventListener("DOMContentLoaded", () => {
  const cartTable = document.querySelector(".cartTable");

  //   Currency Formatter for Indian Rupees
  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });

  // Show loader before fetching data
  function showLoader() {
    document.getElementById("loader").style.display = "flex";
  }

  // Hide loader after data is fetched
  function hideLoader() {
    document.getElementById("loader").style.display = "none";
  }

  // Fetch cart data from server
  async function fetchCartData() {
    showLoader();
    try {
      const response = await fetch(
        "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"
      );
      const data = await response.json();
      populateCart(data.items);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      hideLoader();
    }
  }

  // Populate cart with fetched data
  function populateCart(cartItems) {
    cartItems.forEach((item) => {
      const cartItemHTML = `
                <div class="cartItem" data-id="${item.id}">
                    <div class="productInfo">
                        <img src="${item.image}" alt="${item.name}">
                        <span class="productSpecs">${item.title}</span>
                    </div>
                    <span class="productSpecs productPrice">${currencyFormatter.format(
                      item.price
                    )}</span>
                    <input type="number" class="quantity" value="1" min="1">
                    <span class="subtotal">${currencyFormatter.format(
                      item.price * item.quantity
                    )}</span>
                    <button class="delete-btn"><img src="/Images/removeIcon.png" width="30px" height="30px"></button>
                </div>
            `;
      cartTable.insertAdjacentHTML("beforeend", cartItemHTML);
    });
    updateCartTotal();
  }

  // Update subtotal and total when quantity changes
  cartTable.addEventListener("input", (e) => {
    if (e.target.classList.contains("quantity")) {
      const cartItem = e.target.closest(".cartItem");
      const quantity = parseInt(e.target.value, 10) || 1;
      const priceElement = cartItem.querySelector(".productPrice");
      const price = extractNumber(priceElement.textContent.trim());
      console.log(price);
      console.log(quantity);

      const newSubtotal = price * quantity;
      cartItem.querySelector(".subtotal").textContent =
        currencyFormatter.format(newSubtotal);
      updateCartTotal();
    }
  });

  // Remove item from cart
  cartTable.addEventListener("click", (e) => {
    if (e.target.closest(".delete-btn")) {
      const cartItem = e.target.closest(".cartItem");
      cartItem.remove();

      updateCartTotal();
    }
  });

  // Calculate and update the total cart value
  function updateCartTotal() {
    let total = 0;

    const cartItems = document.querySelectorAll(".cartItem");
    cartItems.forEach((item) => {
      const itemSubtotal = extractNumber(
        item.querySelector(".subtotal").textContent
      );
      total += itemSubtotal;
    });
    const subtotalElement = document.querySelectorAll(".cartTotalsTotal");

    subtotalElement.forEach((el) => {
      el.textContent = currencyFormatter.format(total); // Both will show the same value
    });
  }

  // Utility function to extract numeric values from strings

  function extractNumber(value) {
    // Remove non-numeric characters except `.` and `-`
    const cleanedValue = value.replace(/[^0-9.-]/g, "").replace(/,/g, "");
    return Number(cleanedValue) || 0;
  }

  // Initialize cart
  fetchCartData();
});
