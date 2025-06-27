import { createClient } from "https://esm.sh/@supabase/supabase-js";

// 🔐 Conexión Supabase
const supabase = createClient(
  "https://hyyzyagxlqgkiwodnmgg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5eXp5YWd4bHFna2l3b2RubWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4ODM3ODYsImV4cCI6MjA2NjQ1OTc4Nn0.sDzc98mBTNgkPGt8ahAEZKRU7fY9z9KhOeSAMx693FE"
);

window.supabase = supabase; // Hacer supabase accesible desde consola

// 📦 Elementos DOM
const listaMayoristas = document.getElementById("listaMayoristas");
const listaOtros = document.getElementById("listaOtros");
const formulario = document.getElementById("formulario");
const mensaje = document.getElementById("mensaje");

// 🔄 Obtener proveedores
async function obtenerProveedores() {
  const { data, error } = await supabase
    .from("proveedores")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) throw error;
  return data;
}

// ➕ Insertar proveedor
async function agregarProveedor(proveedor) {
  const { error } = await supabase.from("proveedores").insert([proveedor]);
  if (error) throw error;
}

// ✏️ Actualizar proveedor
async function actualizarProveedor(id, proveedor) {
  const { error } = await supabase.from("proveedores").update(proveedor).eq("id", id);
  if (error) throw error;
}

// 🗑 Eliminar proveedor (con logs)
async function eliminarProveedor(id) {
  console.log("🧨 ID a eliminar:", id);
  const { error } = await supabase.from("proveedores").delete().eq("id", id);
  if (error) {
    console.error("❌ Error al eliminar proveedor:", error);
    throw error;
  } else {
    console.log("✅ Proveedor eliminado con éxito:", id);
  }
}

// 🧼 Limpiar formulario
function limpiarFormulario() {
  formulario.reset();
  document.getElementById("proveedorId").value = "";
  document.getElementById("formTitulo").textContent = "➕ Agregar proveedor";
  document.getElementById("btnSubmit").textContent = "Agregar proveedor";
}

// 🖼️ Renderizar tarjeta
function renderCard(p) {
  const esMayorista = p.tipo?.toLowerCase() === "mayorista";
  const div = document.createElement("div");
  div.className = "card " + (esMayorista ? "" : "otro");

  const enlaceHTML = p.enlace
    ? `<a href="${p.enlace}" target="_blank">${p.enlace}</a>`
    : "-";

  let contenido = `
    <strong>${p.nombre || "-"}</strong>
    <small style="color:gray; font-size:0.75rem;">🆔 ${p.id}</small>
  `;

  contenido += esMayorista
    ? `
      <span>👤 Usuario: ${p.usuario || "-"}</span>
      <span>🔑 Clave: ${p.clave || "-"}</span>
      <span>🔗 Enlace: ${enlaceHTML}</span>
    `
    : `
      <span>🆔 RUT: ${p.rut || "-"}</span>
      <span>🧩 Área: ${p.area || "-"}</span>
      <span>🔗 Enlace: ${enlaceHTML}</span>
      <span>👤 Contacto: ${p.contacto || "-"}</span>
      <span>📞 Teléfono: ${p.telefono || "-"}</span>
      <span>✉️ Correo: ${p.correo || "-"}</span>
      <span>📍 Dirección: ${p.direccion || "-"}</span>
      <span>🗒️ Observación: ${p.observacion || "-"}</span>
    `;

  div.innerHTML = contenido;

  const botones = document.createElement("div");
  botones.className = "card-buttons";

  const editBtn = document.createElement("button");
  editBtn.textContent = "🖊 Editar";
  editBtn.className = "editar";
  editBtn.onclick = () => {
    document.getElementById("proveedorId").value = p.id;
    document.getElementById("rut").value = p.rut || "";
    document.getElementById("nombre").value = p.nombre || "";
    document.getElementById("tipo").value = p.tipo || "";
    document.getElementById("area").value = p.area || "";
    document.getElementById("contacto").value = p.contacto || "";
    document.getElementById("telefono").value = p.telefono || "";
    document.getElementById("correo").value = p.correo || "";
    document.getElementById("usuario").value = p.usuario || "";
    document.getElementById("clave").value = p.clave || "";
    document.getElementById("enlace").value = p.enlace || "";
    document.getElementById("direccion").value = p.direccion || "";
    document.getElementById("observacion").value = p.observacion || "";
    document.getElementById("formTitulo").textContent = "✏️ Editar proveedor";
    document.getElementById("btnSubmit").textContent = "Actualizar proveedor";
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑 Eliminar";
  deleteBtn.className = "eliminar";
  deleteBtn.onclick = async () => {
  console.log("🗑 Click en eliminar → ID:", p.id);

  if (confirm(`¿Eliminar a "${p.nombre}"?`)) {
    try {
      console.log("🔄 Llamando a eliminarProveedor...");
      await eliminarProveedor(p.id);
      console.log("✅ Llamada exitosa, refrescando lista...");
      await cargarProveedores();
    } catch (err) {
      console.error("❌ Error durante eliminación:", err);
      alert("❌ No se pudo eliminar. Revisa la consola para más detalles.");
    }
  } else {
    console.log("🚫 Cancelado por el usuario");
  }
};

  botones.append(editBtn, deleteBtn);
  div.appendChild(botones);
  return div;
}

// 🔄 Cargar proveedores
async function cargarProveedores() {
  try {
    const proveedores = await obtenerProveedores();
    const mayoristas = proveedores.filter(p => p.tipo?.toLowerCase() === "mayorista");
    const otros = proveedores.filter(p => p.tipo?.toLowerCase() !== "mayorista");

    listaMayoristas.innerHTML = "";
    listaOtros.innerHTML = "";

    mayoristas.forEach(p => listaMayoristas.appendChild(renderCard(p)));
    otros.forEach(p => listaOtros.appendChild(renderCard(p)));
  } catch (err) {
    console.error("❌ Error cargando datos:", err);
    listaMayoristas.innerHTML = "<p style='color:red'>Error al cargar mayoristas.</p>";
    listaOtros.innerHTML = "<p style='color:red'>Error al cargar otros proveedores.</p>";
  }
}

// 📝 Envío del formulario
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const proveedor = {
    rut: document.getElementById("rut").value,
    nombre: document.getElementById("nombre").value,
    tipo: document.getElementById("tipo").value,
    area: document.getElementById("area").value,
    contacto: document.getElementById("contacto").value,
    telefono: document.getElementById("telefono").value,
    correo: document.getElementById("correo").value,
    usuario: document.getElementById("usuario").value,
    clave: document.getElementById("clave").value,
    enlace: document.getElementById("enlace").value,
    direccion: document.getElementById("direccion").value,
    observacion: document.getElementById("observacion").value
  };

  const id = document.getElementById("proveedorId").value;

  try {
    if (id) {
      await actualizarProveedor(id, proveedor);
      mensaje.textContent = "✅ Proveedor actualizado.";
    } else {
      await agregarProveedor(proveedor);
      mensaje.textContent = "✅ Proveedor agregado.";
    }

    mensaje.style.color = "green";
    limpiarFormulario();
    cargarProveedores();
  } catch (err) {
    console.error("❌ Error guardando proveedor:", err);
    mensaje.textContent = "❌ Error al guardar.";
    mensaje.style.color = "red";
  }

  setTimeout(() => (mensaje.textContent = ""), 3000);
});

// 🚀 Inicialización
document.addEventListener("DOMContentLoaded", cargarProveedores);