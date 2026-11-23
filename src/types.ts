export type StatusTugas = "Belum Selesai" | "Selesai";

export type FilterStatus = "Semua" | StatusTugas;

export interface TugasKuliah {
  id: number;
  mataKuliah: string;
  judulTugas: string;
  sks: number;
  deadline: string;
  selesai: boolean;
  status: StatusTugas;
}

export interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export function simpanKeStorage<T>(kunci: string, data: T): void {
  localStorage.setItem(kunci, JSON.stringify(data));
}

export function ambilDariStorage<T>(kunci: string, nilaiDefault: T): T {
  const dataTersimpan = localStorage.getItem(kunci);
  if (!dataTersimpan) {
    return nilaiDefault;
  }
  return JSON.parse(dataTersimpan) as T;
}

export function saringData<T>(items: T[], predikat: (item: T) => boolean): T[] {
  return items.filter(predikat);
}