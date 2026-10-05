const formCarti = document.getElementById("form-carti");
const statusEl = document.getElementById("status");
const rezultate = document.getElementById("rezultate");

formCarti.addEventListener("submit", async (e) => {
  e.preventDefault();
  const titlu = document.getElementById("titlu").value.trim();
  if (!titlu) {
    statusEl.textContent = "Scrie un titlu.";
    statusEl.className = "eroare";
    return;
  }

  rezultate.innerHTML = "";
  statusEl.textContent = "Se încarcă...";
  statusEl.className = "";

  try {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(titlu)}&limit=10`;
    const raspuns = await fetch(url);
    if (!raspuns.ok) throw new Error("Eroare server: " + raspuns.status);

    const date = await raspuns.json();
    if (date.docs.length === 0) {
      statusEl.textContent = "Nu s-a găsit nicio carte.";
      return;
    }

    statusEl.textContent = `${date.numFound} rezultate (afișez primele 10)`;
    for (const carte of date.docs) {
      const li = document.createElement("li");
      const autor = carte.author_name ? carte.author_name.join(", ") : "autor necunoscut";
      const an = carte.first_publish_year || "?";
      li.textContent = `${carte.title} – ${autor} (${an})`;
      rezultate.appendChild(li);
    }
  } catch (err) {
    statusEl.textContent = "Nu s-a putut face căutarea. Verifică conexiunea.";
    statusEl.className = "eroare";
    console.error(err);
  }
});