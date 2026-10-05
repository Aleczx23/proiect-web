const form = document.getElementById("form");
const lista = document.getElementById("lista");
const CAMPURI = ["nume", "prenume", "email", "telefon"];

function valideaza(date) {
  const erori = {};
  if (date.nume.length < 2) erori.nume = "Numele trebuie să aibă minim 2 caractere";
  if (date.prenume.length < 2) erori.prenume = "Prenumele trebuie să aibă minim 2 caractere";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(date.email)) erori.email = "Email invalid";
  if (!/^07\d{8}$/.test(date.telefon)) erori.telefon = "Telefon invalid (ex: 07xxxxxxxx)";
  return erori;
}

async function incarcaContacte() {
  try {
    const res = await fetch("/api/contacte");
    const contacte = await res.json();
    lista.innerHTML = "";
    for (const c of contacte) {
      const li = document.createElement("li");
      li.textContent = `${c.nume} ${c.prenume} – ${c.email} – ${c.telefon} `;

      const btnEdit = document.createElement("button");
      btnEdit.textContent = "Editează";
      btnEdit.onclick = () => editeaza(c);

      const btnSterge = document.createElement("button");
      btnSterge.textContent = "Șterge";
      btnSterge.onclick = () => sterge(c.id);

      li.append(btnEdit, " ", btnSterge);
      lista.appendChild(li);
    }
  } catch (err) {
    lista.innerHTML = "<li>Nu s-au putut încărca contactele.</li>";
  }
}

async function editeaza(c) {
  const email = prompt("Email nou:", c.email);
  if (email === null) return;
  const res = await fetch(`/api/contacte/${c.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...c, email }),
  });
  if (!res.ok) alert("Eroare: " + JSON.stringify(await res.json()));
  incarcaContacte();
}

async function sterge(id) {
  if (!confirm("Ștergi contactul?")) return;
  await fetch(`/api/contacte/${id}`, { method: "DELETE" });
  incarcaContacte();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const date = {};
  for (const camp of CAMPURI) date[camp] = document.getElementById(camp).value.trim();

  const erori = valideaza(date);
  for (const camp of CAMPURI) {
    document.getElementById("err-" + camp).textContent = erori[camp] || "";
    document.getElementById(camp).classList.toggle("invalid", !!erori[camp]);
  }
  if (Object.keys(erori).length > 0) return;

  const res = await fetch("/api/contacte", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(date),
  });
  if (res.status === 201) {
    form.reset();
    incarcaContacte();
  } else {
    alert("Eroare de la server: " + JSON.stringify(await res.json()));
  }
});

incarcaContacte();