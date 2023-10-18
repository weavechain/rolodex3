import { hashes_backend } from "../../declarations/hashes_backend";

document.getElementById("f_store").addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = e.target.querySelector("button");

  const id = document.getElementById("id").value.toString();
  const hash = document.getElementById("hash").value.toString();
  button.setAttribute("disabled", true);
  try {
    const res = await hashes_backend.store(id, hash);
    console.log(res)

    document.getElementById("reply").value = res;
  } catch (e) {
    document.getElementById("reply").value = e.toString();
  }

  button.removeAttribute("disabled");

  return false;
});

document.getElementById("f_read").addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = e.target.querySelector("button");

  button.setAttribute("disabled", true);
  try {
    const res = await hashes_backend.readHashes();
    console.log(res)

    document.getElementById("hashes").innerText = JSON.stringify(res);
  } catch (e) {
    document.getElementById("hashes").innerText = e.toString();
  }

  button.removeAttribute("disabled");

  return false;
});
