(function () {

  const path = window.location.pathname;
  const isDashboard = path.includes("dash.php");
  const isManageCustomers = path.includes("manage_customers.php");

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

      const name  = tds[2]?.innerText.trim();
      const phone = tds[3]?.innerText.trim();
      const date  = tds[1]?.innerText.trim();

      if (!phone || cleanPhone(phone).length < 10) return;

      let message = "";
      let label   = "WhatsApp";

      /* 1️⃣ REGULAR WORKOUT REMINDER */
      if (isManageCustomers) {
        message =
`Dear ${name},
Rise and Shine, Be regular for your workout. From AbhiFit Health Club`;

        label = "Regular Reminder";
      }

      /* DASHBOARD LOGIC */
      if (isDashboard) {

        const amountCell = tds[5];
        const amount = amountCell?.innerText.replace(/[^\d]/g, "");

        /* 2️⃣ PAYMENT REMINDER */
        if (amount) {
          message =
`Dear ${name},
You have an outstanding amount of Rs ${amount}
Please pay before ${date}.
Kind Regards,
AbhiFit Health Club`;

          label = "Payment Reminder";
        }

        /* 3️⃣ MEMBERSHIP RENEWAL */
        else {
          message =
`Dear ${name},
Your Membership Renewal Date is ${date}.
Please renew your membership.
From AbhiFit Health Club`;

          label = "Renewal Reminder";
        }
      }

      if (!message) return;

      const btn = document.createElement("button");
      btn.innerText = label;
      btn.style.cssText = `
        background:#25D366;
        color:#fff;
        border:none;
        padding:6px 10px;
        border-radius:6px;
        cursor:pointer;
        margin-left:6px;
        font-size:12px;
      `;

      btn.onclick = () => {
        const url = `https://wa.me/91${cleanPhone(phone)}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
      };

      tds[tds.length - 1].appendChild(btn);
    });
  }

  addButtons();
  setInterval(addButtons, 3000);

})();
