"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { cn } from "@/lib/utils";
import { GEORGIAN_CITIES, getCityName } from "@/lib/cities";
import { useLang } from "@/lib/i18n/client";
import type { TranslationKey } from "@/lib/i18n";

const SPECIES = ["DOG", "CAT", "BIRD", "RABBIT", "FISH", "RODENT", "REPTILE", "EXOTIC"] as const;

type InitialListing = {
  id: string;
  title: string;
  species: string;
  breed: string;
  ageValue: number;
  ageUnit: string;
  gender: string;
  purpose: string;
  price: number | null;
  description: string;
  vaccinationStatus: string;
  city: string;
  images: string[];
};

export function EditListingForm({ listing }: { listing: InitialListing }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: listing.title,
    species: listing.species,
    breed: listing.breed,
    ageValue: String(listing.ageValue),
    ageUnit: listing.ageUnit,
    gender: listing.gender,
    purpose: listing.purpose,
    price: listing.price ? String(listing.price) : "",
    description: listing.description,
    vaccinationStatus: listing.vaccinationStatus,
    city: listing.city,
  });
  const [images, setImages] = useState<string[]>(listing.images);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { t, locale } = useLang();

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFiles = async (files: FileList | null) => {
    if (!files || images.length >= 4) return;
    const toUpload = Array.from(files).slice(0, 4 - images.length);
    setUploading(true);
    setError("");
    try {
      const uploaded = await Promise.all(
        toUpload.map(async (file) => {
          const compressed = await imageCompression(file, {
            maxSizeMB: 0.8,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
          const fd = new FormData();
          fd.append("file", compressed, file.name);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          if (!res.ok) throw new Error("Upload failed");
          return (await res.json()).url as string;
        })
      );
      setImages((prev) => [...prev, ...uploaded]);
    } catch {
      setError(t("form_uploadFailed"));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) { setError(t("form_minOnePhoto")); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to save");
      router.push(`/pets/${listing.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  const chip = (active: boolean, color?: "green" | "purple") =>
    cn(
      "px-4 py-2 rounded-full text-sm border transition-all cursor-pointer",
      active
        ? color === "green" ? "bg-green-600 text-white border-green-600"
          : color === "purple" ? "bg-purple-600 text-white border-purple-600"
          : "bg-blue-700 text-white border-blue-700"
        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300"
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Photos */}
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t("form_photos")} <span className="text-red-500">*</span></p>
        <div className="grid grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
              <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="120px" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-xs bg-blue-700 text-white px-1.5 py-0.5 rounded font-medium">Cover</span>
              )}
            </div>
          ))}
          {images.length < 4 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Upload className="w-5 h-5" /><span className="text-xs">{t("form_addPhoto")}</span></>}
            </button>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {/* Purpose */}
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t("form_purpose")} <span className="text-red-500">*</span></p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => set("purpose", "SALE")} className={chip(form.purpose === "SALE")}>{t("form_forSale")}</button>
          <button type="button" onClick={() => set("purpose", "BREEDING")} className={chip(form.purpose === "BREEDING", "green")}>{t("form_forBreeding")}</button>
          <button type="button" onClick={() => set("purpose", "ADOPT")} className={chip(form.purpose === "ADOPT", "purple")}>{t("form_forAdopt")}</button>
        </div>
      </div>

      {/* Species */}
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t("form_species")} <span className="text-red-500">*</span></p>
        <div className="flex flex-wrap gap-2">
          {SPECIES.map((s) => (
            <button key={s} type="button" onClick={() => set("species", s)} className={chip(form.species === s)}>
              {t(`form_${s.toLowerCase()}` as TranslationKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Title & Breed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{t("form_titleLabel")} <span className="text-red-500">*</span></label>
          <input required maxLength={100} value={form.title} onChange={(e) => set("title", e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{t("form_breed")} <span className="text-red-500">*</span></label>
          <input required maxLength={100} value={form.breed} onChange={(e) => set("breed", e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>
      </div>

      {/* Age & Gender */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{t("form_age")} <span className="text-red-500">*</span></label>
          <input required type="number" min="1" value={form.ageValue} onChange={(e) => set("ageValue", e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{t("form_ageUnit")}</label>
          <select value={form.ageUnit} onChange={(e) => set("ageUnit", e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer">
            <option value="WEEKS">{t("form_weeks")}</option>
            <option value="MONTHS">{t("form_months")}</option>
            <option value="YEARS">{t("form_years")}</option>
          </select>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{t("form_gender")} <span className="text-red-500">*</span></p>
          <div className="flex gap-2">
            <button type="button" onClick={() => set("gender", "MALE")} className={chip(form.gender === "MALE")}>{t("form_male")}</button>
            <button type="button" onClick={() => set("gender", "FEMALE")} className={chip(form.gender === "FEMALE")}>{t("form_female")}</button>
          </div>
        </div>
      </div>

      {/* Price */}
      {form.purpose === "SALE" && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{t("form_price")}</label>
          <div className="relative max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₾</span>
            <input type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)}
              placeholder={t("form_leaveBlank")}
              className="w-full pl-8 pr-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
        </div>
      )}

      {/* Vaccination */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{t("form_vaccinationStatus")} <span className="text-red-500">*</span></label>
        <select required value={form.vaccinationStatus} onChange={(e) => set("vaccinationStatus", e.target.value)}
          className="w-full max-w-xs px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer">
          <option value="" disabled>{t("form_vaccinationStatus")}</option>
          <option value="FULL">{t("form_fullyVaccinated")}</option>
          <option value="PARTIAL">{t("form_partial")}</option>
          <option value="NONE">{t("form_notVaccinated")}</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{t("form_description")} <span className="text-red-500">*</span></label>
        <textarea required rows={4} maxLength={2000} value={form.description} onChange={(e) => set("description", e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/2000</p>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{t("form_city")} <span className="text-red-500">*</span></label>
        <select required value={form.city} onChange={(e) => set("city", e.target.value)}
          className="w-full max-w-xs px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer">
          <option value="" disabled>{t("form_selectCity")}</option>
          {GEORGIAN_CITIES.map((c) => (
            <option key={c} value={c}>{getCityName(c, locale)}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={() => router.back()}
          className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          {t("form_cancel")}
        </button>
        <button type="submit" disabled={submitting || uploading}
          className="flex-1 bg-blue-700 text-white font-semibold py-3 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer">
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />{t("form_saving")}</> : t("form_saveChanges")}
        </button>
      </div>
    </form>
  );
}
