(function () {

  const isDashboard = window.location.pathname.includes("dash.php");
  const isManageCustomers = window.location.pathname.includes("manage_customers.php");

  function cleanPhone(phone) {
    return phone.replace(/\D/g, "");
  }

  function addButtons() {
    const rows = document.querySelectorAll("table tbody tr");

    rows.forEach(row => {
      if (row.dataset.waAdded) return;
      row.dataset.waAdded = "true";

      const tds = row.querySelectorAll("td");
      if (tds.length < 5) return;

      const name = tds[2]?.innerText.trim();
      const phone = tds[3]?.innerText.trim();
      const date = tds[1]?.innerText.trim(); // date column is consistent

      if (!phone || phone.length < 10) return;

      let message = "";
      let label = "WhatsApp";

      /* -----------------------------
         1️⃣ REGULAR WORKOUT REMINDER
      --------------------------------*/
      if (isManageCustomers) {
        message =
`Dear ${name},
Rise and Shine, Be regular for your workout.
From AbhiFit Health Club`;

        label = "Regular Reminder";
      }

      /* -----------------------------
         DASHBOARD LOGIC
      --------------------------------*/
      if (isDashboard) {

        const amountCell = tds[5]; // payment table has amount here
        const amount = amountCell?.innerText?.includes(".")
          ? amountCell.innerText.trim()
          : null;

        /* 2️⃣ PAYMENT REMINDER */
        if (amount) {
          message =
`Dear ${name},
You have an outstanding amount of Rs ${amount} to be paid by ${date}.
Kind Regards,
AbhiFit Health Club`;

          label = "Payment Reminder";
        }

        /* 3️⃣ MEMBERSHIP RENEWAL */
        else {
          message =
`Dear ${name},
Your Membership Renewal Date is ${date}.
Please Renew Your Membership.
From AbhiFit Health Club`;

          label = "Renewal Reminder";
        }
      }

      if (!message) return;

      const btn = document.createElement("button");
      btn.innerText = label;
      btn.style.background = "#25D366";
      btn.style.color = "#fff";
      btn.style.border = "none";
      btn.style.padding = "6px 10px";
      btn.style.borderRadius = "6px";
      btn.style.cursor = "pointer";
      btn.style.marginLeft = "6px";
      btn.style.fontSize = "12px";

      btn.onclick = () => {
        const url = `https://wa.me/91${cleanPhone(phone)}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
      };

      // Action column (last column)
      tds[tds.length - 1].appendChild(btn);
    });
  }

  addButtons();
  setInterval(addButtons, 3000); // handles AJAX reloads safely

})();
