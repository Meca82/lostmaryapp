
// App completa para gestión de archivos Excel con secciones adicionales y carga de imágenes
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';

export default function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const allData = [];

      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        jsonData.forEach((row) => {
          allData.push({
            zona: row.Zona || "",
            semana: row.Semana || "",
            producto: row.Producto || "",
            cantidad: row.Cantidad || 0,
            canal: row.Canal || "",
            precio: row.Precio || 0,
          });
        });
      });

      setData(allData);
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const segundoCanal = data.filter((item) => item.canal.toLowerCase() === "segundo canal");
  const preciosBajos = data.filter((item) => parseFloat(item.precio) < 7);

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <header className="mb-10 text-center">
        <motion.h1
          className="text-4xl font-bold text-purple-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Panel de Gestión - Lost Mary
        </motion.h1>
        <p className="text-lg text-purple-500">Sube tus archivos Excel y fotos asociadas</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-md border-purple-200">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">Subir archivo Excel</h2>
            <Input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
            {file && <p className="mt-2 text-sm">Archivo seleccionado: {file.name}</p>}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md border-purple-200">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">Subir foto</h2>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {image && <img src={image} alt="preview" className="mt-4 rounded-xl max-h-64" />}
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-purple-700 mb-4">Vista de datos</h3>
        <div className="overflow-auto max-h-80 border rounded-xl p-4 bg-purple-50">
          <table className="min-w-full text-sm text-left text-purple-800">
            <thead className="text-xs uppercase bg-purple-100">
              <tr>
                <th className="px-4 py-2">Zona</th>
                <th className="px-4 py-2">Semana</th>
                <th className="px-4 py-2">Producto</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2">Canal</th>
                <th className="px-4 py-2">Precio</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{row.zona}</td>
                  <td className="px-4 py-2">{row.semana}</td>
                  <td className="px-4 py-2">{row.producto}</td>
                  <td className="px-4 py-2">{row.cantidad}</td>
                  <td className="px-4 py-2">{row.canal}</td>
                  <td className="px-4 py-2">€{row.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-purple-700 mb-4">Secciones adicionales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-purple-100 p-4">
            <CardContent>
              <h4 className="text-lg font-semibold mb-2">Puntos de venta de segundo canal</h4>
              <ul className="list-disc list-inside">
                {segundoCanal.map((item, idx) => (
                  <li key={idx}>{item.producto} - {item.zona}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-100 p-4">
            <CardContent>
              <h4 className="text-lg font-semibold mb-2">Puntos con precio &lt; 7€</h4>
              <ul className="list-disc list-inside">
                {preciosBajos.map((item, idx) => (
                  <li key={idx}>{item.producto} - €{item.precio} - {item.zona}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
