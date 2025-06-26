import { createClient } from "@supabase/supabase-js";

// ✅ Claves de tu proyecto Supabase
const supabaseUrl = "https://hyyzyagxlqgkiwodnmgg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5eXp5YWd4bHFna2l3b2RubWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4ODM3ODYsImV4cCI6MjA2NjQ1OTc4Nn0.sDzc98mBTNgkPGt8ahAEZKRU7fY9z9KhOeSAMx693FE"; // ← tu clave completa va aquí
export const supabase = createClient(supabaseUrl, supabaseKey);

// 🔍 Obtener proveedores
export async function obtenerProveedores() {
  const { data, error } = await supabase
    .from("proveedores")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("❌ Error desde Supabase (SELECT):", error);
    throw error;
  }

  return data;
}

// ➕ Agregar proveedor
export async function agregarProveedor(proveedor) {
  const { error } = await supabase.from("proveedores").insert([proveedor]);
  if (error) {
    console.error("❌ Error al insertar proveedor:", error);
    throw error;
  }
}

// ✏️ Actualizar proveedor
export async function actualizarProveedor(id, proveedor) {
  const { error } = await supabase
    .from("proveedores")
    .update(proveedor)
    .eq("id", id);
  if (error) {
    console.error("❌ Error al actualizar proveedor:", error);
    throw error;
  }
}

// 🗑 Eliminar proveedor
export async function eliminarProveedor(id) {
  const { error } = await supabase
    .from("proveedores")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("❌ Error al eliminar proveedor:", error);
    throw error;
  }
}