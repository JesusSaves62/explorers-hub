async function startCheckout({ priceId, mode = "payment", quantity = 1, metadata = {} }) {
  const res = await fetch("/.netlify/functions/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId, mode, quantity, metadata })
  });
  if (!res.ok) {
    alert("Sorry, checkout couldn’t start. Please try again.");
    return;
  }
  const data = await res.json();
  window.location.href = data.url;
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-checkout]");
  if (!btn) return;
  const priceId = btn.getAttribute("data-price");
  const mode = btn.getAttribute("data-mode") || "payment";
  const qty = parseInt(btn.getAttribute("data-qty") || "1", 10);
  const meta = btn.getAttribute("data-meta");
  let metadata = {};
  try { if (meta) metadata = JSON.parse(meta); } catch(e){}
  e.preventDefault();
  startCheckout({ priceId, mode, quantity: qty, metadata });
});
