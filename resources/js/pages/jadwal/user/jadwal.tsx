import { useState } from "react";

const dataGedung = {
  "Gedung A": {
    lantai: {
      "Lantai 1": ["Ruang 101", "Ruang 102"],
      "Lantai 2": ["Ruang 201", "Ruang 202"],
    },
  },
  "Gedung B": {
    lantai: {
      "Lantai 1": ["Ruang 103", "Ruang 104"],
      "Lantai 2": ["Ruang 203", "Ruang 204"],
    },
  },
} as const;

type GedungType = keyof typeof dataGedung;
type LantaiType = keyof typeof dataGedung[GedungType]["lantai"];
type RuanganType = typeof dataGedung[GedungType]["lantai"][LantaiType][number];

const jadwalData: Record<
  RuanganType,
  Partial<Record<string, string[]>>
> = {
  "Ruang 101": {
    Senin: ["08:00 - 10:00 Matematika", "10:00 - 11:00 Fisika"],
    Selasa: ["09:00 - 10:30 Kimia"],
  },
  "Ruang 102": {
    Rabu: ["08:00 - 09:30 Biologi"],
  },
  "Ruang 201": {},
  "Ruang 202": {},
  "Ruang 103": {},
  "Ruang 104": {},
  "Ruang 203": {},
  "Ruang 204": {},
};

export function Jadwal() {
  const [gedung, setGedung] = useState<GedungType>("Gedung A");
  const [lantai, setLantai] = useState<LantaiType>("Lantai 1");
  const [ruangan, setRuangan] = useState<RuanganType>("Ruang 101");

  const daftarLantai = Object.keys(dataGedung[gedung].lantai) as LantaiType[];
  const daftarRuangan = dataGedung[gedung].lantai[lantai];

  function handleGedungChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const gedungTerpilih = e.target.value as GedungType;
    setGedung(gedungTerpilih);

    const lantaiDefault = Object.keys(dataGedung[gedungTerpilih].lantai)[0] as LantaiType;
    setLantai(lantaiDefault);

    const ruanganDefault = dataGedung[gedungTerpilih].lantai[lantaiDefault][0];
    setRuangan(ruanganDefault);
  }

  function handleLantaiChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const lantaiTerpilih = e.target.value as LantaiType;
    setLantai(lantaiTerpilih);

    const ruanganDefault = dataGedung[gedung].lantai[lantaiTerpilih][0];
    setRuangan(ruanganDefault);
  }

  function handleRuanganChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setRuangan(e.target.value as RuanganType);
  }

  const jadwalRuangan = jadwalData[ruangan] || {};

  const hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dropdown Pilihan */}
      <div className="flex flex-wrap gap-6 mb-8 justify-center">
        <select
          value={gedung}
          onChange={handleGedungChange}
          className="border border-gray-300 rounded-md px-5 py-3 text-base shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition
                     hover:border-blue-400 cursor-pointer"
          aria-label="Pilih Gedung"
        >
          {Object.keys(dataGedung).map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          value={lantai}
          onChange={handleLantaiChange}
          className="border border-gray-300 rounded-md px-5 py-3 text-base shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition
                     hover:border-blue-400 cursor-pointer"
          aria-label="Pilih Lantai"
        >
          {daftarLantai.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <select
          value={ruangan}
          onChange={handleRuanganChange}
          className="border border-gray-300 rounded-md px-5 py-3 text-base shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition
                     hover:border-blue-400 cursor-pointer"
          aria-label="Pilih Ruangan"
        >
          {daftarRuangan.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Judul Dinamis */}
      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900 tracking-wide">
        Jadwal Ruangan - {gedung} ({lantai})
      </h1>

      {/* Tombol Tambah Jadwal */}
      <div className="mb-6 text-right">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700
                           transition font-semibold text-base">
          ➕ Tambah Jadwal
        </button>
      </div>

      {/* Tabel Jadwal */}
      <table className="min-w-full bg-white shadow-lg rounded-md overflow-hidden text-base text-center">
  <thead className="bg-blue-600 text-white uppercase text-sm select-none">
    <tr>
      {hari.map((h) => (
        <th key={h} className="px-6 py-4 border-r last:border-r-0">
          {h}
        </th>
      ))}
    </tr>
  </thead>
  <tbody className="text-gray-800">
    <tr>
      {hari.map((h) => (
        <td
          key={h}
          className="px-6 py-4 align-top space-y-4 border-r last:border-r-0"
        >
          {jadwalRuangan[h] && jadwalRuangan[h].length > 0 ? (
            jadwalRuangan[h].map((item, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-md px-4 py-3 shadow-sm flex flex-col items-start hover:bg-blue-50 transition"
              >
                <span className="font-medium text-gray-900">{item}</span>
                <button
                  type="button"
                  className="text-blue-600 hover:underline text-sm font-semibold mt-1 flex items-center gap-1"
                  onClick={() => alert(`Detail untuk: ${item}`)}
                >
                  Detail

                </button>
              </div>
            ))
          ) : (
            <span className="text-gray-400 italic">Tidak ada jadwal</span>
          )}
        </td>
      ))}
    </tr>
  </tbody>
    </table>



    </div>
  );
}
