const form = document.getElementById("form");
const lista = document.getElementById("lista");

function valideaza(date) {
  const erori = {};
  if (date.nume.length < 2) erori.nume = "Numele trebuie să aibă minim 2 caractere";
  if (date.prenume.length < 2) erori.prenume = "Prenumele trebuie să aibă minim 2 caractere";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(date.email)) erori.email = "Email invalid";
  if (!/^07\d{8}$/.test(date.telefon)) erori.telefon = "Telefon invalid (ex: 07xxxxxxxx)";
  return erori;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const date = {
    nume: document.getElementById("nume").value.trim(),
    prenume: document.getElementById("prenume").value.trim(),
    email: document.getElementById("email").value.trim(),
    telefon: document.getElementById("telefon").value.trim(),
  };

  const erori = valideaza(date);
  for (const camp of ["nume", "prenume", "email", "telefon"]) {
    document.getElementById("err-" + camp).textContent = erori[camp] || "";
    document.getElementById(camp).classList.toggle("invalid", !!erori[camp]);
  }
  if (Object.keys(erori).length > 0) return;

  const li = document.createElement("li");
  li.textContent = `${date.nume} ${date.prenume} – ${date.email} – ${date.telefon}`;
  lista.appendChild(li);
  form.reset();
});