import { createClient } from "https://esm.sh/@supabase/supabase-js";

// 🔐 Conexión Supabase
const supabase = createClient(
  "https://hyyzyagxlqgkiwodnmgg.supabase.co",
  "tu-clave-anónima-aquí"
);

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

// 🗑 Eliminar proveedor
async function eliminarProveedor(id) {
  const { error } = await supabase.from("proveedores").delete().eq("id", id);
  if (error) throw error;
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

  div.innerHTML = `
    <strong>${p.nombre || "-"}</strong>
    ${ esMayorista
        ? `
          <span>👤 Usuario: ${p.usuario || "-"}</span>
          <span>🔑 Clave: ${p.clave || "-"}</span>
          <span>🔗 Enlace: ${
            p.enlace ? `<a href="${p.enlace}" target="_blank">${p.enlace}</a>` : "-"
          }</span>
        `
        : `
          <span>🆔 RUT: ${p.rut || "-"}</span>
          <span>🧩 Área: ${p.area || "-"}</span>
          <span>🔗 Enlace: ${
            p.enlace